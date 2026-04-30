import { randomUUID } from 'crypto';

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  ROLE_MISMATCH = 'ROLE_MISMATCH',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export type StandardErrorPayload = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    correlationId: string;
    timestamp: string;
    details?: Record<string, unknown>;
  };
};

export function buildError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
  correlationSeed?: string
): StandardErrorPayload {
  const base = (correlationSeed || randomUUID()).replace(/-/g, '');
  const correlationId = `req_${base.slice(0, 16)}`;
  return {
    success: false,
    error: {
      code,
      message,
      correlationId,
      timestamp: new Date().toISOString(),
      ...(details ? { details } : {}),
    },
  };
}

export const HTTP_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.ROLE_MISMATCH]: 403,
  [ErrorCode.SESSION_EXPIRED]: 401,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.VALIDATION_ERROR]: 422,
  [ErrorCode.PAYMENT_FAILED]: 402,
  [ErrorCode.PAYMENT_PENDING]: 202,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
};

/** Map legacy AppError string codes to the public ErrorCode contract. */
export function legacyCodeToErrorCode(code: string, statusCode: number): ErrorCode {
  const c = (code || '').toUpperCase();
  if (c === 'UNAUTHORIZED') return ErrorCode.UNAUTHORIZED;
  if (c === 'SESSION_EXPIRED') return ErrorCode.SESSION_EXPIRED;
  if (c === 'ROLE_MISMATCH' || c === 'FORBIDDEN') return ErrorCode.ROLE_MISMATCH;
  if (c === 'NOT_FOUND' || c === 'NO_DATA' || c === 'NOT_READY') return ErrorCode.NOT_FOUND;
  if (c === 'PAYMENT_FAILED' || c === 'INVALID_SIGNATURE') return ErrorCode.PAYMENT_FAILED;
  if (c === 'PAYMENT_PENDING') return ErrorCode.PAYMENT_PENDING;
  if (c === 'INTERNAL_SECRET_MISSING' || c === 'SERVICE_UNAVAILABLE') return ErrorCode.SERVICE_UNAVAILABLE;
  if (statusCode === 401) return ErrorCode.UNAUTHORIZED;
  if (statusCode === 403) return ErrorCode.ROLE_MISMATCH;
  if (statusCode === 404) return ErrorCode.NOT_FOUND;
  if (statusCode === 402) return ErrorCode.PAYMENT_FAILED;
  if (statusCode === 503) return ErrorCode.SERVICE_UNAVAILABLE;
  if (statusCode >= 500) return ErrorCode.INTERNAL_ERROR;
  return ErrorCode.VALIDATION_ERROR;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}
