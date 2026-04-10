#!/usr/bin/env bash

set -euo pipefail

API_BASE="${API_BASE:-http://localhost:4000/api/v1}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@kanaksetu.in}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-password123}"

echo "[smoke] API base: ${API_BASE}"

login_payload=$(printf '{"email":"%s","password":"%s"}' "${ADMIN_EMAIL}" "${ADMIN_PASSWORD}")
login_response=$(curl -sS -X POST "${API_BASE}/auth/login" \
  -H "Content-Type: application/json" \
  -d "${login_payload}")

access_token=$(echo "${login_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.data?.accessToken||'')}catch{process.stdout.write('')}})")
if [[ -z "${access_token}" ]]; then
  echo "[smoke] FAIL: login did not return access token"
  echo "[smoke] Response: ${login_response}"
  exit 1
fi
echo "[smoke] PASS: login"

auth_header="Authorization: Bearer ${access_token}"

dashboard_response=$(curl -sS "${API_BASE}/admin/dashboard" -H "${auth_header}")
dashboard_success=$(echo "${dashboard_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.success===true))}catch{process.stdout.write('false')}})")
if [[ "${dashboard_success}" != "true" ]]; then
  echo "[smoke] FAIL: admin dashboard"
  echo "[smoke] Response: ${dashboard_response}"
  exit 1
fi
echo "[smoke] PASS: admin dashboard"

recon_response=$(curl -sS -X POST "${API_BASE}/admin/reconciliation/run" -H "${auth_header}")
recon_success=$(echo "${recon_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.success===true))}catch{process.stdout.write('false')}})")
if [[ "${recon_success}" != "true" ]]; then
  echo "[smoke] FAIL: reconciliation trigger"
  echo "[smoke] Response: ${recon_response}"
  exit 1
fi
echo "[smoke] PASS: reconciliation trigger"

deliveries_response=$(curl -sS "${API_BASE}/admin/webhooks/deliveries?page=1&limit=5" -H "${auth_header}")
deliveries_success=$(echo "${deliveries_response}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j.success===true))}catch{process.stdout.write('false')}})")
if [[ "${deliveries_success}" != "true" ]]; then
  echo "[smoke] FAIL: webhook deliveries list"
  echo "[smoke] Response: ${deliveries_response}"
  exit 1
fi
echo "[smoke] PASS: webhook deliveries list"

echo "[smoke] ALL CHECKS PASSED"
