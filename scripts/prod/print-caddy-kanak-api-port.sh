#!/usr/bin/env bash
# Print KANAK_API_PORT for Caddy from infra/prod/.env.production (same source as PM2 kanak-api PORT).
# Usage on VPS (shell only): eval "$(APP_DIR=/opt/kanak-setu bash scripts/prod/print-caddy-kanak-api-port.sh)"
# To persist for systemd/Caddy: sudo APP_DIR=/opt/kanak-setu bash scripts/prod/sync-caddy-kanak-api-port.sh
set -euo pipefail
APP_DIR="${APP_DIR:-/opt/kanak-setu}"
ENV_FILE="${APP_DIR}/infra/prod/.env.production"
PORT="4000"
if [[ -f "${ENV_FILE}" ]]; then
  line="$(grep -E '^[[:space:]]*PORT=' "${ENV_FILE}" | head -1 || true)"
  if [[ -n "${line}" ]]; then
    PORT="${line#*=}"
    PORT="${PORT//\"/}"
    PORT="${PORT//\'/}"
    PORT="$(echo "${PORT}" | tr -d '[:space:]')"
  fi
fi
[[ -z "${PORT}" ]] && PORT="4000"
echo "export KANAK_API_PORT=${PORT}"
echo "# Reload Caddy after updating its environment, e.g.: systemctl reload caddy"
