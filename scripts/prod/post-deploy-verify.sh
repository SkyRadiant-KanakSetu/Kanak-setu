#!/usr/bin/env bash
# Post-deploy verification for production VPS (or any machine with repo + env).
#
#   cd /opt/kanak-setu
#   bash scripts/prod/post-deploy-verify.sh
#
# Optional:
#   PUBLIC_API_BASE=https://api.kanaksetu.com/api/v1 bash scripts/prod/post-deploy-verify.sh
#   RUN_SMOKE=1 bash scripts/prod/post-deploy-verify.sh   # runs npm run smoke:local against localhost API
#   VERIFY_LOGOS=0 …   # skip /logo.png checks on the three public web origins
#   DONOR_ORIGIN=… INSTITUTION_ORIGIN=… ADMIN_ORIGIN=…  # override default kanaksetu.com hosts
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
PUBLIC_API_BASE="${PUBLIC_API_BASE:-https://api.kanaksetu.com/api/v1}"
LOCAL_API_BASE="${LOCAL_API_BASE:-http://127.0.0.1:4000/api/v1}"
LOG_DIR="${LOG_DIR:-${APP_DIR}/logs}"
LAST_VERIFY_FILE="${LOG_DIR}/last-verify.json"
MAX_PM2_RSS_MB="${MAX_PM2_RSS_MB:-512}"
MAX_HEALTH_MS="${MAX_HEALTH_MS:-2000}"

START_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
VERIFY_OK=0
LOCAL_HEALTH_MS=0
DB_HEALTH_OK=0
PM2_MEM_OK=0
OVERALL_STATUS="FAIL"
BACKUP_STATUS="WARN"
BACKUP_MSG="Not checked"
BACKUP_AGE_HOURS=-1

write_verify_snapshot() {
  mkdir -p "${LOG_DIR}"
  local finished_ts
  finished_ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  cat > "${LAST_VERIFY_FILE}" <<EOF
{
  "timestamp": "${finished_ts}",
  "startedAt": "${START_TS}",
  "finishedAt": "${finished_ts}",
  "overall": "${OVERALL_STATUS}",
  "success": ${VERIFY_OK},
  "localHealthMs": ${LOCAL_HEALTH_MS},
  "dbHealthOk": ${DB_HEALTH_OK},
  "pm2MemoryCheckOk": ${PM2_MEM_OK},
  "backup_status": "${BACKUP_STATUS}",
  "backup_latest": "$(printf '%s' "${BACKUP_MSG}" | sed 's/"/\\"/g')",
  "backup_age_hours": ${BACKUP_AGE_HOURS}
}
EOF
}
trap write_verify_snapshot EXIT

echo "[verify] app dir: ${APP_DIR}"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "[verify] ERROR: ${APP_DIR} does not exist"
  exit 1
fi

cd "${APP_DIR}"

echo "[verify] git HEAD"
git rev-parse --short HEAD
git status --short || true

ENV_FILE="${APP_DIR}/infra/prod/.env.production"
if [[ -f "${ENV_FILE}" ]]; then
  echo "[verify] prisma migrate status (from ${ENV_FILE})"
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
  if [[ -n "${DATABASE_URL:-}" ]]; then
    npx prisma migrate status --schema=prisma/schema.prisma || true
  else
    echo "[verify] WARN: DATABASE_URL not set after sourcing env; skipping migrate status"
  fi
else
  echo "[verify] WARN: ${ENV_FILE} missing; skipping prisma migrate status"
fi

echo "[verify] pm2 (kanak apps)"
if command -v pm2 >/dev/null 2>&1; then
  pm2 jlist | node -e '
    const apps = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const want = ["kanak-api","kanak-donor-web","kanak-institution-web","kanak-admin-web","kanak-outbox-worker"];
    for (const name of want) {
      const p = apps.find((a) => a.name === name);
      if (!p) { console.log(name + ": MISSING"); continue; }
      const st = p.pm2_env?.status || "?";
      console.log(name + ": " + st + (st !== "online" ? "  <-- check this" : ""));
    }
  ' 2>/dev/null || pm2 status
  echo "[verify] pm2 memory check (rss <= ${MAX_PM2_RSS_MB} MB)"
  export PM2_LIMIT_BYTES="$((MAX_PM2_RSS_MB * 1024 * 1024))"
  pm2 jlist | node -e '
    const fs = require("fs");
    const apps = JSON.parse(fs.readFileSync(0, "utf8"));
    const limit = Number(process.env.PM2_LIMIT_BYTES || 0);
    const want = ["kanak-api","kanak-donor-web","kanak-institution-web","kanak-admin-web","kanak-outbox-worker"];
    let bad = 0;
    for (const name of want) {
      const p = apps.find((a) => a.name === name);
      if (!p) continue;
      const rss = Number(p.monit?.memory || 0);
      const mb = (rss / (1024 * 1024)).toFixed(1);
      console.log(`${name}: ${mb} MB RSS`);
      if (rss > limit) bad += 1;
    }
    if (bad) process.exit(42);
  '
  PM2_MEM_OK=1
else
  echo "[verify] WARN: pm2 not in PATH"
fi

echo "[verify] API health (local)"
LOCAL_HEALTH_MS="$(curl -sS -o /tmp/kanak-health-local.json -w "%{time_total}" "${LOCAL_API_BASE}/health" | awk '{print int($1*1000)}')"
if [[ -s /tmp/kanak-health-local.json ]]; then
  head -c 200 /tmp/kanak-health-local.json
  echo ""
else
  echo "[verify] FAIL: local health check"
  exit 1
fi
echo "[verify] local /health response time: ${LOCAL_HEALTH_MS} ms"
if (( LOCAL_HEALTH_MS > MAX_HEALTH_MS )); then
  echo "[verify] FAIL: local /health took ${LOCAL_HEALTH_MS}ms (> ${MAX_HEALTH_MS}ms)"
  exit 1
fi

echo "[verify] database connectivity (SELECT 1 via Prisma Client)"
if node -e 'const { PrismaClient } = require("@prisma/client"); const p = new PrismaClient(); p.$queryRaw`SELECT 1`.then(()=>p.$disconnect()).catch(async(e)=>{console.error(e.message); await p.$disconnect(); process.exit(1);});'; then
  DB_HEALTH_OK=1
else
  echo "[verify] FAIL: database connectivity check"
  exit 1
fi

echo "[verify] API health (public)"
if curl -fsS "${PUBLIC_API_BASE}/health" | head -c 200; then
  echo ""
else
  echo "[verify] FAIL: public health check"
  exit 1
fi

echo "[verify] protected routes (expect 401 without token, not 5xx)"
for path in institutions/portal/functions institutions/portal/settings-faith; do
  code="$(curl -sS -o /dev/null -w "%{http_code}" "${PUBLIC_API_BASE}/${path}")"
  echo "  GET /${path} -> HTTP ${code}"
  if [[ "${code}" =~ ^5 ]]; then
    echo "[verify] FAIL: upstream error on ${path}"
    exit 1
  fi
done

if [[ "${VERIFY_LOGOS:-1}" == "1" ]]; then
  echo "[verify] public /logo.png (200 + image/png)"
  DONOR_ORIGIN="${DONOR_ORIGIN:-https://kanaksetu.com}"
  INSTITUTION_ORIGIN="${INSTITUTION_ORIGIN:-https://institution.kanaksetu.com}"
  ADMIN_ORIGIN="${ADMIN_ORIGIN:-https://admin.kanaksetu.com}"
  for origin in "${DONOR_ORIGIN}" "${INSTITUTION_ORIGIN}" "${ADMIN_ORIGIN}"; do
    url="${origin}/logo.png"
    code="$(curl -sS -o /dev/null -w "%{http_code}" "${url}")"
    ct="$(curl -sSI "${url}" | tr -d '\r' | grep -i '^content-type:' | head -1 || true)"
    echo "  ${url} -> HTTP ${code} ${ct}"
    if [[ "${code}" != "200" ]]; then
      echo "[verify] FAIL: expected HTTP 200 for ${url}"
      exit 1
    fi
    if ! echo "${ct}" | grep -qi 'image/png'; then
      echo "[verify] FAIL: expected Content-Type image/png for ${url}"
      exit 1
    fi
  done
fi

if [[ "${RUN_SMOKE:-0}" == "1" ]]; then
  echo "[verify] npm run smoke:local (API_BASE=${LOCAL_API_BASE})"
  API_BASE="${LOCAL_API_BASE}" npm run smoke:local
fi

# ── Backup freshness ──────────────────────────────────────────────────────────
echo "[backup] Checking backup freshness..."
BACKUP_DIR="${APP_DIR}/backups"
LATEST_BACKUP="$(find "${BACKUP_DIR}" -name "*.sql*" -mtime -1 2>/dev/null | sort -r | head -1 || true)"
if [[ -z "${LATEST_BACKUP}" ]]; then
  BACKUP_STATUS="WARN"
  BACKUP_MSG="No backup found in last 24 hours"
  BACKUP_AGE_HOURS=-1
  echo "  WARN: ${BACKUP_MSG}"
else
  BACKUP_MTIME=""
  if BACKUP_MTIME="$(stat -c '%Y' "${LATEST_BACKUP}" 2>/dev/null)"; then
    :
  elif BACKUP_MTIME="$(stat -f '%m' "${LATEST_BACKUP}" 2>/dev/null)"; then
    :
  else
    BACKUP_MTIME="0"
  fi
  BACKUP_AGE_HOURS=$(( ( $(date +%s) - BACKUP_MTIME ) / 3600 ))
  BACKUP_STATUS="PASS"
  BACKUP_MSG="${LATEST_BACKUP}"
  echo "  PASS: ${LATEST_BACKUP} (${BACKUP_AGE_HOURS}h ago)"
fi

VERIFY_OK=1
OVERALL_STATUS="PASS"

if [[ -x "${APP_DIR}/scripts/prod/telemetry-health-check.sh" ]]; then
  APP_DIR="${APP_DIR}" LOG_DIR="${LOG_DIR}" bash "${APP_DIR}/scripts/prod/telemetry-health-check.sh" || true
fi

echo "[verify] DONE"
