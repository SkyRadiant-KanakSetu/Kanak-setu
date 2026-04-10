import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { UserRole } from '@prisma/client';
import { getEnv } from '../config/env';

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare global {
  // Express typing pattern: augment Request on the Express namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required for Express.Request merge
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      requestId?: string;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid token'));
  }
  try {
    const { JWT_SECRET } = getEnv();
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as AuthPayload;
    req.auth = payload;
    next();
  } catch {
    next(new AppError(401, 'UNAUTHORIZED', 'Token expired or invalid'));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'Insufficient permissions'));
    }
    next();
  };
}

export function requireAnyAdmin(req: Request, _res: Response, next: NextFunction) {
  const adminRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN_OPS', 'COMPLIANCE_ADMIN', 'FINANCE_ADMIN'];
  if (!req.auth || !adminRoles.includes(req.auth.role)) {
    return next(new AppError(403, 'FORBIDDEN', 'Admin access required'));
  }
  next();
}
