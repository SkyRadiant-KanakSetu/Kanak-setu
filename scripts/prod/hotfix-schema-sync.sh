#!/usr/bin/env bash
# Hotfix helper for Prisma schema drift on production.
# Use when API logs show P2022 column-not-found errors after deploy.
#
#   cd /opt/kanak-setu
#   bash scripts/prod/hotfix-schema-sync.sh
#
# Optional:
#   bash scripts/prod/hotfix-schema-sync.sh --flush-logs
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
ENV_FILE="${APP_DIR}/infra/prod/.env.production"
FLUSH_LOGS=0

if [[ "${1:-}" == "--flush-logs" ]]; then
  FLUSH_LOGS=1
fi

echo "[hotfix] app dir: ${APP_DIR}"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "[hotfix] ERROR: ${APP_DIR} does not exist"
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[hotfix] ERROR: ${ENV_FILE} missing"
  exit 1
fi

cd "${APP_DIR}"

echo "[hotfix] loading production env"
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[hotfix] ERROR: DATABASE_URL is missing in ${ENV_FILE}"
  exit 1
fi

export DATABASE_URL
echo "[hotfix] DATABASE_URL loaded"

echo "[hotfix] syncing DB schema with Prisma"
npx prisma db push --schema=prisma/schema.prisma

echo "[hotfix] regenerating Prisma client"
npm run db:generate

if [[ "${FLUSH_LOGS}" == "1" ]]; then
  echo "[hotfix] flushing PM2 logs"
  pm2 flush
fi

echo "[hotfix] restarting API + institution web"
pm2 restart kanak-api kanak-institution-web --update-env

echo "[hotfix] health check"
curl -fsS "https://api.kanaksetu.com/api/v1/health" || {
  echo "[hotfix] WARN: health check failed, inspect logs"
  pm2 logs kanak-api --lines 120
  exit 1
}

echo "[hotfix] done"
echo "[hotfix] if needed, inspect recent API logs:"
echo "[hotfix]   pm2 logs kanak-api --lines 120"
