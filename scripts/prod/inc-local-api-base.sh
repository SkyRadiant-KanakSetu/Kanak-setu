#!/usr/bin/env bash
# shellcheck shell=bash
# Sourced by post-deploy-verify.sh and stage4-gate.sh
# Resolves the loopback URL for GET /api/v1/health (kanak-api).
#
# Usage: LOCAL_API_BASE="$(kanak_discover_local_api_base "${VERIFY_LOCAL_API_USER}")"

# Extract TCP port from one `ss -tlnp` line (e.g. *:4100 or 127.0.0.1:4000).
_kanak_ss_line_listen_port() {
  awk '{for(i=1;i<=NF;i++) if ($i ~ /^[^:]+:[0-9]+$/) { n=split($i,a,":"); print a[n]; exit }}'
}

# Linux: listening TCP port for a PID (first match), or empty.
# Note: PM2 often wraps `npm`; the listening Node child PID may differ from PM2's top-level pid.
_kanak_listen_port_for_pid() {
  local pid="$1"
  local line
  [[ -n "${pid}" ]] && [[ "${pid}" =~ ^[1-9][0-9]*$ ]] || return 0
  line="$(ss -tlnp 2>/dev/null | grep "pid=${pid}" | head -1 || true)"
  [[ -z "${line}" ]] && return 0
  echo "${line}" | _kanak_ss_line_listen_port
}

# Ports where `ss` shows a plain Node listener (API worker), not Next.js (`next-server`).
_kanak_ss_node_listen_ports() {
  local line
  while IFS= read -r line || [[ -n "${line}" ]]; do
    [[ -z "${line}" ]] && continue
    echo "${line}" | _kanak_ss_line_listen_port
  done < <(ss -tlnp 2>/dev/null | grep -F '"node",pid=' || true)
}

# True if GET ${base}/health is Kanak API: 200 + { success: true, data: { status: "ok" } }.
# Rejects other Node apps on the same host (e.g. 401 JSON with a non-Kanak error body).
_kanak_api_health_ok() {
  local base="$1"
  local tmp code body
  tmp="$(mktemp)"
  code="$(curl -sS -o "${tmp}" -w "%{http_code}" --connect-timeout 2 "${base}/health" 2>/dev/null || echo "000")"
  body="$(cat "${tmp}" 2>/dev/null || true)"
  rm -f "${tmp}"
  [[ "${code}" == "200" ]] || return 1
  if command -v jq >/dev/null 2>&1; then
    echo "${body}" | jq -e '.success == true and .data.status == "ok"' >/dev/null 2>&1
    return $?
  fi
  echo "${body}" | grep -qE '"success"[[:space:]]*:[[:space:]]*true' || return 1
  echo "${body}" | grep -qE '"status"[[:space:]]*:[[:space:]]*"ok"' || return 1
  return 0
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

  # Extra listen ports from ss (append — do not prefer over PM2/PORT; avoids wrong app on 4100).
  if command -v ss >/dev/null 2>&1; then
    local np
    while IFS= read -r np || [[ -n "${np}" ]]; do
      [[ -z "${np}" ]] && continue
      candidates+=("${np}")
    done < <(_kanak_ss_node_listen_ports | sort -u)
  fi

  # Also try PM2-reported pid when it matches ss (fork mode / direct node).
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
  local port host url
  for port in "${candidates[@]}"; do
    [[ -z "${port}" || "${port}" == "null" ]] && continue
    case "${seen}" in *"|${port}|"*) continue ;; esac
    seen+="${port}|"
    for host in 127.0.0.1 localhost; do
      url="http://${host}:${port}/api/v1"
      if _kanak_api_health_ok "${url}"; then
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
          if _kanak_api_health_ok "${url}"; then
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
