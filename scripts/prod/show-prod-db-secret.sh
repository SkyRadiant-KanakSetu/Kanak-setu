#!/usr/bin/env bash
# Print database user, database name, and password from DATABASE_URL in
# infra/prod/.env.production (VPS / operator use only; file is gitignored).
#
#   cd /opt/kanak-setu
#   bash scripts/prod/show-prod-db-secret.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
ENV_FILE="${APP_DIR}/infra/prod/.env.production"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found"
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
node -e "
const u = new URL(process.env.DATABASE_URL);
const db = (u.pathname || '/').replace(/^\\//, '').split('?')[0] || 'kanak_setu';
console.log('Database user:     ' + (u.username || 'kanak'));
console.log('Database name:     ' + db);
console.log('Database password: ' + (u.password || ''));
"
