import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/** Repo root from `apps/api/src` or `apps/api/dist`. */
function repoRoot(): string {
  return path.resolve(__dirname, '../../..');
}

const root = repoRoot();
const isProd = process.env.NODE_ENV === 'production';
// Never use .env.example in production: wrong secrets cause silent startup failures and 502 from Caddy.
const candidates = isProd
  ? [path.join(root, 'infra', 'prod', '.env.production'), path.join(root, 'infra', '.env')]
  : [
      path.join(root, 'infra', 'prod', '.env.production'),
      path.join(root, 'infra', '.env'),
      path.join(root, 'infra', '.env.local'),
      path.join(root, 'infra', '.env.example'),
    ];

// Preserve bind port from the parent process (e.g. PM2) if set before dotenv runs.
const incomingPort = process.env.PORT;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: false });
    break;
  }
}
if (incomingPort !== undefined && incomingPort !== '') {
  process.env.PORT = incomingPort;
}

export const LOADED_ENV_PATH = candidates.find((p) => fs.existsSync(p)) ?? null;
