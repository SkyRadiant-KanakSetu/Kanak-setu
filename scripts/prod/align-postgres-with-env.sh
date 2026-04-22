#!/usr/bin/env bash
# Align local PostgreSQL role + password + database with DATABASE_URL in
# infra/prod/.env.production. Run on the VPS as root when Prisma returns P1000
# (authentication failed) after credentials drift.
#
#   cd /opt/kanak-setu
#   sudo bash scripts/prod/align-postgres-with-env.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
ENV_FILE="${APP_DIR}/infra/prod/.env.production"

if [[ "${EUID}" -ne 0 ]]; then
  echo "ERROR: run as root: sudo bash $0"
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} missing. Copy infra/prod/.env.production.example and set DATABASE_URL."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL not set in ${ENV_FILE}"
  exit 1
fi

export DATABASE_URL

DB_USER="$(
  node -e "const u=new URL(process.env.DATABASE_URL); if(u.protocol!=='postgres:' && u.protocol!=='postgresql:'){process.exit(1)}; process.stdout.write((u.username||'kanak').toString())"
)"
DB_NAME="$(
  node -e "const u=new URL(process.env.DATABASE_URL); const p=(u.pathname||'/').replace(/^\//,'').split('?')[0]||'kanak_setu'; process.stdout.write(p.toString())"
)"
DB_PASS="$(
  node -e "const u=new URL(process.env.DATABASE_URL); process.stdout.write((u.password||'').toString())"
)"

if [[ -z "${DB_USER}" || "${#DB_USER}" -gt 64 ]]; then
  echo "ERROR: invalid database user in DATABASE_URL"
  exit 1
fi
if ! [[ "${DB_USER}" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
  echo "ERROR: database user in DATABASE_URL must be a simple identifier (e.g. kanak)"
  exit 1
fi
if ! [[ "${DB_NAME}" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
  echo "ERROR: database name in DATABASE_URL must be a simple identifier (e.g. kanak_setu)"
  exit 1
fi
if [[ -z "${DB_PASS}" ]]; then
  echo "ERROR: empty database password in DATABASE_URL"
  exit 1
fi

# Escape single quotes for use inside PostgreSQL string literals: O'Reilly -> O''Reilly
sql_pass="${DB_PASS//\'/\'\'}"

echo "[align-pg] ensuring role ${DB_USER} and database ${DB_NAME} match ${ENV_FILE}"

sudo -u postgres psql -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN CREATE ROLE ${DB_USER} LOGIN PASSWORD '${sql_pass}'; END IF; END \$\$;"

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
else
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};" || true
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER ${DB_USER} WITH PASSWORD '${sql_pass}';"

echo "[align-pg] done. PostgreSQL now accepts the same password as DATABASE_URL in that file (do not commit it)."
echo "[align-pg]   username:  ${DB_USER}"
echo "[align-pg]   database:  ${DB_NAME}"
echo "[align-pg]   password:  use scripts/prod/show-prod-db-secret.sh to print, or read DATABASE_URL on this server"
echo
echo "  Next: cd ${APP_DIR} && set -a && source infra/prod/.env.production && set +a && npx prisma migrate deploy --schema=prisma/schema.prisma && pm2 startOrReload ecosystem.config.cjs"
