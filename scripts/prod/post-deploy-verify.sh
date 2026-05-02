#!/usr/bin/env bash
# Post-deploy verification for production VPS (or any machine with repo + env).
#
#   cd /opt/kanak-setu
#   bash scripts/prod/post-deploy-verify.sh
#
# Optional:
#   LOCAL_API_BASE=http://127.0.0.1:PORT/api/v1   # override auto-detection
#   PUBLIC_API_BASE=https://api.kanaksetu.com/api/v1 bash scripts/prod/post-deploy-verify.sh
#   RUN_SMOKE=1 bash scripts/prod/post-deploy-verify.sh   # runs npm run smoke:local against localhost API
#   VERIFY_LOGOS=0 …   # skip /logo.png checks on the three public web origins
#   DONOR_ORIGIN=… INSTITUTION_ORIGIN=… ADMIN_ORIGIN=…  # override default kanaksetu.com hosts
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/inc-local-api-base.sh"

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
PUBLIC_API_BASE="${PUBLIC_API_BASE:-https://api.kanaksetu.com/api/v1}"
# If caller exports LOCAL_API_BASE, preserve it (must capture before any default below).
VERIFY_LOCAL_API_USER="${LOCAL_API_BASE-}"
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

# Local API URL for health/smoke: probe PM2/env ports + common drift (e.g. 4100) and ss PID fallback.
LOCAL_API_BASE="$(kanak_discover_local_api_base "${VERIFY_LOCAL_API_USER}")"
echo "[verify] local API base: ${LOCAL_API_BASE}"

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
VERIFY_HEALTH_TMP="$(mktemp)"
set +e
CURL_TIME="$(curl -sS -o "${VERIFY_HEALTH_TMP}" -w "%{time_total}" --connect-timeout 5 "${LOCAL_API_BASE}/health")"
CURL_EC=$?
set -e
LOCAL_HEALTH_MS="$(printf '%s' "${CURL_TIME}" | awk '{print int($1*1000)}')"
if [[ "${CURL_EC}" -eq 0 ]] && [[ -s "${VERIFY_HEALTH_TMP}" ]]; then
  HEALTH_BODY="$(cat "${VERIFY_HEALTH_TMP}")"
  rm -f "${VERIFY_HEALTH_TMP}"
  KANAK_HEALTH_OK=0
  if command -v jq >/dev/null 2>&1; then
    if echo "${HEALTH_BODY}" | jq -e '.success == true and .data.status == "ok"' >/dev/null 2>&1; then
      KANAK_HEALTH_OK=1
    fi
  else
    if echo "${HEALTH_BODY}" | grep -qE '"success"[[:space:]]*:[[:space:]]*true' \
      && echo "${HEALTH_BODY}" | grep -qE '"status"[[:space:]]*:[[:space:]]*"ok"'; then
      KANAK_HEALTH_OK=1
    fi
  fi
  if [[ "${KANAK_HEALTH_OK}" -ne 1 ]]; then
    echo "[verify] FAIL: local /health is not Kanak API (want success:true and data.status ok)"
    echo "${HEALTH_BODY}" | head -c 400
    echo ""
    echo "[verify] hint: wrong process on loopback port (curl another app), or kanak-api not running."
    echo "[verify] hint: align PORT in infra/prod/.env.production, ecosystem PM2 env, and Caddy (infra/prod/Caddyfile)."
    ss -tlnp 2>/dev/null | head -25 || true
    exit 1
  fi
  echo "${HEALTH_BODY}" | head -c 200
  echo ""
else
  rm -f "${VERIFY_HEALTH_TMP}"
  echo "[verify] FAIL: local health check (${LOCAL_API_BASE}/health) curl_exit=${CURL_EC}"
  echo "[verify] hint: PORT in infra/prod/.env.production vs PM2; kanak-api now runs \`node apps/api/dist/server.js\` (pull latest ecosystem.config.cjs)."
  echo "[verify] hint: if nothing listens on PORT but another port has a stale node, run: pm2 delete kanak-api && pm2 start ecosystem.config.cjs --only kanak-api"
  ss -tlnp 2>/dev/null | head -25 || netstat -tlnp 2>/dev/null | head -25 || true
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
PUB_HEALTH_TMP="$(mktemp)"
set +e
PUB_CODE="$(curl -sS -o "${PUB_HEALTH_TMP}" -w "%{http_code}" --connect-timeout 10 "${PUBLIC_API_BASE}/health" 2>/dev/null)"
set -e
if [[ "${PUB_CODE}" == "200" ]] && [[ -s "${PUB_HEALTH_TMP}" ]]; then
  PUB_OK=0
  if command -v jq >/dev/null 2>&1; then
    if jq -e '.success == true and .data.status == "ok"' "${PUB_HEALTH_TMP}" >/dev/null 2>&1; then
      PUB_OK=1
    fi
  else
    if grep -qE '"success"[[:space:]]*:[[:space:]]*true' "${PUB_HEALTH_TMP}" \
      && grep -qE '"status"[[:space:]]*:[[:space:]]*"ok"' "${PUB_HEALTH_TMP}"; then
      PUB_OK=1
    fi
  fi
  if [[ "${PUB_OK}" -ne 1 ]]; then
    echo "[verify] FAIL: public /health JSON is not Kanak ok"
    head -c 400 "${PUB_HEALTH_TMP}"
    echo ""
    rm -f "${PUB_HEALTH_TMP}"
    exit 1
  fi
  head -c 200 "${PUB_HEALTH_TMP}"
  echo ""
  rm -f "${PUB_HEALTH_TMP}"
else
  rm -f "${PUB_HEALTH_TMP}"
  echo "[verify] FAIL: public health check (HTTP ${PUB_CODE:-?})"
  echo "[verify] hint: 502/503 — align Caddy with PORT in infra/prod/.env.production: sudo APP_DIR=${APP_DIR} bash scripts/prod/sync-caddy-kanak-api-port.sh && sudo systemctl restart caddy"
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
