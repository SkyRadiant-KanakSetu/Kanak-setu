#!/usr/bin/env bash
# ============================================================
# Kanak Setu — Stage 4 Readiness Gate
# Extends Stage 3 gate with Stage 4-specific checks.
# Exit 0 = Stage 4 can be declared (WARN items allowed).
# Exit 1 = Hard requirements not met.
#
# Recommended on VPS (repo at APP_DIR, PM2, logs):
#   cd /opt/kanak-setu
#   set -a && source infra/prod/.env.production && set +a   # DATABASE_URL, INTERNAL_API_SECRET
#   APP_DIR=/opt/kanak-setu bash scripts/prod/stage4-gate.sh
# ============================================================

set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required. Install: apt install jq  (or brew install jq on macOS)"
  exit 1
fi

PASS=true
ISSUES=()
WARNINGS=()

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
APP_DIR="${APP_DIR:-${REPO_ROOT}}"
TLOG="${APP_DIR}/logs/deploy-telemetry.log"
VERIFY_JSON="${APP_DIR}/logs/last-verify.json"
BACKUP_DIR="${APP_DIR}/backups"
CI_WORKFLOW_DIR="${APP_DIR}/.github/workflows"
MIN_DEPLOYS=3
MAX_RESTARTS=3
INTERNAL_API_BASE="${INTERNAL_API_BASE:-http://127.0.0.1:4000/api/v1}"

if [[ -f "${APP_DIR}/infra/prod/.env.production" ]] && [[ -z "${DATABASE_URL:-}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${APP_DIR}/infra/prod/.env.production"
  set +a
fi

echo ""
echo "=== Kanak Setu Stage 4 Readiness Gate ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "APP_DIR: ${APP_DIR}"
echo ""

# ── Stage 3 baseline ──────────────────────────────────────────────────────────
echo "--- Stage 3 Baseline ---"

echo "[S3-1] Telemetry log..."
if [[ ! -f "${TLOG}" ]]; then
  PASS=false
  ISSUES+=("Telemetry log not found at ${TLOG}")
else
  COUNT="$(wc -l < "${TLOG}" | tr -d ' ')"
  if [[ "${COUNT}" -lt "${MIN_DEPLOYS}" ]]; then
    PASS=false
    ISSUES+=("Telemetry: ${COUNT} deploy entries (minimum: ${MIN_DEPLOYS})")
  else
    echo "    PASS — ${COUNT} deploy entries"
  fi
fi

echo "[S3-2] Last verify snapshot..."
if [[ ! -f "${VERIFY_JSON}" ]]; then
  PASS=false
  ISSUES+=("Verify snapshot missing at ${VERIFY_JSON}")
else
  OVERALL="$(jq -r '.overall // "MISSING"' "${VERIFY_JSON}")"
  VERIFY_TS="$(jq -r '.timestamp // "unknown"' "${VERIFY_JSON}")"
  if [[ "${OVERALL}" != "PASS" ]]; then
    PASS=false
    ISSUES+=("Last verify: ${OVERALL} at ${VERIFY_TS}")
  else
    echo "    PASS — ${OVERALL} at ${VERIFY_TS}"
  fi
fi

echo "[S3-3] PM2 core web + API services..."
for SVC in kanak-api kanak-donor-web kanak-institution-web kanak-admin-web; do
  STATUS="$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name==\"${SVC}\") | .pm2_env.status" || echo "MISSING")"
  RESTARTS="$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name==\"${SVC}\") | .pm2_env.restart_time" || echo "0")"
  if [[ "${STATUS}" != "online" ]]; then
    PASS=false
    ISSUES+=("PM2 ${SVC}: ${STATUS}")
  elif [[ "${RESTARTS:-0}" -gt "${MAX_RESTARTS}" ]]; then
    PASS=false
    ISSUES+=("PM2 ${SVC} restarts: ${RESTARTS} (max ${MAX_RESTARTS})")
  else
    echo "    PASS — ${SVC} online, restarts: ${RESTARTS}"
  fi
done

echo "[S3-4] Dependency audit (high/critical)..."
AUDIT_FAIL=false
if [[ -d "${APP_DIR}" ]]; then
  pushd "${APP_DIR}" >/dev/null || exit 1
  for APP_PATH in apps/api apps/admin-web apps/donor-web apps/institution-web; do
    if [[ -d "${APP_PATH}" ]]; then
      VULN="$(cd "${APP_PATH}" && npm audit --json --audit-level=high 2>/dev/null | jq '(.metadata.vulnerabilities.high // 0) + (.metadata.vulnerabilities.critical // 0)' || echo 0)"
      if [[ "${VULN:-0}" -gt 0 ]]; then
        PASS=false
        AUDIT_FAIL=true
        ISSUES+=("${APP_PATH}: ${VULN} high/critical advisories")
      else
        echo "    PASS — ${APP_PATH}: 0 high/critical"
      fi
    fi
  done
  popd >/dev/null || true
else
  PASS=false
  ISSUES+=("APP_DIR not a directory: ${APP_DIR}")
fi
if ! ${AUDIT_FAIL}; then
  echo "    NOTE: postcss GHSA-qx2v-qp2m-jg93 remains deferred per policy."
fi

echo "[S3-5] CI strict warning policy..."
STRICT_HIT="$(
  grep -RilE 'strict|WEB_WARNING_POLICY_STAGE|--max-warnings[=[:space:]]*0|eslint.*max-warnings' "${CI_WORKFLOW_DIR}" 2>/dev/null | head -1 || true
)"
if [[ -n "${STRICT_HIT}" ]]; then
  echo "    PASS — strict policy referenced (${STRICT_HIT})"
else
  PASS=false
  ISSUES+=("CI strict warning policy not found under ${CI_WORKFLOW_DIR}")
fi

echo "[S3-6] Operator adoption (non-blocking)..."
if [[ -z "${INTERNAL_API_SECRET:-}" ]]; then
  WARNINGS+=("INTERNAL_API_SECRET not set — skipping operator check")
  echo "    WARN — skipped"
else
  ACTIONS="$(
    curl -sf \
      -H "Authorization: Bearer ${INTERNAL_API_SECRET}" \
      "${INTERNAL_API_BASE}/internal/operator-activity?days=14" \
      | jq '.data.total_actions // .total_actions // 0' || echo 0
  )"
  if [[ "${ACTIONS:-0}" -lt 1 ]]; then
    WARNINGS+=("Operator adoption: 0 actions in 14 days")
    echo "    WARN — 0 operator actions (non-blocking)"
  else
    echo "    PASS — ${ACTIONS} operator actions"
  fi
fi

echo "[S3-7] Backup freshness (non-blocking)..."
LATEST="$(find "${BACKUP_DIR}" -name "*.sql*" -mtime -1 2>/dev/null | head -1 || true)"
if [[ -z "${LATEST}" ]]; then
  WARNINGS+=("No backup in last 24h — verify cron")
  echo "    WARN — no recent backup under ${BACKUP_DIR}"
else
  echo "    PASS — ${LATEST}"
fi

echo ""
echo "--- Stage 4 Checks ---"

echo "[S4-1] Release pipeline workflows..."
if [[ -f "${APP_DIR}/.github/workflows/release.yml" ]] && [[ -f "${APP_DIR}/.github/workflows/rollback.yml" ]]; then
  echo "    PASS — release.yml and rollback.yml present"
else
  PASS=false
  ISSUES+=("release.yml and/or rollback.yml missing under ${APP_DIR}/.github/workflows")
fi

echo "[S4-2] Outbox worker PM2..."
WORKER_STATUS="$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-outbox-worker") | .pm2_env.status' || echo "MISSING")"
WORKER_RESTARTS="$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-outbox-worker") | .pm2_env.restart_time' || echo "0")"
if [[ "${WORKER_STATUS}" != "online" ]]; then
  PASS=false
  ISSUES+=("kanak-outbox-worker: ${WORKER_STATUS} (expected online)")
else
  echo "    PASS — kanak-outbox-worker online, restarts: ${WORKER_RESTARTS}"
fi

echo "[S4-3] Outbox DB health (read-only)..."
if [[ -z "${DATABASE_URL:-}" ]]; then
  WARNINGS+=("DATABASE_URL not set — skipping outbox DB checks")
  echo "    WARN — skipped"
else
  STUCK="$(
    psql "${DATABASE_URL}" -t -A -c \
      "SELECT COUNT(*) FROM \"OutboxEvent\"
       WHERE status IN ('pending','processing')
       AND \"createdAt\" < NOW() - INTERVAL '5 minutes';" 2>/dev/null || echo "0"
  )"
  STUCK="${STUCK// /}"
  if [[ "${STUCK:-0}" -gt 10 ]]; then
    PASS=false
    ISSUES+=("Outbox: ${STUCK} events stuck > 5 minutes")
  elif [[ "${STUCK:-0}" -gt 0 ]]; then
    WARNINGS+=("Outbox: ${STUCK} events older than 5 min — monitor")
    echo "    WARN — ${STUCK} slow/stuck events"
  else
    echo "    PASS — no backlog stuck > 5 minutes"
  fi

  DEAD="$(
    psql "${DATABASE_URL}" -t -A -c 'SELECT COUNT(*) FROM "OutboxDeadLetter" WHERE "dismissedAt" IS NULL;' 2>/dev/null || echo "0"
  )"
  DEAD="${DEAD// /}"
  if [[ "${DEAD:-0}" -gt 0 ]]; then
    WARNINGS+=("Undismissed dead letters: ${DEAD} — review admin reliability")
    echo "    WARN — ${DEAD} active dead-letter rows"
  else
    echo "    PASS — no undismissed dead letters"
  fi
fi

echo "[S4-4] API health endpoint..."
HEALTH="$(curl -sf "${INTERNAL_API_BASE}/health" 2>/dev/null || echo "{}")"
HEALTH_OK="$(echo "${HEALTH}" | jq -r '.success // false')"
DATA_STATUS="$(echo "${HEALTH}" | jq -r '.data.status // "missing"')"
if [[ "${HEALTH_OK}" != "true" ]] || [[ "${DATA_STATUS}" != "ok" ]]; then
  PASS=false
  ISSUES+=("Health check failed (success=${HEALTH_OK}, data.status=${DATA_STATUS})")
else
  echo "    PASS — ${INTERNAL_API_BASE}/health ok"
fi

echo "[S4-5] Release workflow targets main..."
if grep -qE 'branches:.*main|branches:.*\[.*main' "${APP_DIR}/.github/workflows/release.yml" 2>/dev/null; then
  echo "    PASS — release.yml references main"
else
  WARNINGS+=("release.yml branch trigger not verified — confirm GitHub branch protection")
  echo "    WARN — verify release.yml and GitHub settings"
fi

echo "[S4-6] Hardcoded path audit (API src)..."
HARDCODED="$(
  grep -Rsn "localhost\|127\.0\.0\.1\|/opt/kanak" "${APP_DIR}/apps/api/src/" \
    --include='*.ts' 2>/dev/null | grep -Ev 'test|spec|__tests__|\.d\.ts|loadEnv|example' | wc -l | tr -d ' '
)"
if [[ "${HARDCODED:-0}" -gt 0 ]]; then
  WARNINGS+=("${HARDCODED} potential hardcoded host/path hits in apps/api/src — review")
  echo "    WARN — ${HARDCODED} grep hits (review)"
else
  echo "    PASS — no obvious hardcoded paths"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "─────────────────────────────────────────"
if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  echo "Warnings (non-blocking):"
  for W in "${WARNINGS[@]}"; do echo "  ⚠  ${W}"; done
  echo ""
fi

if ${PASS}; then
  echo "Result: PASS"
  echo "Stage 4 can be officially declared."
  echo ""
  echo "Next steps:"
  echo "  1. Update docs/operations/stage-status.md → Stage 4 (declared)"
  echo "  2. Archive this gate output with docs/operations/stage4-closure-report-*.md"
  exit 0
else
  echo "Result: FAIL"
  echo "Resolve before declaring Stage 4:"
  for ISSUE in "${ISSUES[@]}"; do echo "  ✗  ${ISSUE}"; done
  echo ""
  exit 1
fi
