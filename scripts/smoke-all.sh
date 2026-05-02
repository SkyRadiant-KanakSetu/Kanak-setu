#!/usr/bin/env bash

set -euo pipefail

API_BASE="${API_BASE:-http://127.0.0.1:4100/api/v1}"
DONATION_ID="${DONATION_ID:-}"
CERT_REF="${CERT_REF:-}"
SMOKE_OUTPUT="${SMOKE_OUTPUT:-smoke-report.json}"

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
tmp_file="$(mktemp)"

run_result="PASS"
error_message=""

if ! bash scripts/smoke-local.sh >"${tmp_file}" 2>&1; then
  run_result="FAIL"
  error_message="smoke:local failed"
fi

if [[ "${run_result}" == "PASS" && -n "${DONATION_ID}" ]]; then
  if ! DONATION_ID="${DONATION_ID}" CERT_REF="${CERT_REF}" API_BASE="${API_BASE}" bash scripts/smoke-proof.sh >>"${tmp_file}" 2>&1; then
    run_result="FAIL"
    error_message="smoke:proof failed"
  fi
fi

node -e "
const fs = require('fs');
const details = fs.readFileSync(process.argv[1], 'utf8');
const outPath = process.argv[2];
const payload = {
  timestamp: process.argv[3],
  apiBase: process.argv[4],
  status: process.argv[5],
  ranProofChecks: process.argv[6] === 'true',
  donationId: process.argv[7] || null,
  certificateRef: process.argv[8] || null,
  error: process.argv[9] || null,
  details
};
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
" "${tmp_file}" "${SMOKE_OUTPUT}" "${timestamp}" "${API_BASE}" "${run_result}" "$( [[ -n "${DONATION_ID}" ]] && echo "true" || echo "false" )" "${DONATION_ID}" "${CERT_REF}" "${error_message}"

rm -f "${tmp_file}"

echo "[smoke-all] report written to ${SMOKE_OUTPUT}"
if [[ "${run_result}" != "PASS" ]]; then
  echo "[smoke-all] FAIL"
  exit 1
fi
echo "[smoke-all] PASS"
