#!/usr/bin/env bash
# shellcheck shell=bash
# Sourced by post-deploy-verify.sh and stage4-gate.sh
# Resolves the loopback URL for GET /api/v1/health (kanak-api).
#
# Usage: LOCAL_API_BASE="$(kanak_discover_local_api_base "${VERIFY_LOCAL_API_USER}")"

# Linux: listening TCP port for a PID (first match), or empty.
_kanak_listen_port_for_pid() {
  local pid="$1"
  local line
  [[ -n "${pid}" ]] && [[ "${pid}" =~ ^[1-9][0-9]*$ ]] || return 0
  line="$(ss -tlnp 2>/dev/null | grep "pid=${pid}" | head -1 || true)"
  [[ -z "${line}" ]] && return 0
  echo "${line}" | awk '{for(i=1;i<=NF;i++) if ($i ~ /^[^:]+:[0-9]+$/) { n=split($i,a,":"); print a[n]; exit }}'
}

kanak_discover_local_api_base() {
  local user_override="${1-}"
  if [[ -n "${user_override}" ]]; then
    printf '%s' "${user_override}"
    return 0
  fi

  local candidates=()
  local p=""

  if command -v pm2 >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
    # jq/pm2 failures must not abort callers running under `set -e`
    p="$(
      pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | .pm2_env.env.PORT // empty' 2>/dev/null | head -1
    )" || true
    if [[ -z "${p}" || "${p}" == "null" ]]; then
      p="$(
        pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | (.pm2_env.env // {}) | .PORT // empty' 2>/dev/null | head -1
      )" || true
    fi
    [[ -n "${p}" && "${p}" != "null" ]] && candidates+=("${p}")
  fi

  [[ -n "${PORT:-}" ]] && candidates+=("${PORT}")
  # Common drift / alternate configs (API may listen here while PM2 env still says 4000)
  candidates+=(4000 4100 8080 3000)

  # Prefer actual listen port from ss when PM2/env PORT is stale (e.g. env 4000, process *:4100)
  if command -v pm2 >/dev/null 2>&1 && command -v jq >/dev/null 2>&1 && command -v ss >/dev/null 2>&1; then
    local apipid listen_port
    apipid="$(
      pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | .pid // empty' 2>/dev/null | head -1
    )" || true
    listen_port="$(_kanak_listen_port_for_pid "${apipid}")"
    if [[ -n "${listen_port}" ]]; then
      candidates=("${listen_port}" "${candidates[@]}")
    fi
  fi

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
    pid="$(
      pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="kanak-api") | .pid // empty' 2>/dev/null | head -1
    )" || true
    if [[ -n "${pid}" ]] && [[ "${pid}" =~ ^[1-9][0-9]*$ ]]; then
      port="$(_kanak_listen_port_for_pid "${pid}")"
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

  printf '%s' "http://127.0.0.1:${PORT:-4000}/api/v1"
  # Always return 0 so `LOCAL_API_BASE="$(kanak_discover …)"` does not abort `set -e` callers;
  # verification curls below decide success.
  return 0
}
