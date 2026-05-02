#!/usr/bin/env bash
# Generate Prisma Client from repo root. Ensures DATABASE_URL is set: `prisma generate`
# validates the datasource and can throw internal "path" errors if it is missing.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT}"
export DATABASE_URL="${DATABASE_URL:-postgresql://127.0.0.1:5432/_prisma_generate_placeholder?schema=public}"
# Use npm exec so the CLI always resolves from this workspace (avoids broken .bin symlinks after partial installs).
exec npm exec -- prisma generate --schema="${ROOT}/prisma/schema.prisma"
