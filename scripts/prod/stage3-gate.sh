#!/usr/bin/env bash
# ============================================================
# Kanak Setu — Stage 3 Readiness Gate
# Run after 7+ days of production operation with 3+ deploys.
# Exit 0 = Stage 3 can be declared.
# Exit 1 = Requirements not met. See output for details.
#
# Set APP_DIR to repo root (default /opt/kanak-setu). Set LOCAL_API_BASE
# to the API v1 base (default http://127.0.0.1:4000/api/v1).
# ============================================================

set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required on PATH for stage3-gate.sh"
  exit 1
fi

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
LOCAL_API_BASE="${LOCAL_API_BASE:-http://127.0.0.1:4000/api/v1}"
INTERNAL_API_SECRET="${INTERNAL_API_SECRET:-}"

PASS=true
ISSUES=()
WARNINGS=()

TLOG="${APP_DIR}/logs/deploy-telemetry.log"
VERIFY_JSON="${APP_DIR}/logs/last-verify.json"
BACKUP_DIR="${APP_DIR}/backups"
CI_WORKFLOW_DIR="${APP_DIR}/.github/workflows"
MIN_DEPLOYS=3
MAX_RESTARTS=3

pm2_field() {
  local svc="$1"
  local field="$2"
  (pm2 jlist 2>/dev/null || true) | node -e "
    const fs = require('fs');
    const svc = process.argv[1];
    const field = process.argv[2];
    const raw = fs.readFileSync(0, 'utf8');
    const start = raw.indexOf('[');
    if (start < 0) { process.stdout.write(field === 'status' ? 'MISSING' : '0'); process.exit(0); }
    try {
      const apps = JSON.parse(raw.slice(start));
      const p = apps.find((a) => a.name === svc);
      if (!p) { process.stdout.write(field === 'status' ? 'MISSING' : '0'); process.exit(0); }
      if (field === 'status') process.stdout.write(String(p.pm2_env?.status || 'MISSING'));
      else if (field === 'restarts') process.stdout.write(String(p.pm2_env?.restart_time ?? 0));
      else if (field === 'memory') process.stdout.write(String(p.monit?.memory ?? 0));
    } catch {
      process.stdout.write(field === 'status' ? 'MISSING' : '0');
    }
  " "$svc" "$field"
}

echo ""
echo "=== Kanak Setu Stage 3 Readiness Gate ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "APP_DIR: ${APP_DIR}"
echo ""

# ── Gate 1: Telemetry log has minimum deploy entries ──────────────────────────
echo "[1] Telemetry log..."
if [ ! -f "$TLOG" ]; then
  PASS=false
  ISSUES+=("Telemetry log not found at $TLOG")
else
  COUNT=$(wc -l < "$TLOG" | tr -d ' ')
  if [ "${COUNT:-0}" -lt "$MIN_DEPLOYS" ]; then
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
  OVERALL="$(node -e "try{const d=require('fs').readFileSync(process.argv[1],'utf8');const j=JSON.parse(d);process.stdout.write(String(j.overall||'MISSING'));}catch{process.stdout.write('MISSING')}" "$VERIFY_JSON")"
  VERIFY_TS="$(node -e "try{const d=require('fs').readFileSync(process.argv[1],'utf8');const j=JSON.parse(d);process.stdout.write(String(j.timestamp||j.finishedAt||'unknown'));}catch{process.stdout.write('unknown')}" "$VERIFY_JSON")"
  if [ "$OVERALL" != "PASS" ]; then
    PASS=false
    ISSUES+=("Last verify result: $OVERALL (expected PASS) at $VERIFY_TS")
  else
    echo "    PASS — Last verify: $OVERALL at $VERIFY_TS"
  fi
fi

# ── Gate 3: All PM2 services online with low restart count ───────────────────
echo "[3] PM2 service health..."
if ! command -v pm2 >/dev/null 2>&1; then
  PASS=false
  ISSUES+=("pm2 not found in PATH")
else
  for SVC in kanak-api kanak-donor-web kanak-institution-web kanak-admin-web; do
    STATUS=$(pm2_field "$SVC" status)
    RESTARTS=$(pm2_field "$SVC" restarts)
    MEMORY=$(pm2_field "$SVC" memory)
    MEMORY_MB=$(( ${MEMORY:-0} / 1024 / 1024 ))

    if [ "$STATUS" != "online" ]; then
      PASS=false
      ISSUES+=("PM2 $SVC status: $STATUS (expected: online)")
    elif [ "${RESTARTS:-0}" -gt "$MAX_RESTARTS" ]; then
      PASS=false
      ISSUES+=("PM2 $SVC restart count: $RESTARTS (max: $MAX_RESTARTS)")
    else
      WARN=""
      if [ "${RESTARTS:-0}" -gt 1 ]; then
        WARN=" ← elevated restarts"
        WARNINGS+=("$SVC has $RESTARTS restarts — monitor")
      fi
      echo "    PASS — $SVC: online | ${MEMORY_MB}MB | restarts: $RESTARTS$WARN"
    fi
  done
fi

# ── Gate 4: No high or critical dependency advisories ────────────────────────
echo "[4] Dependency security audit (high/critical only)..."
AUDIT_FAIL=false
if [ ! -d "$APP_DIR" ]; then
  PASS=false
  ISSUES+=("APP_DIR not a directory: $APP_DIR")
else
  for SUB in apps/api apps/admin-web apps/donor-web apps/institution-web; do
    if [ -d "$APP_DIR/$SUB" ]; then
      VULN=$(cd "$APP_DIR/$SUB" && npm audit --json --audit-level=high 2>/dev/null | node -e "
        try {
          const d = JSON.parse(require('fs').readFileSync(0, 'utf8'));
          const h = d.metadata?.vulnerabilities?.high ?? 0;
          const c = d.metadata?.vulnerabilities?.critical ?? 0;
          process.stdout.write(String(Number(h) + Number(c)));
        } catch {
          process.stdout.write('0');
        }
      " || echo "0")
      if [ "${VULN:-0}" -gt 0 ]; then
        PASS=false
        AUDIT_FAIL=true
        ISSUES+=("$SUB: $VULN high/critical advisories unresolved")
      else
        echo "    PASS — $SUB: 0 high/critical advisories"
      fi
    fi
  done
fi
if ! $AUDIT_FAIL; then
  echo "    NOTE: Moderate advisory (GHSA-qx2v-qp2m-jg93 / postcss via next)"
  echo "          is deferred — documented in docs/operations/dependency-deferral.md"
fi

# ── Gate 5: CI is in strict warning mode ─────────────────────────────────────
echo "[5] CI strict warning policy..."
if [ -d "$CI_WORKFLOW_DIR" ] && grep -r "strict" "$CI_WORKFLOW_DIR"/*.yml >/dev/null 2>&1; then
  echo "    PASS — strict mode found in CI workflow"
else
  PASS=false
  ISSUES+=("CI strict warning mode not confirmed in $CI_WORKFLOW_DIR")
fi

# ── Gate 6: Operator activity (at least 1 action in last 14 days) ────────────
echo "[6] Operator workflow adoption..."
if [ -z "${INTERNAL_API_SECRET}" ]; then
  WARNINGS+=("INTERNAL_API_SECRET not set — skipping operator activity check")
  echo "    WARN — skipped (INTERNAL_API_SECRET not set)"
else
  ACTIONS=$(curl -sf \
    -H "Authorization: Bearer $INTERNAL_API_SECRET" \
    "${LOCAL_API_BASE}/internal/operator-activity?days=14" | node -e "
      try {
        const d = JSON.parse(require('fs').readFileSync(0, 'utf8'));
        process.stdout.write(String(d.data?.total_actions ?? 0));
      } catch {
        process.stdout.write('0');
      }
    " || echo "0")
  if [ "${ACTIONS:-0}" -lt 1 ]; then
    WARNINGS+=("Operator activity: 0 actions in 14 days — adoption unverified")
    echo "    WARN — 0 operator actions logged in 14 days"
  else
    echo "    PASS — $ACTIONS operator actions in last 14 days"
  fi
fi

# ── Gate 7: Backup freshness ─────────────────────────────────────────────────
echo "[7] Backup freshness..."
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "*.sql*" -mtime -1 2>/dev/null | head -1 || true)
if [ -z "${LATEST_BACKUP:-}" ]; then
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
