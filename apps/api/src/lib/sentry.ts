import * as Sentry from '@sentry/node';
import type { Request } from 'express';

export function isSentryEnabled(): boolean {
  return Boolean(process.env.SENTRY_DSN_API);
}

export function initSentry(): void {
  if (!isSentryEnabled()) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN_API,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development',
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0.1,
  });
}

export function captureRequestException(
  err: unknown,
  req: Request,
  tags: { correlationId: string; errorCode: string }
): void {
  if (!isSentryEnabled()) return;

  Sentry.withScope((scope) => {
    scope.setTag('correlationId', tags.correlationId);
    scope.setTag('errorCode', tags.errorCode);
    scope.setTag('route', `${req.method} ${req.path}`);
    scope.setContext('request', {
      method: req.method,
      path: req.path,
      requestId: req.requestId,
      correlationId: tags.correlationId,
    });
    Sentry.captureException(err);
  });
}

export function captureProcessException(err: unknown, origin: string): void {
  if (!isSentryEnabled()) return;

  Sentry.withScope((scope) => {
    scope.setTag('origin', origin);
    Sentry.captureException(err);
  });
}

export { Sentry };
