import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/** Repo root from `apps/api/src` or `apps/api/dist`. */
function repoRoot(): string {
  return path.resolve(__dirname, '../../..');
}

const root = repoRoot();
const candidates = [
  path.join(root, 'infra', 'prod', '.env.production'),
  path.join(root, 'infra', '.env'),
  path.join(root, 'infra', '.env.local'),
  path.join(root, 'infra', '.env.example'),
];

for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: false });
    break;
  }
}

export const LOADED_ENV_PATH = candidates.find((p) => fs.existsSync(p)) ?? null;
