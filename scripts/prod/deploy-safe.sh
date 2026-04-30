#!/usr/bin/env bash
#
# Safe production deploy wrapper.
# - Enforces "server follows origin/main exactly"
# - Runs deploy + verification
# - Cleans tracked tsbuildinfo artifacts left by builds
#
# Usage:
#   APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-safe.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
BRANCH="${BRANCH:-main}"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "[safe] ERROR: ${APP_DIR} does not exist"
  exit 1
fi

cd "${APP_DIR}"

echo "[safe] fetch + hard reset to origin/${BRANCH}"
git fetch origin
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"
git clean -fd

echo "[safe] deploy"
APP_DIR="${APP_DIR}" BRANCH="${BRANCH}" bash scripts/prod/deploy-vps.sh

echo "[safe] clean tracked tsbuildinfo artifacts"
git checkout -- packages/*/tsconfig.tsbuildinfo 2>/dev/null || true

echo "[safe] verify"
APP_DIR="${APP_DIR}" bash scripts/prod/post-deploy-verify.sh

echo "[safe] DONE"
