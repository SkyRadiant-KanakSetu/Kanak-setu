#!/usr/bin/env bash
# shellcheck shell=bash
# Resolve Prisma CLI v5 from the monorepo — never bare `npx prisma` (can fetch Prisma 7+ and break schema).
# Expects cwd = repo root (APP_DIR). Usage: source .../inc-prisma-cli.sh && kanak_prisma migrate status ...

kanak_prisma() {
  local root="${KANAK_REPO_ROOT:-${APP_DIR:-.}}"
  if [[ -x "${root}/node_modules/.bin/prisma" ]]; then
    "${root}/node_modules/.bin/prisma" "$@"
    return $?
  fi
  if [[ -x "${root}/apps/api/node_modules/.bin/prisma" ]]; then
    "${root}/apps/api/node_modules/.bin/prisma" "$@"
    return $?
  fi
  (cd "${root}" && npm exec -w @kanak-setu/api -- prisma "$@")
}
