#!/usr/bin/env bash

set -euo pipefail

API_BASE="${API_BASE:-http://localhost:4000/api/v1}"
DATABASE_URL="${DATABASE_URL:-postgresql://kanak:kanak_dev_pwd@localhost:5432/kanak_setu}"
CI_API_LOG="${CI_API_LOG:-api-ci.log}"

echo "[smoke-ci] starting CI smoke pipeline"

export DATABASE_URL

npm run db:generate
if [[ -d "prisma/migrations" ]] && compgen -G "prisma/migrations/*/migration.sql" >/dev/null; then
  npx prisma migrate deploy --schema=prisma/schema.prisma
else
  echo "[smoke-ci] no migration SQL found, using prisma db push"
  npx prisma db push --schema=prisma/schema.prisma --accept-data-loss
fi
npm run db:seed

npm run dev:api > "${CI_API_LOG}" 2>&1 &
API_PID=$!

cleanup() {
  if kill -0 "${API_PID}" >/dev/null 2>&1; then
    kill "${API_PID}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

for i in $(seq 1 40); do
  if curl -fsS "${API_BASE}/health" >/dev/null 2>&1; then
    echo "[smoke-ci] api is healthy"
    break
  fi
  if [[ "${i}" -eq 40 ]]; then
    echo "[smoke-ci] FAIL: api did not become healthy"
    echo "[smoke-ci] last api logs:"
    node -e "const fs=require('fs');const p=process.argv[1];if(fs.existsSync(p)){const s=fs.readFileSync(p,'utf8');console.log(s.slice(-4000));}" "${CI_API_LOG}"
    exit 1
  fi
  sleep 2
done

API_BASE="${API_BASE}" SMOKE_OUTPUT="${SMOKE_OUTPUT:-smoke-report.json}" npm run smoke:all

echo "[smoke-ci] completed"
