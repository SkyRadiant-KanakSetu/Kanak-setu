const fs = require('fs');
const path = require('path');

const APP_DIR = process.env.APP_DIR || '/opt/kanak-setu';

/** Minimal KEY=VAL parser (no dotenv dep — PM2 loads this file before cwd/node_modules may resolve). */
function parseDotEnv(buf) {
  const out = {};
  const text = buf.toString('utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/**
 * Bakes infra/prod/.env.production into PM2's process env (survives reboot, no missing DATABASE_URL
 * in fresh systemd sessions; matches what deploy-vps.sh sources for builds).
 */
function readProdFileEnv() {
  const p = path.join(APP_DIR, 'infra', 'prod', '.env.production');
  if (!fs.existsSync(p)) return {};
  try {
    return parseDotEnv(fs.readFileSync(p));
  } catch {
    return {};
  }
}

const fileEnv = readProdFileEnv();
/** Single source for API listen port: infra/prod/.env.production `PORT` (default 4000). Caddy must match (KANAK_API_PORT). */
const apiListenPort = String(fileEnv.PORT ?? '').trim() || '4000';

function nextRuntimeEnv() {
  return {
    ...Object.fromEntries(
      Object.entries(fileEnv).filter(([k]) => k.startsWith('NEXT_PUBLIC_'))
    ),
  };
}

function appEnv(overrides) {
  return { ...fileEnv, ...overrides };
}

module.exports = {
  apps: [
    {
      name: 'kanak-api',
      cwd: APP_DIR,
      // Run built server directly (not `npm run start -w`) so PM2 PORT reaches the Node process
      // that calls listen(), PM2 pid matches ss, and no stale npm child can hold another port.
      script: 'node',
      args: 'apps/api/dist/server.js',
      env: appEnv({
        NODE_ENV: 'production',
        PORT: apiListenPort,
      }),
    },
    {
      name: 'kanak-donor-web',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/donor-web',
      env: { NODE_ENV: 'production', PORT: '3000', ...nextRuntimeEnv() },
    },
    {
      name: 'kanak-institution-web',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/institution-web',
      env: { NODE_ENV: 'production', PORT: '3001', ...nextRuntimeEnv() },
    },
    {
      name: 'kanak-admin-web',
      cwd: APP_DIR,
      script: 'npm',
      args: 'run start -w @kanak-setu/admin-web',
      env: { NODE_ENV: 'production', PORT: '3002', ...nextRuntimeEnv() },
    },
    {
      name: 'kanak-outbox-worker',
      cwd: APP_DIR,
      script: 'node',
      args: 'apps/api/dist/workers/outboxWorker.js',
      restart_delay: 5000,
      max_restarts: 10,
      out_file: path.join(APP_DIR, 'logs', 'outbox-worker.log'),
      error_file: path.join(APP_DIR, 'logs', 'outbox-worker.log'),
      env: appEnv({
        NODE_ENV: 'production',
      }),
    },
  ],
};
