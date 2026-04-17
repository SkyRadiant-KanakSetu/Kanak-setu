import { Router, Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { success } from '../../utils/response';
import { auditLog } from '../../utils/auditLog';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    await auditLog({
      userId: result.user.id,
      action: 'REGISTER',
      entity: 'User',
      entityId: result.user.id,
      req,
    });
    success(res, result, undefined, 201);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(
      req.body.email,
      req.body.password,
      req.ip,
      req.headers['user-agent']
    );
    await auditLog({
      userId: result.user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: result.user.id,
      req,
    });
    success(res, result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login/phone/request-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.requestDonorPhoneOtp(req.body.phone);
    await auditLog({
      action: 'OTP_REQUEST',
      entity: 'Auth',
      metadata: { phone: req.body.phone, channel: 'SMS', purpose: 'DONOR_LOGIN' },
      req,
    });
    success(res, result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login/phone/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyDonorPhoneOtp({
      phone: req.body.phone,
      otp: req.body.otp,
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
    await auditLog({
      userId: result.user.id,
      action: 'LOGIN_OTP',
      entity: 'User',
      entityId: result.user.id,
      req,
    });
    success(res, result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/signup/phone/request-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.requestDonorSignupPhoneOtp(req.body.phone);
    await auditLog({
      action: 'OTP_REQUEST',
      entity: 'Auth',
      metadata: { phone: req.body.phone, channel: 'SMS', purpose: 'DONOR_SIGNUP' },
      req,
    });
    success(res, result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/signup/phone/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyDonorSignupPhoneOtp({
      phone: req.body.phone,
      otp: req.body.otp,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
    await auditLog({
      userId: result.user.id,
      action: 'REGISTER_OTP',
      entity: 'User',
      entityId: result.user.id,
      req,
    });
    success(res, result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    success(res, result);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.body.refreshToken);
    success(res, { message: 'Logged out' });
  } catch (e) {
    next(e);
  }
});
