import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { getEnv } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { UserRole } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { sessionExpiresAt } from '../../utils/sessionExpiry';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

function signAccess(userId: string, role: UserRole) {
  const { JWT_SECRET, JWT_ACCESS_EXPIRY } = getEnv();
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  } as jwt.SignOptions);
}

function signRefresh() {
  return uuid();
}

export async function register(data: {
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
}) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, ...(data.phone ? [{ phone: data.phone }] : [])] },
  });
  if (existing) throw new AppError(409, 'USER_EXISTS', 'Email or phone already registered');

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const role = data.role || 'DONOR';

  const user = await prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      passwordHash,
      role,
      ...(role === 'DONOR' && data.firstName
        ? {
            donorProfile: {
              create: {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
              },
            },
          }
        : {}),
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
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.deletedAt)
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  if (!user.isActive) throw new AppError(403, 'ACCOUNT_DISABLED', 'Account is disabled');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

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

  return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
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
