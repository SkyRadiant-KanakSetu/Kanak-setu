#!/usr/bin/env bash
set -euo pipefail

# Production dependency audit helper.
# Defaults:
# - fails on critical vulnerabilities
# - does NOT fail on high unless FAIL_ON_HIGH=1
#
# Usage:
#   bash scripts/security/audit-prod.sh
#   FAIL_ON_HIGH=1 bash scripts/security/audit-prod.sh

REPORT_FILE="${1:-}"
if [[ -z "${REPORT_FILE}" ]]; then
  REPORT_FILE="$(mktemp)"
  trap 'rm -f "${REPORT_FILE}"' EXIT
fi

npm audit --omit=dev --json > "${REPORT_FILE}" || true

node - "${REPORT_FILE}" <<'NODE'
const fs = require('fs');
const path = process.argv[2];
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const counts = data?.metadata?.vulnerabilities || {};
const high = Number(counts.high || 0);
const critical = Number(counts.critical || 0);
const moderate = Number(counts.moderate || 0);
const total = Number(counts.total || 0);

console.log(`[audit:prod] total=${total} critical=${critical} high=${high} moderate=${moderate}`);

const vuln = data?.vulnerabilities || {};
const keys = Object.keys(vuln);
if (keys.length) {
  console.log('[audit:prod] packages: ' + keys.join(', '));
}

if (critical > 0) {
  console.error('[audit:prod] FAIL: critical vulnerabilities present.');
  process.exit(2);
}

if (process.env.FAIL_ON_HIGH === '1' && high > 0) {
  console.error('[audit:prod] FAIL: high vulnerabilities present and FAIL_ON_HIGH=1.');
  process.exit(3);
}
NODE
