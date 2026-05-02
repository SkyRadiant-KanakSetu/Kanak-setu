import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  AppError,
  buildError,
  ErrorCode,
  HTTP_STATUS,
  legacyCodeToErrorCode,
} from '../lib/errors';
import { captureRequestException } from '../lib/sentry';

export { AppError } from '../lib/errors';

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'cardnumber', 'cvv'];

function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      SENSITIVE_FIELDS.some((f) => k.toLowerCase().includes(f)) ? '[REDACTED]' : v,
    ])
  );
}

export function errorHandler(
  err: Error & { code?: ErrorCode; statusCode?: number; details?: Record<string, unknown> },
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    const code = legacyCodeToErrorCode(err.code, err.statusCode);
    const details =
      err.details && typeof err.details === 'object' && !Array.isArray(err.details)
        ? (err.details as Record<string, unknown>)
        : err.details !== undefined
          ? { value: err.details as unknown }
          : undefined;
    const response = buildError(code, err.message, details, req.requestId);
    const status = err.statusCode;

    console.error(
      JSON.stringify({
        level: 'error',
        correlationId: response.error.correlationId,
        code,
        legacyCode: err.code,
        message: err.message,
        route: `${req.method} ${req.path}`,
        body: sanitize((req.body as Record<string, unknown>) ?? {}),
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        timestamp: response.error.timestamp,
      })
    );
    captureRequestException(err, req, {
      correlationId: response.error.correlationId,
      errorCode: code,
    });

    return res.status(status).json(response);
  }

  if (err instanceof ZodError) {
    const response = buildError(
      ErrorCode.VALIDATION_ERROR,
      'Invalid request',
      err.flatten() as unknown as Record<string, unknown>,
      req.requestId
    );
    console.error(
      JSON.stringify({
        level: 'error',
        correlationId: response.error.correlationId,
        code: ErrorCode.VALIDATION_ERROR,
        message: err.message,
        route: `${req.method} ${req.path}`,
        body: sanitize((req.body as Record<string, unknown>) ?? {}),
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        timestamp: response.error.timestamp,
      })
    );
    captureRequestException(err, req, {
      correlationId: response.error.correlationId,
      errorCode: ErrorCode.VALIDATION_ERROR,
    });
    return res.status(HTTP_STATUS[ErrorCode.VALIDATION_ERROR]).json(response);
  }

  const code = ErrorCode.INTERNAL_ERROR;
  const response = buildError(code, 'An unexpected error occurred', undefined, req.requestId);
  console.error(
    JSON.stringify({
      level: 'error',
      correlationId: response.error.correlationId,
      code,
      message: err.message,
      route: `${req.method} ${req.path}`,
      body: sanitize((req.body as Record<string, unknown>) ?? {}),
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      timestamp: response.error.timestamp,
    })
  );
  captureRequestException(err, req, {
    correlationId: response.error.correlationId,
    errorCode: code,
  });
  return res.status(500).json(response);
}
