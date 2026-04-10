import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

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

function errorEnvelope(req: Request, res: Response, status: number, body: Record<string, unknown>) {
  const requestId = req.requestId;
  return res.status(status).json({
    success: false,
    error: { ...body, requestId },
  });
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return errorEnvelope(req, res, err.statusCode, {
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }
  if (err instanceof ZodError) {
    return errorEnvelope(req, res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request',
      details: err.flatten(),
    });
  }
  console.error('Unhandled error:', err);
  return errorEnvelope(req, res, 500, {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
}
