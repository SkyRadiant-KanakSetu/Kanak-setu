#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Kanak Setu dev check =="
command -v node >/dev/null && node -v
command -v npm >/dev/null && npm -v
command -v docker >/dev/null && docker --version || echo "(docker not required for compile-only)"

echo ""
echo "== Install (if needed) =="
if [[ ! -d node_modules ]]; then
  npm install
fi

echo ""
echo "== Format check =="
npm run format:check

echo ""
echo "== Lint (root + workspaces) =="
npm run lint

echo ""
echo "== Prisma generate =="
npm run db:generate

echo ""
echo "OK: dev check passed."
