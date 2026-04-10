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
