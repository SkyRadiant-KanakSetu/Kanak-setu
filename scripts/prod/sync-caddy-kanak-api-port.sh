#!/usr/bin/env bash
# Persist KANAK_API_PORT for Caddy from infra/prod/.env.production (same PORT as PM2 kanak-api).
# Requires root. Writes systemd drop-in and restarts Caddy.
#
#   sudo APP_DIR=/opt/kanak-setu bash scripts/prod/sync-caddy-kanak-api-port.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
ENV_FILE="${APP_DIR}/infra/prod/.env.production"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "[sync] ERROR: run as root, e.g. sudo APP_DIR=${APP_DIR} bash $0"
  exit 1
fi

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
if ! [[ "${PORT}" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  echo "[sync] ERROR: invalid PORT from env file: ${PORT}"
  exit 1
fi

if ! systemctl cat caddy.service >/dev/null 2>&1; then
  echo "[sync] WARN: caddy.service not found — install Caddy first"
  exit 0
fi

DROP="/etc/systemd/system/caddy.service.d"
CONF="${DROP}/kanak-setu-api-port.conf"
mkdir -p "${DROP}"
cat >"${CONF}" <<EOF
# Managed by sync-caddy-kanak-api-port.sh — matches PORT in ${ENV_FILE}
[Service]
Environment=KANAK_API_PORT=${PORT}
EOF

systemctl daemon-reload
echo "[sync] ${CONF} → KANAK_API_PORT=${PORT}"
echo "[sync] run: systemctl restart caddy   (or reload if your unit supports it)"
