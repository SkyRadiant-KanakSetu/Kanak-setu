#!/usr/bin/env bash
#
# Fast production deploy wrapper.
# - Enforces server follows origin/<branch>
# - Skips npm ci only when package-lock.json hash is unchanged and node_modules exists
# - Runs deploy + verification
#
# Usage:
#   APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-fast.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
BRANCH="${BRANCH:-main}"
STATE_DIR="${STATE_DIR:-${APP_DIR}/.deploy-state}"
LOCK_HASH_FILE="${STATE_DIR}/package-lock.sha256"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "[fast] ERROR: ${APP_DIR} does not exist"
  exit 1
fi

cd "${APP_DIR}"

echo "[fast] fetch + hard reset to origin/${BRANCH}"
git fetch origin
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"
git clean -fd

if [[ ! -f "package-lock.json" ]]; then
  echo "[fast] ERROR: package-lock.json missing"
  exit 1
fi

current_lock_hash="$(shasum -a 256 package-lock.json | awk '{print $1}')"
previous_lock_hash=""
if [[ -f "${LOCK_HASH_FILE}" ]]; then
  previous_lock_hash="$(awk 'NR==1{print $1}' "${LOCK_HASH_FILE}")"
fi

skip_npm_ci=0
if [[ -d "node_modules" ]] && [[ -n "${previous_lock_hash}" ]] && [[ "${previous_lock_hash}" == "${current_lock_hash}" ]]; then
  skip_npm_ci=1
fi

if [[ "${skip_npm_ci}" == "1" ]]; then
  echo "[fast] lockfile unchanged + node_modules present → SKIP_NPM_CI=1"
else
  echo "[fast] lockfile changed/missing baseline or node_modules absent → npm ci required"
fi

echo "[fast] deploy"
SKIP_NPM_CI="${skip_npm_ci}" APP_DIR="${APP_DIR}" BRANCH="${BRANCH}" bash scripts/prod/deploy-vps.sh

mkdir -p "${STATE_DIR}"
printf '%s\n' "${current_lock_hash}" > "${LOCK_HASH_FILE}"

echo "[fast] clean tracked tsbuildinfo artifacts"
git checkout -- packages/*/tsconfig.tsbuildinfo 2>/dev/null || true

echo "[fast] verify"
APP_DIR="${APP_DIR}" bash scripts/prod/post-deploy-verify.sh

echo "[fast] DONE"
