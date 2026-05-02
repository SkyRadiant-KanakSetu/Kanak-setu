#!/usr/bin/env bash
# Run Stage 4 readiness gate on the production VPS with the correct internal API base.
# Default INTERNAL_API_BASE is http://127.0.0.1:4100/api/v1 (override if needed).
#
#   cd /opt/kanak-setu
#   bash scripts/prod/run-stage4-gate-production.sh
#   bash scripts/prod/run-stage4-gate-production.sh 2>&1 | tee /tmp/stage4-gate-result.txt
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
ENV_FILE="${APP_DIR}/infra/prod/.env.production"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "ERROR: APP_DIR does not exist: ${APP_DIR}"
  exit 1
fi
if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

export APP_DIR
export INTERNAL_API_BASE="${INTERNAL_API_BASE:-http://127.0.0.1:4100/api/v1}"

exec bash "${APP_DIR}/scripts/prod/stage4-gate.sh"
