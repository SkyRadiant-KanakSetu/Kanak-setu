#!/usr/bin/env bash
# Generate Prisma Client from repo root. Ensures DATABASE_URL is set: `prisma generate`
# validates the datasource and can throw internal "path" errors if it is missing.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT}"
export DATABASE_URL="${DATABASE_URL:-postgresql://127.0.0.1:5432/_prisma_generate_placeholder?schema=public}"
# Never use `npm exec prisma` / bare `npx prisma`: npm can resolve prisma@7+ from the registry and
# break schema validation (P1012). Always invoke the workspace-installed CLI from package-lock.
PRISMA_BIN="${ROOT}/node_modules/.bin/prisma"
if [[ ! -x "$PRISMA_BIN" ]]; then
  echo "error: ${PRISMA_BIN} missing or not executable — run from repo root: NODE_ENV=development npm ci" >&2
  exit 1
fi
exec "${PRISMA_BIN}" generate --schema="${ROOT}/prisma/schema.prisma"
