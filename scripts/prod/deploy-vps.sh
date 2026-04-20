#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
BRANCH="${BRANCH:-main}"
export APP_DIR

echo "[deploy] app dir: ${APP_DIR}"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "[deploy] ERROR: ${APP_DIR} does not exist"
  exit 1
fi

cd "${APP_DIR}"

echo "[deploy] updating source"
git fetch --all --prune
git checkout "${BRANCH}"
git pull origin "${BRANCH}"

echo "[deploy] installing deps (devDependencies required for TypeScript / Next builds)"
# Root shell or systemd often sets NODE_ENV=production; that makes npm skip devDeps → missing @types/react, etc.
NODE_ENV=development npm ci

echo "[deploy] loading production env"
if [[ ! -f "infra/prod/.env.production" ]]; then
  echo "[deploy] ERROR: infra/prod/.env.production missing"
  exit 1
fi
set -a
source infra/prod/.env.production
set +a
export DATABASE_URL

echo "[deploy] prisma generate + database schema"
npm run db:generate
if [[ -d "prisma/migrations" ]] && compgen -G "prisma/migrations/*/migration.sql" >/dev/null; then
  echo "[deploy] applying prisma migrations (migrate deploy)"
  npx prisma migrate deploy --schema=prisma/schema.prisma
else
  echo "[deploy] no migration folders found, using prisma db push (bootstrap only)"
  npx prisma db push --schema=prisma/schema.prisma --accept-data-loss
fi

if [[ "${RUN_DB_SEED:-0}" == "1" ]]; then
  echo "[deploy] RUN_DB_SEED=1 → running db seed"
  npm run db:seed
else
  echo "[deploy] RUN_DB_SEED!=1 → skipping db seed for production safety"
  if [[ -z "${SKIP_DEPLOY_SMOKE+x}" ]]; then
    SKIP_DEPLOY_SMOKE=1
    export SKIP_DEPLOY_SMOKE
    echo "[deploy] auto-set SKIP_DEPLOY_SMOKE=1 (seed skipped)"
  fi
fi

if [[ -f "infra/prod/.env.production" ]] && ! grep -q '^NEXT_PUBLIC_API_BASE_URL=' infra/prod/.env.production 2>/dev/null; then
  echo "[deploy] WARN: NEXT_PUBLIC_API_BASE_URL missing in infra/prod/.env.production"
  echo "[deploy]        Add e.g. NEXT_PUBLIC_API_BASE_URL=https://api.kanaksetu.com/api/v1 so web apps call the API directly (CORS must allow your domains). Then rebuild."
fi

echo "[deploy] building apps"
npm run build

echo "[deploy] restarting pm2 apps"
pm2 startOrReload ecosystem.config.cjs
pm2 save
sleep 2

echo "[deploy] waiting for API to bind..."
for i in $(seq 1 30); do
  if curl -fsS "http://localhost:4000/api/v1/health" >/dev/null 2>&1; then
    echo "[deploy] API is up"
    break
  fi
  if [[ "${i}" -eq 30 ]]; then
    echo "[deploy] WARN: API did not respond; check: pm2 logs kanak-api --lines 80"
  fi
  sleep 1
done

if [[ "${SKIP_DEPLOY_SMOKE:-0}" == "1" ]]; then
  echo "[deploy] SKIP_DEPLOY_SMOKE=1 — skipping smoke (run: API_BASE=http://localhost:4000/api/v1 npm run smoke:local)"
else
  echo "[deploy] smoke check"
  API_BASE="http://localhost:4000/api/v1" npm run smoke:local
fi

echo "[deploy] DONE"
