#!/usr/bin/env bash
# First-time VPS bootstrap: clone, env, DB password sync, deploy, Caddy.
# Usage on the server (after Node/Postgres/Redis/Caddy/ufw are installed):
#   export REPO_URL='https://github.com/YOUR_USER/kanak-setu.git'
#   export BRANCH='main'   # or master
#   bash scripts/prod/vps-one-shot.sh
#
# Or from repo root after git clone:
#   REPO_URL=... BRANCH=main bash scripts/prod/vps-one-shot.sh

set -euo pipefail

REPO_URL="${REPO_URL:-}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-/opt/kanak-setu}"

echo "[bootstrap] app dir: ${APP_DIR}"
echo "[bootstrap] branch: ${BRANCH}"

if [[ ! -d "${APP_DIR}/.git" ]]; then
  if [[ -z "${REPO_URL}" ]]; then
    echo "ERROR: ${APP_DIR} is missing. Clone first or set REPO_URL, e.g."
    echo "  export REPO_URL='https://github.com/your-org/kanak-setu.git'"
    exit 1
  fi
  mkdir -p "$(dirname "${APP_DIR}")"
  git clone --branch "${BRANCH}" "${REPO_URL}" "${APP_DIR}" || {
    git clone "${REPO_URL}" "${APP_DIR}"
    cd "${APP_DIR}"
    git checkout "${BRANCH}"
  }
fi

cd "${APP_DIR}"
git fetch --all --prune
git checkout "${BRANCH}"
git pull origin "${BRANCH}"

ENV_FILE="infra/prod/.env.production"

if [[ -f "${ENV_FILE}" && "${RESET_ENV:-0}" != "1" ]]; then
  echo "[bootstrap] keeping existing ${ENV_FILE} (set RESET_ENV=1 to regenerate)"
else
  DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -hex 16)}"
  JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"

  sql_pass="${DB_PASSWORD//\'/\'\'}"
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'kanak') THEN CREATE ROLE kanak LOGIN PASSWORD '${sql_pass}'; END IF; END \$\$;"
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='kanak_setu'" | grep -q 1; then
    sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE kanak_setu OWNER kanak;"
  fi
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER kanak WITH PASSWORD '${sql_pass}';"

  cat > "${ENV_FILE}" << EOF
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://kanak:${DB_PASSWORD}@localhost:5432/kanak_setu
REDIS_URL=redis://localhost:6379
API_BASE_URL=https://api.kanaksetu.com
DONOR_WEB_URL=https://kanaksetu.com
INSTITUTION_WEB_URL=https://institution.kanaksetu.com
ADMIN_WEB_URL=https://admin.kanaksetu.com
JWT_SECRET=${JWT_SECRET}
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
PAYMENT_PROVIDER=MOCK
GOLD_VENDOR=MOCK
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
ANCHOR_PRIVATE_KEY=
ANCHOR_CONTRACT_ADDRESS=
CHAIN_ID=80002
CORS_ORIGINS=https://kanaksetu.com,https://institution.kanaksetu.com,https://admin.kanaksetu.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
EOF

  chmod 600 "${ENV_FILE}"
  echo "[bootstrap] wrote ${ENV_FILE} (save a backup; JWT and DB password are new unless you set DB_PASSWORD / JWT_SECRET)"
fi

chmod +x scripts/prod/deploy-vps.sh
APP_DIR="${APP_DIR}" BRANCH="${BRANCH}" bash scripts/prod/deploy-vps.sh

cp infra/prod/Caddyfile /etc/caddy/Caddyfile
systemctl restart caddy
systemctl enable caddy

echo "[bootstrap] done. Verify:"
echo "  curl -sS https://api.kanaksetu.com/api/v1/health"
echo "  curl -I https://kanaksetu.com"
