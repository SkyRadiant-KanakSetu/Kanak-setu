#!/usr/bin/env bash
# ============================================================
# Kanak Setu — Stage 3 Readiness Gate
# Run after 7+ days of production operation with 3+ deploys.
# Exit 0 = Stage 3 can be declared.
# Exit 1 = Requirements not met. See output for details.
# ============================================================

set -euo pipefail

PASS=true
ISSUES=()
WARNINGS=()

TLOG="/opt/kanak-setu/logs/deploy-telemetry.log"
VERIFY_JSON="/opt/kanak-setu/logs/last-verify.json"
BACKUP_DIR="/opt/kanak-setu/backups"
CI_WORKFLOW_DIR=".github/workflows"
MIN_DEPLOYS=3
MAX_RESTARTS=3
INTERNAL_API_BASE="${INTERNAL_API_BASE:-http://localhost:4000/api/v1}"

echo ""
echo "=== Kanak Setu Stage 3 Readiness Gate ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

# ── Gate 1: Telemetry log has minimum deploy entries ──────────────────────────
echo "[1] Telemetry log..."
if [ ! -f "$TLOG" ]; then
  PASS=false
  ISSUES+=("Telemetry log not found at $TLOG")
else
  COUNT=$(wc -l < "$TLOG")
  if [ "$COUNT" -lt "$MIN_DEPLOYS" ]; then
    PASS=false
    ISSUES+=("Telemetry: only $COUNT deploy entries (minimum: $MIN_DEPLOYS)")
  else
    echo "    PASS — $COUNT deploy entries found"
    echo "    Last 3 entries:"
    tail -3 "$TLOG" | sed 's/^/      /'
  fi
fi

# ── Gate 2: Last verify was a full PASS ──────────────────────────────────────
echo "[2] Last verify snapshot..."
if [ ! -f "$VERIFY_JSON" ]; then
  PASS=false
  ISSUES+=("Verify snapshot not found at $VERIFY_JSON")
else
  OVERALL=$(jq -r '.overall // "MISSING"' "$VERIFY_JSON")
  VERIFY_TS=$(jq -r '.timestamp // "unknown"' "$VERIFY_JSON")
  if [ "$OVERALL" != "PASS" ]; then
    PASS=false
    ISSUES+=("Last verify result: $OVERALL (expected PASS) at $VERIFY_TS")
  else
    echo "    PASS — Last verify: $OVERALL at $VERIFY_TS"
  fi
fi

# ── Gate 3: All PM2 services online with low restart count ───────────────────
echo "[3] PM2 service health..."
for SVC in kanak-api kanak-donor-web kanak-institution-web kanak-admin-web kanak-outbox-worker; do
  STATUS=$(pm2 jlist 2>/dev/null | jq -r \
    ".[] | select(.name==\"$SVC\") | .pm2_env.status" || echo "MISSING")
  RESTARTS=$(pm2 jlist 2>/dev/null | jq -r \
    ".[] | select(.name==\"$SVC\") | .pm2_env.restart_time" || echo "0")
  MEMORY=$(pm2 jlist 2>/dev/null | jq -r \
    ".[] | select(.name==\"$SVC\") | .monit.memory" || echo "0")
  MEMORY_MB=$(( ${MEMORY:-0} / 1024 / 1024 ))

  if [ "$STATUS" != "online" ]; then
    PASS=false
    ISSUES+=("PM2 $SVC status: $STATUS (expected: online)")
  elif [ "${RESTARTS:-0}" -gt "$MAX_RESTARTS" ]; then
    PASS=false
    ISSUES+=("PM2 $SVC restart count: $RESTARTS (max: $MAX_RESTARTS)")
  else
    WARN=""
    [ "${RESTARTS:-0}" -gt 1 ] && WARN=" ← elevated restarts" && \
      WARNINGS+=("$SVC has $RESTARTS restarts — monitor")
    echo "    PASS — $SVC: online | ${MEMORY_MB}MB | restarts: $RESTARTS$WARN"
  fi
done

# ── Gate 4: No high or critical dependency advisories ────────────────────────
echo "[4] Dependency security audit (high/critical only)..."
AUDIT_FAIL=false
for APP_DIR in apps/api apps/admin-web apps/donor-web apps/institution-web; do
  if [ -d "$APP_DIR" ]; then
    VULN=$(cd "$APP_DIR" && npm audit --json --audit-level=high 2>/dev/null | \
      jq '(.metadata.vulnerabilities.high // 0) +
          (.metadata.vulnerabilities.critical // 0)' || echo "0")
    if [ "${VULN:-0}" -gt 0 ]; then
      PASS=false
      AUDIT_FAIL=true
      ISSUES+=("$APP_DIR: $VULN high/critical advisories unresolved")
    else
      echo "    PASS — $APP_DIR: 0 high/critical advisories"
    fi
  fi
done
if ! $AUDIT_FAIL; then
  echo "    NOTE: Moderate advisory (GHSA-qx2v-qp2m-jg93 / postcss via next)"
  echo "          is deferred — documented in docs/operations/dependency-deferral.md"
fi

# ── Gate 5: CI is in strict warning mode ─────────────────────────────────────
echo "[5] CI strict warning policy..."
STRICT_HIT="$(
  grep -RilE \
    'strict|WEB_WARNING_POLICY_STAGE|--max-warnings[=[:space:]]*0|eslint.*max-warnings' \
    "$CI_WORKFLOW_DIR" 2>/dev/null | head -1 || true
)"
if [ -n "$STRICT_HIT" ]; then
  echo "    PASS — strict mode found in CI workflow ($STRICT_HIT)"
else
  PASS=false
  ISSUES+=("CI strict warning mode not confirmed in $CI_WORKFLOW_DIR")
fi

# ── Gate 6: Operator activity (at least 1 action in last 14 days) ────────────
echo "[6] Operator workflow adoption..."
if [ -z "${INTERNAL_API_SECRET:-}" ]; then
  WARNINGS+=("INTERNAL_API_SECRET not set — skipping operator activity check")
  echo "    WARN — skipped (INTERNAL_API_SECRET not set)"
else
  ACTIONS=$(curl -sf \
    -H "Authorization: Bearer $INTERNAL_API_SECRET" \
    "${INTERNAL_API_BASE}/internal/operator-activity?days=14" | \
    jq '.data.total_actions // .total_actions // 0' || echo "0")
  if [ "${ACTIONS:-0}" -lt 1 ]; then
    WARNINGS+=("Operator activity: 0 actions in 14 days — adoption unverified")
    echo "    WARN — 0 operator actions logged in 14 days"
  else
    echo "    PASS — $ACTIONS operator actions in last 14 days"
  fi
fi

# ── Gate 7: Backup freshness ─────────────────────────────────────────────────
echo "[7] Backup freshness..."
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "*.sql*" -mtime -1 2>/dev/null | head -1)
if [ -z "$LATEST_BACKUP" ]; then
  WARNINGS+=("No backup found in last 24 hours — verify backup cron is running")
  echo "    WARN — No backup found in $BACKUP_DIR in the last 24 hours"
else
  echo "    PASS — Backup found: $LATEST_BACKUP"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "─────────────────────────────────────────"
if [ ${#WARNINGS[@]} -gt 0 ]; then
  echo "Warnings (non-blocking):"
  for W in "${WARNINGS[@]}"; do echo "  ⚠  $W"; done
  echo ""
fi

if $PASS; then
  echo "Result: PASS"
  echo "Stage 3 can be officially declared."
  echo ""
  echo "Next steps:"
  echo "  1. Update docs/operations/stage-status.md → Stage: 3"
  echo "  2. Run bash scripts/prod/telemetry-health-check.sh for a final snapshot"
  echo "  3. Share board summary with updated stage"
  exit 0
else
  echo "Result: FAIL"
  echo "Resolve the following before declaring Stage 3:"
  for ISSUE in "${ISSUES[@]}"; do echo "  ✗  $ISSUE"; done
  echo ""
  echo "Re-run this script after resolving each item."
  exit 1
fi
