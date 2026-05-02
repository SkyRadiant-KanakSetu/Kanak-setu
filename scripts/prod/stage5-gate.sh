#!/usr/bin/env bash
# ============================================================
# Kanak Setu — Stage 5 Readiness Gate
# Inherits Stage 4 checks and adds observability checks.
# Exit 0 = Stage 5 foundation is ready.
# Exit 1 = Hard requirements not met.
# ============================================================

set -euo pipefail

PASS=true
ISSUES=()
WARNINGS=()

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
APP_DIR="${APP_DIR:-${REPO_ROOT}}"
INTERNAL_API_BASE="${INTERNAL_API_BASE:-http://127.0.0.1:4100/api/v1}"

if [[ -f "${APP_DIR}/infra/prod/.env.production" ]] && [[ -z "${DATABASE_URL:-}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${APP_DIR}/infra/prod/.env.production"
  set +a
fi

echo ""
echo "=== Kanak Setu Stage 5 Readiness Gate ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "APP_DIR: ${APP_DIR}"
echo ""

echo "--- Stage 4 Baseline ---"
BASELINE_OUT="$(mktemp)"
if APP_DIR="${APP_DIR}" INTERNAL_API_BASE="${INTERNAL_API_BASE}" bash "${SCRIPT_DIR}/stage4-gate.sh" >"${BASELINE_OUT}" 2>&1; then
  echo "    PASS — Stage 4 baseline is green"
else
  PASS=false
  ISSUES+=("Stage 4 baseline failed — resolve Stage 4 issues first")
  echo "    FAIL — Stage 4 baseline failed"
  echo "    ---- stage4 summary ----"
  grep -E '^Result:|^Resolve before declaring Stage 4:|^  ✗' "${BASELINE_OUT}" | sed 's/^/      /' || true
  echo "    ---- stage4 tail ----"
  tail -n 60 "${BASELINE_OUT}" | sed 's/^/      /'
fi
rm -f "${BASELINE_OUT}"

echo ""
echo "--- Stage 5 Checks ---"

echo "[S5-1] Error tracking (Sentry)..."
if [[ -n "${SENTRY_DSN_API:-}" ]]; then
  echo "    PASS — SENTRY_DSN_API configured"
else
  WARNINGS+=("SENTRY_DSN_API not set — error tracking inactive")
  echo "    WARN — Sentry DSN not configured (non-blocking)"
fi

echo "[S5-2] Log pipeline (Logtail PM2 module)..."
if pm2 list 2>/dev/null | grep -q "@logtail/pm2"; then
  echo "    PASS — @logtail/pm2 module active"
else
  WARNINGS+=("@logtail/pm2 not installed — PM2 logs not shipping externally")
  echo "    WARN — @logtail/pm2 not active (non-blocking)"
fi

echo "[S5-3] Outbox processing health..."
if [[ -n "${DATABASE_URL:-}" ]]; then
  STUCK="$(
    psql "${DATABASE_URL}" -t -A -c \
      "SELECT COUNT(*) FROM \"OutboxEvent\"
       WHERE status IN ('pending','processing')
       AND \"createdAt\" < NOW() - INTERVAL '10 minutes';" 2>/dev/null || echo "0"
  )"
  STUCK="${STUCK// /}"
  if [[ "${STUCK:-0}" -gt 10 ]]; then
    PASS=false
    ISSUES+=("Outbox: ${STUCK} events stuck > 10 minutes")
  else
    echo "    PASS — stuck events: ${STUCK:-0}"
  fi

  DEAD="$(
    psql "${DATABASE_URL}" -t -A -c \
      "SELECT COUNT(*) FROM \"OutboxDeadLetter\" WHERE \"dismissedAt\" IS NULL;" 2>/dev/null || echo "0"
  )"
  DEAD="${DEAD// /}"
  if [[ "${DEAD:-0}" -gt 0 ]]; then
    WARNINGS+=("Outbox dead letters undismissed: ${DEAD}")
    echo "    WARN — dead letters: ${DEAD} (non-blocking)"
  else
    echo "    PASS — dead letter queue empty"
  fi
else
  WARNINGS+=("DATABASE_URL not set — skipped outbox DB check")
  echo "    WARN — skipped (DATABASE_URL missing)"
fi

echo "[S5-4] API health endpoint..."
HEALTH_BODY="$(curl -sf "${INTERNAL_API_BASE}/health" 2>/dev/null || echo "{}")"
HEALTH_OK="$(echo "${HEALTH_BODY}" | jq -r '.success // false' 2>/dev/null || echo "false")"
if [[ "${HEALTH_OK}" == "true" ]]; then
  echo "    PASS — ${INTERNAL_API_BASE}/health success=true"
else
  PASS=false
  ISSUES+=("Health endpoint failed at ${INTERNAL_API_BASE}/health")
fi

echo "[S5-5] Backup freshness (last 25h)..."
LATEST="$(
  find "${APP_DIR}/backups" \( -name "*.sql*" -o -name "kanak-setu-*.tgz" \) -mmin -1500 2>/dev/null | head -1 || true
)"
if [[ -n "${LATEST}" ]]; then
  echo "    PASS — ${LATEST}"
else
  PASS=false
  ISSUES+=("No backup found in last 25 hours")
fi

echo "[S5-6] Logging policy doc..."
if [[ -f "${APP_DIR}/docs/operations/logging-policy.md" ]]; then
  echo "    PASS — docs/operations/logging-policy.md present"
else
  WARNINGS+=("docs/operations/logging-policy.md missing")
  echo "    WARN — logging policy doc missing (non-blocking)"
fi

echo ""
echo "─────────────────────────────────────────"
if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  echo "Warnings (non-blocking):"
  for W in "${WARNINGS[@]}"; do echo "  ⚠  ${W}"; done
  echo ""
fi

if ${PASS}; then
  echo "Result: PASS"
  echo "Stage 5 observability foundation is ready."
  exit 0
else
  echo "Result: FAIL"
  for I in "${ISSUES[@]}"; do echo "  ✗  ${I}"; done
  exit 1
fi
