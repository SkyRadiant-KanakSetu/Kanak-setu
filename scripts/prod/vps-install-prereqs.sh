#!/usr/bin/env bash
# One-time Ubuntu/Debian VPS packages: Postgres, Redis, Node 20, PM2, Caddy, UFW.
# Must run as root: sudo bash scripts/prod/vps-install-prereqs.sh

set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "ERROR: run as root: sudo bash $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "[prereqs] apt update + base packages"
apt-get update -y
apt-get install -y \
  curl \
  git \
  ca-certificates \
  gnupg \
  ufw \
  postgresql \
  postgresql-contrib \
  redis-server

echo "[prereqs] Node.js 20 (NodeSource)"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "[prereqs] PM2 (global)"
npm install -g pm2

echo "[prereqs] Caddy"
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update -y
apt-get install -y caddy

echo "[prereqs] enable Postgres + Redis on boot"
systemctl enable postgresql
systemctl enable redis-server
systemctl start postgresql
systemctl start redis-server

echo "[prereqs] UFW (SSH + HTTP + HTTPS)"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable || true

echo "[prereqs] done: node $(node -v) npm $(npm -v) pm2 $(pm2 -v 2>/dev/null | head -n1)"
