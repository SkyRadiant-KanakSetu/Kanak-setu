import { parseServerEnv, type ServerEnv } from '@kanak-setu/config';

let cached: ServerEnv | null = null;

/**
 * Validates process.env once. In non-production, applies a long dev JWT default if missing/short
 * so local `infra/.env.example` keeps working when copied without editing JWT.
 */
export function getEnv(): ServerEnv {
  if (cached) return cached;
  const env = { ...process.env } as NodeJS.ProcessEnv;
  const isProd = env.NODE_ENV === 'production';
  if (!isProd && (!env.JWT_SECRET || env.JWT_SECRET.length < 32)) {
    env.JWT_SECRET = 'kanak-setu-local-dev-only-secret-min-32-chars!';
  }
  cached = parseServerEnv(env);
  return cached;
}
