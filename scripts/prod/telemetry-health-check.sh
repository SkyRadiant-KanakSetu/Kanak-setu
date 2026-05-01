#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
LOG_DIR="${LOG_DIR:-${APP_DIR}/logs}"
TELEMETRY_LOG="${LOG_DIR}/deploy-telemetry.log"
VERIFY_FILE="${LOG_DIR}/last-verify.json"
OUT_FILE="${LOG_DIR}/telemetry-health-latest.txt"
MIN_ENTRIES="${MIN_ENTRIES:-3}"
WORKFLOW_DIR="${APP_DIR}/.github/workflows"

mkdir -p "${LOG_DIR}"

if [[ -d "${APP_DIR}" ]]; then
  cd "${APP_DIR}"
fi

now_utc="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
overall="HEALTHY"
warnings=()

telemetry_entries=0
last_deploy_type="-"
last_install_skipped="-"
last_duration="-"
last_deploy_line=""
if [[ -f "${TELEMETRY_LOG}" ]]; then
  telemetry_entries="$(wc -l < "${TELEMETRY_LOG}" | awk '{print $1}')"
  if [[ "${telemetry_entries}" -gt 0 ]]; then
    last_deploy_line="$(tail -n 1 "${TELEMETRY_LOG}")"
    IFS='|' read -r _ts _dtype _skip _dur <<<"${last_deploy_line}"
    last_deploy_type="$(echo "${_dtype:-}" | xargs)"
    last_install_skipped="$(echo "${_skip:-}" | xargs)"
    last_duration="$(echo "${_dur:-}" | xargs)s"
  fi
else
  warnings+=("Telemetry log missing")
fi
if [[ "${telemetry_entries}" -lt "${MIN_ENTRIES}" ]]; then
  warnings+=("Telemetry entries below threshold (${telemetry_entries}/${MIN_ENTRIES})")
fi

last_verify_status="MISSING"
last_verify_time="-"
if [[ -f "${VERIFY_FILE}" ]]; then
  last_verify_status="$(node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(d.overall || (d.success? 'PASS':'FAIL') || 'UNKNOWN');" "${VERIFY_FILE}" 2>/dev/null || echo "PARSE_ERROR")"
  last_verify_time="$(node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(d.finishedAt || d.timestamp || '-');" "${VERIFY_FILE}" 2>/dev/null || echo "-")"
else
  warnings+=("last-verify.json missing")
fi

pm2_status_kanak_api="missing"
pm2_status_donor="missing"
pm2_status_institution="missing"
pm2_status_admin="missing"
pm2_mem_kanak_api="0"
pm2_mem_donor="0"
pm2_mem_institution="0"
pm2_mem_admin="0"
pm2_restarts_kanak_api="0"
pm2_restarts_donor="0"
pm2_restarts_institution="0"
pm2_restarts_admin="0"

if command -v pm2 >/dev/null 2>&1; then
  while IFS='|' read -r name status mem restart; do
    [[ -z "${name}" ]] && continue
    case "${name}" in
      kanak-api)
        pm2_status_kanak_api="${status}"
        pm2_mem_kanak_api="${mem}"
        pm2_restarts_kanak_api="${restart}"
        ;;
      kanak-donor-web)
        pm2_status_donor="${status}"
        pm2_mem_donor="${mem}"
        pm2_restarts_donor="${restart}"
        ;;
      kanak-institution-web)
        pm2_status_institution="${status}"
        pm2_mem_institution="${mem}"
        pm2_restarts_institution="${restart}"
        ;;
      kanak-admin-web)
        pm2_status_admin="${status}"
        pm2_mem_admin="${mem}"
        pm2_restarts_admin="${restart}"
        ;;
    esac
  done < <(
    pm2 jlist 2>/dev/null | node -e '
      const fs=require("fs");
      const raw=fs.readFileSync(0,"utf8");
      const start=raw.indexOf("[");
      if (start < 0) process.exit(0);
      const apps=JSON.parse(raw.slice(start));
      for (const a of apps) {
        const name=a.name||"";
        if (!["kanak-api","kanak-donor-web","kanak-institution-web","kanak-admin-web"].includes(name)) continue;
        const st=a.pm2_env?.status||"unknown";
        const mem=((a.monit?.memory||0)/(1024*1024)).toFixed(0);
        const rt=String(a.pm2_env?.restart_time||0);
        console.log([name,st,mem,rt].join("|"));
      }
    '
  )
else
  warnings+=("pm2 not found in PATH")
fi

[[ "${pm2_status_kanak_api}" == "online" ]] || warnings+=("kanak-api not online (${pm2_status_kanak_api})")
[[ "${pm2_status_donor}" == "online" ]] || warnings+=("kanak-donor-web not online (${pm2_status_donor})")
[[ "${pm2_status_institution}" == "online" ]] || warnings+=("kanak-institution-web not online (${pm2_status_institution})")
[[ "${pm2_status_admin}" == "online" ]] || warnings+=("kanak-admin-web not online (${pm2_status_admin})")

if [[ -n "${last_deploy_line}" ]]; then
  [[ "${pm2_restarts_kanak_api}" -le 3 ]] || warnings+=("kanak-api restart count ${pm2_restarts_kanak_api} > 3 since last deploy")
  [[ "${pm2_restarts_donor}" -le 3 ]] || warnings+=("kanak-donor-web restart count ${pm2_restarts_donor} > 3 since last deploy")
  [[ "${pm2_restarts_institution}" -le 3 ]] || warnings+=("kanak-institution-web restart count ${pm2_restarts_institution} > 3 since last deploy")
  [[ "${pm2_restarts_admin}" -le 3 ]] || warnings+=("kanak-admin-web restart count ${pm2_restarts_admin} > 3 since last deploy")
fi

ci_strict="FAIL"
STRICT_HIT=""

for candidate_dir in ".github/workflows" "${WORKFLOW_DIR}" "${APP_DIR}/.github/workflows" "/opt/kanak-setu/.github/workflows"; do
  if [[ -d "${candidate_dir}" ]]; then
    STRICT_HIT="$(grep -Ril "strict" "${candidate_dir}" 2>/dev/null | head -1 || true)"
    [[ -n "${STRICT_HIT}" ]] && break
  fi
done

if [[ -n "${STRICT_HIT}" ]]; then
  ci_strict="PASS"
else
  warnings+=("CI strict mode not confirmed in workflow")
fi

if [[ "${#warnings[@]}" -gt 0 ]]; then
  overall="WARNING"
fi

{
  echo "=== Kanak Setu Telemetry Health ==="
  echo "Timestamp:         ${now_utc}"
  echo "Telemetry entries: ${telemetry_entries}"
  echo "Last deploy type:  ${last_deploy_type}"
  if [[ "${last_deploy_type}" != "-" ]]; then
    echo "Last deploy:       PASS (install skipped: ${last_install_skipped}, duration: ${last_duration})"
  else
    echo "Last deploy:       MISSING"
  fi
  echo "Last verify:       ${last_verify_status} (${last_verify_time})"
  echo "PM2 kanak-api:     ${pm2_status_kanak_api} | ${pm2_mem_kanak_api}MB | restarts: ${pm2_restarts_kanak_api}"
  echo "PM2 donor:         ${pm2_status_donor} | ${pm2_mem_donor}MB | restarts: ${pm2_restarts_donor}"
  echo "PM2 institution:   ${pm2_status_institution} | ${pm2_mem_institution}MB | restarts: ${pm2_restarts_institution}"
  echo "PM2 admin:         ${pm2_status_admin} | ${pm2_mem_admin}MB | restarts: ${pm2_restarts_admin}"
  echo "CI strict mode:    ${ci_strict}"
  if [[ -f "${TELEMETRY_LOG}" ]]; then
    echo "Last 5 telemetry lines:"
    tail -n 5 "${TELEMETRY_LOG}" || true
  fi
  if [[ "${#warnings[@]}" -gt 0 ]]; then
    echo "Warnings:"
    for item in "${warnings[@]}"; do
      echo "  - ${item}"
    done
  fi
  echo "Overall:           ${overall}"
  echo "==================================="
} | tee "${OUT_FILE}"

