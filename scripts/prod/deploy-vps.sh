#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
BRANCH="${BRANCH:-main}"

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

echo "[deploy] installing deps"
npm ci

echo "[deploy] loading production env"
if [[ ! -f "infra/prod/.env.production" ]]; then
  echo "[deploy] ERROR: infra/prod/.env.production missing"
  exit 1
fi
set -a
source infra/prod/.env.production
set +a

echo "[deploy] prisma generate + database schema"
npm run db:generate
if [[ -d "prisma/migrations" ]] && compgen -G "prisma/migrations/*/migration.sql" >/dev/null; then
  echo "[deploy] applying prisma migrations (migrate deploy)"
  npx prisma migrate deploy --schema=prisma/schema.prisma
else
  echo "[deploy] no migration folders found, using prisma db push (bootstrap only)"
  npx prisma db push --schema=prisma/schema.prisma --accept-data-loss
fi

echo "[deploy] building apps"
npm run build

echo "[deploy] restarting pm2 apps"
pm2 startOrReload ecosystem.config.cjs
pm2 save

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

echo "[deploy] smoke check"
API_BASE="http://localhost:4000/api/v1" npm run smoke:local

echo "[deploy] DONE"
