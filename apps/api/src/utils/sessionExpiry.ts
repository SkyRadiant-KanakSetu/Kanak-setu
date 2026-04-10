import { getEnv } from '../config/env';

/** Parses JWT_REFRESH_EXPIRY like `7d`, `12h`, `30m`, `900s`. Defaults to 7d. */
export function sessionExpiresAt(): Date {
  const raw = getEnv().JWT_REFRESH_EXPIRY.trim();
  const m = /^(\d+)\s*([dhms])$/i.exec(raw);
  if (!m) return new Date(Date.now() + 7 * 86400000);
  const n = parseInt(m[1], 10);
  const u = m[2].toLowerCase();
  const ms = u === 'd' ? n * 86400000 : u === 'h' ? n * 3600000 : u === 'm' ? n * 60000 : n * 1000;
  return new Date(Date.now() + ms);
}
