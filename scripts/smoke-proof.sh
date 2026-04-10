#!/usr/bin/env bash

set -euo pipefail

API_BASE="${API_BASE:-http://localhost:4000/api/v1}"
DONATION_ID="${DONATION_ID:-}"
CERT_REF="${CERT_REF:-}"

if [[ -z "${DONATION_ID}" ]]; then
  echo "Usage: DONATION_ID=<donation_id> [CERT_REF=<verification_ref>] bash scripts/smoke-proof.sh"
  exit 1
fi

echo "[proof-smoke] API base: ${API_BASE}"
echo "[proof-smoke] Donation: ${DONATION_ID}"

proof_response=$(curl -sS "${API_BASE}/merkle/proof/${DONATION_ID}")
proof_success=$(echo "${proof_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.success===true))}catch{process.stdout.write('false')}})")
if [[ "${proof_success}" != "true" ]]; then
  echo "[proof-smoke] FAIL: fetch proof"
  echo "[proof-smoke] Response: ${proof_response}"
  exit 1
fi
echo "[proof-smoke] PASS: fetch proof"

leaf_hash=$(echo "${proof_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.data?.leafHash||'')}catch{process.stdout.write('')}})")
merkle_root=$(echo "${proof_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.data?.merkleRoot||'')}catch{process.stdout.write('')}})")
proof_json=$(echo "${proof_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(JSON.stringify(j.data?.proof||{}))}catch{process.stdout.write('{}')}})")

verify_payload=$(printf '{"leafHash":"%s","proof":%s,"merkleRoot":"%s"}' "${leaf_hash}" "${proof_json}" "${merkle_root}")
verify_response=$(curl -sS -X POST "${API_BASE}/merkle/verify" \
  -H "Content-Type: application/json" \
  -d "${verify_payload}")
verify_valid=$(echo "${verify_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.data?.valid===true))}catch{process.stdout.write('false')}})")
if [[ "${verify_valid}" != "true" ]]; then
  echo "[proof-smoke] FAIL: verify proof"
  echo "[proof-smoke] Response: ${verify_response}"
  exit 1
fi
echo "[proof-smoke] PASS: verify proof"

if [[ -n "${CERT_REF}" ]]; then
  cert_response=$(curl -sS "${API_BASE}/verify/${CERT_REF}")
  cert_success=$(echo "${cert_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.success===true))}catch{process.stdout.write('false')}})")
  if [[ "${cert_success}" != "true" ]]; then
    echo "[proof-smoke] FAIL: certificate verify"
    echo "[proof-smoke] Response: ${cert_response}"
    exit 1
  fi
  echo "[proof-smoke] PASS: certificate verify"
fi

echo "[proof-smoke] ALL CHECKS PASSED"
