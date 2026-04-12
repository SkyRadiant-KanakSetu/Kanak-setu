#!/usr/bin/env bash
# Register PM2 with systemd so processes survive reboot (run after first pm2 start / pm2 save).
set -euo pipefail

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[pm2-startup] pm2 not in PATH; skip"
  exit 0
fi

pm2 save

OUT="$(pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>&1)" || true
echo "${OUT}"

SUDO_LINE="$(echo "${OUT}" | grep '^sudo ' | tail -n1 || true)"
if [[ -n "${SUDO_LINE}" ]]; then
  echo "[pm2-startup] executing systemd hook from PM2"
  eval "${SUDO_LINE}"
else
  if [[ "${EUID}" -eq 0 ]]; then
    env PATH="${PATH}" pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
  fi
fi

pm2 save
echo "[pm2-startup] done"
