#!/usr/bin/env bash
# shellcheck shell=bash
# Sourced by post-deploy-verify.sh and stage4-gate.sh
# Resolves the loopback URL for GET /api/v1/health (kanak-api).
#
# Usage: LOCAL_API_BASE="$(kanak_discover_local_api_base "${VERIFY_LOCAL_API_USER}")"

kanak_discover_local_api_base() {
  local user_override="${1-}"
  if [[ -n "${user_override}" ]]; then
    printf '%s' "${user_override}"
    return 0
  fi

  local candidates=()
  local p=""

  if command -v pm2 >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
    p="$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | .pm2_env.env.PORT // empty' | head -1)"
    if [[ -z "${p}" || "${p}" == "null" ]]; then
      p="$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | (.pm2_env.env // {}) | .PORT // empty' | head -1)"
    fi
    [[ -n "${p}" && "${p}" != "null" ]] && candidates+=("${p}")
  fi

  [[ -n "${PORT:-}" ]] && candidates+=("${PORT}")
  # Common drift / alternate configs (API may listen here while PM2 env still says 4000)
  candidates+=(4000 4100 8080 3000)

  local seen='|'
  local port host url uniq
  for port in "${candidates[@]}"; do
    [[ -z "${port}" || "${port}" == "null" ]] && continue
    case "${seen}" in *"|${port}|"*) continue ;; esac
    seen+="${port}|"
    for host in 127.0.0.1 localhost; do
      url="http://${host}:${port}/api/v1"
      if curl -fsS --connect-timeout 2 "${url}/health" >/dev/null 2>&1; then
        printf '%s' "${url}"
        return 0
      fi
    done
  done

  # Last resort: map kanak-api PID to listening TCP port via ss (Linux)
  if command -v pm2 >/dev/null 2>&1 && command -v jq >/dev/null 2>&1 && command -v ss >/dev/null 2>&1; then
    local pid
    pid="$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | .pid // empty' | head -1)"
    if [[ -n "${pid}" ]] && [[ "${pid}" -gt 0 ]]; then
      local line
      line="$(ss -tlnp 2>/dev/null | grep "pid=${pid}" | head -1 || true)"
      if [[ -n "${line}" ]]; then
        port="$(
          echo "${line}" | awk '{for(i=1;i<=NF;i++) if ($i ~ /^[^:]+:[0-9]+$/) { n=split($i,a,":"); print a[n]; exit }}'
        )"
        if [[ -n "${port}" ]]; then
          for host in 127.0.0.1 localhost; do
            url="http://${host}:${port}/api/v1"
            if curl -fsS --connect-timeout 2 "${url}/health" >/dev/null 2>&1; then
              printf '%s' "${url}"
              return 0
            fi
          done
        fi
      fi
    fi
  fi

  printf '%s' "http://127.0.0.1:${PORT:-4000}/api/v1"
  return 1
}
