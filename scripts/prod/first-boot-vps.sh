#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   DOMAIN=kanaksetu.com VPS_USER=deploy GIT_REPO=git@github.com:org/kanak-setu.git BRANCH=main bash scripts/prod/first-boot-vps.sh
# Optional:
#   APP_DIR=/opt/kanak-setu NODE_MAJOR=20

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
VPS_USER="${VPS_USER:-deploy}"
GIT_REPO="${GIT_REPO:-}"
BRANCH="${BRANCH:-main}"
NODE_MAJOR="${NODE_MAJOR:-20}"
DOMAIN="${DOMAIN:-kanaksetu.com}"

if [[ -z "${GIT_REPO}" ]]; then
  echo "[bootstrap] ERROR: set GIT_REPO (ssh/https clone url)"
  exit 1
fi

echo "[bootstrap] install base packages"
sudo apt-get update -y
sudo apt-get install -y curl git ca-certificates gnupg lsb-release unzip jq

echo "[bootstrap] install Node.js ${NODE_MAJOR}.x"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v
npm -v

echo "[bootstrap] install pm2"
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi
pm2 -v

echo "[bootstrap] install Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
fi
sudo usermod -aG docker "${VPS_USER}" || true

echo "[bootstrap] install Caddy"
if ! command -v caddy >/dev/null 2>&1; then
  sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y caddy
fi

echo "[bootstrap] clone/update app"
sudo mkdir -p "${APP_DIR}"
sudo chown -R "${VPS_USER}:${VPS_USER}" "${APP_DIR}"

if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone "${GIT_REPO}" "${APP_DIR}"
fi

cd "${APP_DIR}"
git fetch --all --prune
git checkout "${BRANCH}"
git pull origin "${BRANCH}"

echo "[bootstrap] start data services (postgres + redis)"
docker compose -f infra/docker-compose.yml up -d

echo "[bootstrap] install production env template"
if [[ ! -f infra/prod/.env.production ]]; then
  cp infra/prod/.env.production.example infra/prod/.env.production
  echo "[bootstrap] created infra/prod/.env.production (EDIT THIS FILE BEFORE DEPLOY)"
fi

echo "[bootstrap] install Caddy config template"
sudo cp infra/prod/Caddyfile /etc/caddy/Caddyfile
if [[ -f infra/prod/.env.production ]]; then
  sudo env APP_DIR="${APP_DIR}" bash scripts/prod/sync-caddy-kanak-api-port.sh || true
fi
sudo systemctl enable caddy
sudo systemctl restart caddy

echo "[bootstrap] done"
echo "[bootstrap] next:"
echo "  1) edit ${APP_DIR}/infra/prod/.env.production"
echo "  2) deploy: APP_DIR=${APP_DIR} BRANCH=${BRANCH} bash scripts/prod/deploy-vps.sh"
echo "  3) check: pm2 status && curl -fsS http://localhost:4000/api/v1/health"
echo "  4) verify DNS points to this VPS for ${DOMAIN} + subdomains"
