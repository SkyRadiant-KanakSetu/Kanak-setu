#!/usr/bin/env bash
# shellcheck shell=bash
# Resolve Prisma CLI v5 from the monorepo — never bare `npx prisma` (can fetch Prisma 7+ and break schema).
# Expects cwd = repo root (APP_DIR). Usage: source .../inc-prisma-cli.sh && kanak_prisma migrate status ...

kanak_prisma() {
  local root="${KANAK_REPO_ROOT:-${APP_DIR:-.}}"
  local cli="${root}/node_modules/prisma/build/index.js"
  if [[ -f "${cli}" ]]; then
    (cd "${root}" && node "${cli}" "$@")
    return $?
  fi
  cli="${root}/apps/api/node_modules/prisma/build/index.js"
  if [[ -f "${cli}" ]]; then
    (cd "${root}" && node "${cli}" "$@")
    return $?
  fi
  echo "kanak_prisma: prisma CLI not found under ${root}/node_modules — run npm ci" >&2
  return 127
}
