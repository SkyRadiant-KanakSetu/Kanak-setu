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

echo "[deploy] prisma generate + schema sync"
npm run db:generate
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss

echo "[deploy] building apps"
npm run build

echo "[deploy] restarting pm2 apps"
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

echo "[deploy] smoke check"
API_BASE="http://localhost:4000/api/v1" npm run smoke:local

echo "[deploy] DONE"
