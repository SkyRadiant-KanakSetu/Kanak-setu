import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { getEnv } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { UserRole } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { sessionExpiresAt } from '../../utils/sessionExpiry';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
const OTP_TTL_MINUTES = parseInt(process.env.DONOR_PHONE_OTP_TTL_MIN || '5');
const OTP_MAX_ATTEMPTS = parseInt(process.env.DONOR_PHONE_OTP_MAX_ATTEMPTS || '5');
const OTP_REQUEST_WINDOW_MIN = parseInt(process.env.DONOR_PHONE_OTP_WINDOW_MIN || '10');
const OTP_REQUEST_LIMIT = parseInt(process.env.DONOR_PHONE_OTP_REQUEST_LIMIT || '3');

/** Normalize email so admin-created and login attempts match (trim + lowercase). */
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function signAccess(userId: string, role: UserRole) {
  const { JWT_SECRET, JWT_ACCESS_EXPIRY } = getEnv();
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  } as jwt.SignOptions);
}

function signRefresh() {
  return uuid();
}

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    throw new AppError(400, 'INVALID_PHONE', 'Phone number must be between 10 and 15 digits');
  }
  return digits;
}

function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp(phone: string, otp: string) {
  const { JWT_SECRET } = getEnv();
  return crypto.createHash('sha256').update(`${phone}:${otp}:${JWT_SECRET}`).digest('hex');
}

function isHashEqual(a: string, b: string) {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

async function issueSessionTokens(user: { id: string; role: UserRole }, ip?: string, ua?: string) {
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const accessToken = signAccess(user.id, user.role);
  const refreshToken = signRefresh();
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: sessionExpiresAt(),
      ipAddress: ip,
      userAgent: ua,
    },
  });

  return { accessToken, refreshToken };
}

async function assertOtpRequestRateLimit(phone: string, purpose: string) {
  const windowStart = new Date(Date.now() - OTP_REQUEST_WINDOW_MIN * 60 * 1000);
  const recentRequests = await prisma.phoneOtpChallenge.count({
    where: {
      phone,
      purpose,
      createdAt: { gte: windowStart },
    },
  });
  if (recentRequests >= OTP_REQUEST_LIMIT) {
    throw new AppError(429, 'OTP_RATE_LIMITED', 'Too many OTP requests. Try again later');
  }
}

async function createOtpChallenge(params: { phone: string; purpose: string; userId?: string }) {
  const otp = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await prisma.phoneOtpChallenge.create({
    data: {
      phone: params.phone,
      purpose: params.purpose,
      otpHash: hashOtp(params.phone, otp),
      expiresAt,
      maxAttempts: OTP_MAX_ATTEMPTS,
    },
  });

  await prisma.notificationLog.create({
    data: {
      userId: params.userId,
      channel: 'SMS',
      type: params.purpose,
      recipient: params.phone,
      body: `Your Kanak Setu OTP is ${otp}. Valid for ${OTP_TTL_MINUTES} minutes.`,
      status: 'SENT',
      sentAt: new Date(),
    },
  });

  const isProd = process.env.NODE_ENV === 'production';
  const exposeOtpOnWeb = process.env.EXPOSE_OTP_ON_WEB === '1';
  return {
    message: 'OTP sent to registered phone number',
    expiresInSeconds: OTP_TTL_MINUTES * 60,
    ...(!isProd || exposeOtpOnWeb ? { devOtp: otp } : {}),
  };
}

async function consumeOtpChallenge(phone: string, purpose: string, otpInput: string) {
  const otp = otpInput.trim();
  if (!/^\d{6}$/.test(otp)) throw new AppError(400, 'INVALID_OTP', 'OTP must be 6 digits');

  const challenge = await prisma.phoneOtpChallenge.findFirst({
    where: { phone, purpose, usedAt: null },
    orderBy: { createdAt: 'desc' },
  });
  if (!challenge || challenge.expiresAt < new Date()) {
    throw new AppError(401, 'OTP_EXPIRED', 'OTP expired. Please request a new OTP');
  }
  if (challenge.attempts >= challenge.maxAttempts) {
    throw new AppError(401, 'OTP_LOCKED', 'Too many invalid attempts. Request a new OTP');
  }

  const providedHash = hashOtp(phone, otp);
  const valid = isHashEqual(challenge.otpHash, providedHash);
  if (!valid) {
    await prisma.phoneOtpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    throw new AppError(401, 'INVALID_OTP', 'Invalid OTP');
  }

  await prisma.phoneOtpChallenge.updateMany({
    where: { phone, purpose, usedAt: null },
    data: { usedAt: new Date() },
  });
}

export async function register(data: {
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
}) {
  const role = data.role || 'DONOR';
  if (role === 'DONOR') {
    throw new AppError(
      400,
      'DONOR_EMAIL_AUTH_DISABLED',
      'Donor email/password signup is disabled. Use phone OTP signup'
    );
  }

  const emailNorm = normalizeEmail(data.email);
  const passwordPlain = typeof data.password === 'string' ? data.password.trim() : data.password;
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: emailNorm, mode: 'insensitive' } },
        ...(data.phone ? [{ phone: data.phone }] : []),
      ],
    },
  });
  if (existing) throw new AppError(409, 'USER_EXISTS', 'Email or phone already registered');

  const passwordHash = await bcrypt.hash(passwordPlain, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: emailNorm,
      phone: data.phone,
      passwordHash,
      role,
    },
    select: { id: true, email: true, role: true },
  });

  const accessToken = signAccess(user.id, user.role);
  const refreshToken = signRefresh();
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: sessionExpiresAt(),
    },
  });

  return { user, accessToken, refreshToken };
}

export async function login(email: string, password: string, ip?: string, ua?: string) {
  const emailNorm = normalizeEmail(email);
  const passwordPlain = typeof password === 'string' ? password.trim() : password;
  const user = await prisma.user.findFirst({
    where: { email: { equals: emailNorm, mode: 'insensitive' } },
  });
  if (!user || user.deletedAt)
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  if (user.role === 'DONOR') {
    throw new AppError(
      400,
      'DONOR_EMAIL_AUTH_DISABLED',
      'Donor email/password login is disabled. Use phone OTP login'
    );
  }
  if (!user.isActive) throw new AppError(403, 'ACCOUNT_DISABLED', 'Account is disabled');

  const valid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  const { accessToken, refreshToken } = await issueSessionTokens(user, ip, ua);

  return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
}

export async function requestDonorPhoneOtp(phoneInput: string) {
  const phone = normalizePhone(phoneInput);
  const user = await prisma.user.findFirst({
    where: { phone, role: 'DONOR', isActive: true, deletedAt: null },
    select: { id: true, phone: true, role: true },
  });
  if (!user) throw new AppError(404, 'DONOR_NOT_FOUND', 'No active donor account found for phone');
  await assertOtpRequestRateLimit(phone, 'DONOR_LOGIN');
  return createOtpChallenge({ phone, purpose: 'DONOR_LOGIN', userId: user.id });
}

export async function requestDonorSignupPhoneOtp(phoneInput: string) {
  const phone = normalizePhone(phoneInput);
  const existing = await prisma.user.findFirst({
    where: { phone, deletedAt: null },
    select: { id: true, role: true, isActive: true },
  });
  if (existing?.role === 'DONOR') {
    throw new AppError(409, 'ACCOUNT_EXISTS', 'Donor account already exists. Please use login');
  }
  if (existing) {
    throw new AppError(409, 'PHONE_IN_USE', 'Phone number is already associated with another account');
  }

  await assertOtpRequestRateLimit(phone, 'DONOR_SIGNUP');
  return createOtpChallenge({ phone, purpose: 'DONOR_SIGNUP' });
}

export async function verifyDonorPhoneOtp(params: {
  phone: string;
  otp: string;
  ip?: string;
  ua?: string;
}) {
  const phone = normalizePhone(params.phone);
  await consumeOtpChallenge(phone, 'DONOR_LOGIN', params.otp);

  const user = await prisma.user.findFirst({
    where: { phone, role: 'DONOR', isActive: true, deletedAt: null },
    select: { id: true, email: true, role: true },
  });
  if (!user) throw new AppError(404, 'DONOR_NOT_FOUND', 'No active donor account found for phone');

  const { accessToken, refreshToken } = await issueSessionTokens(user, params.ip, params.ua);
  return { user, accessToken, refreshToken };
}

export async function verifyDonorSignupPhoneOtp(params: {
  phone: string;
  otp: string;
  firstName: string;
  lastName: string;
  ip?: string;
  ua?: string;
}) {
  const phone = normalizePhone(params.phone);
  const firstName = params.firstName?.trim();
  const lastName = params.lastName?.trim();
  if (!firstName || !lastName) {
    throw new AppError(400, 'INVALID_INPUT', 'First name and last name are required');
  }

  await consumeOtpChallenge(phone, 'DONOR_SIGNUP', params.otp);

  const existing = await prisma.user.findFirst({
    where: { phone, deletedAt: null },
    select: { id: true },
  });
  if (existing) {
    throw new AppError(409, 'ACCOUNT_EXISTS', 'Account already exists for this phone');
  }

  const randomPass = crypto.randomBytes(16).toString('hex');
  const passwordHash = await bcrypt.hash(randomPass, BCRYPT_ROUNDS);
  const email = `donor.${phone}.${Date.now()}@kanaksetu.local`;
  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      role: 'DONOR',
      donorProfile: {
        create: {
          firstName,
          lastName,
        },
      },
    },
    select: { id: true, email: true, role: true },
  });

  const { accessToken, refreshToken } = await issueSessionTokens(user, params.ip, params.ua);
  return { user, accessToken, refreshToken };
}

export async function refresh(token: string) {
  const session = await prisma.session.findUnique({ where: { refreshToken: token } });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    throw new AppError(401, 'SESSION_EXPIRED', 'Refresh token expired');
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.isActive)
    throw new AppError(401, 'UNAUTHORIZED', 'User not found or disabled');

  // Rotate refresh token
  const newRefresh = signRefresh();
  await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken: newRefresh, expiresAt: sessionExpiresAt() },
  });

  return { accessToken: signAccess(user.id, user.role), refreshToken: newRefresh };
}

export async function logout(token: string) {
  await prisma.session.deleteMany({ where: { refreshToken: token } });
}
