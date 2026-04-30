#!/usr/bin/env bash
# Copy production logo.png from the VPS into this repo (all three Next apps).
# Run on your Mac or dev machine — NOT on the server. Requires SSH access.
#
#   PROD_SSH=root@91.108.110.104 bash scripts/dev/pull-prod-logo-from-vps.sh
#   bash scripts/dev/pull-prod-logo-from-vps.sh root@91.108.110.104
#
set -euo pipefail

SSH_TARGET="${1:-${PROD_SSH:-${VPS_SSH:-}}}"

if [[ -z "${SSH_TARGET}" ]]; then
  echo "Usage: PROD_SSH=root@YOUR_VPS_IP bash scripts/dev/pull-prod-logo-from-vps.sh"
  echo "   or: bash scripts/dev/pull-prod-logo-from-vps.sh root@YOUR_VPS_IP"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REMOTE_PATH="/opt/kanak-setu/apps/donor-web/public/logo.png"
TMP="$(mktemp)"
trap 'rm -f "${TMP}"' EXIT

echo "[pull-logo] scp ${SSH_TARGET}:${REMOTE_PATH} → workspace"
scp "${SSH_TARGET}:${REMOTE_PATH}" "${TMP}"

for app in admin-web donor-web institution-web; do
  mkdir -p "${REPO_ROOT}/apps/${app}/public"
  cp "${TMP}" "${REPO_ROOT}/apps/${app}/public/logo.png"
done

ls -la "${REPO_ROOT}/apps/donor-web/public/logo.png"
echo "[pull-logo] OK — review and commit:"
echo "  git add apps/admin-web/public/logo.png apps/donor-web/public/logo.png apps/institution-web/public/logo.png"
echo "  git commit -m \"chore: sync production logo from VPS\""
echo "  git push origin main"
