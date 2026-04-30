#!/usr/bin/env bash
# Post-deploy verification for production VPS (or any machine with repo + env).
#
#   cd /opt/kanak-setu
#   bash scripts/prod/post-deploy-verify.sh
#
# Optional:
#   PUBLIC_API_BASE=https://api.kanaksetu.com/api/v1 bash scripts/prod/post-deploy-verify.sh
#   RUN_SMOKE=1 bash scripts/prod/post-deploy-verify.sh   # runs npm run smoke:local against localhost API
#   VERIFY_LOGOS=0 …   # skip /logo.png checks on the three public web origins
#   DONOR_ORIGIN=… INSTITUTION_ORIGIN=… ADMIN_ORIGIN=…  # override default kanaksetu.com hosts
#
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
PUBLIC_API_BASE="${PUBLIC_API_BASE:-https://api.kanaksetu.com/api/v1}"
LOCAL_API_BASE="${LOCAL_API_BASE:-http://127.0.0.1:4000/api/v1}"

echo "[verify] app dir: ${APP_DIR}"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "[verify] ERROR: ${APP_DIR} does not exist"
  exit 1
fi

cd "${APP_DIR}"

echo "[verify] git HEAD"
git rev-parse --short HEAD
git status --short || true

ENV_FILE="${APP_DIR}/infra/prod/.env.production"
if [[ -f "${ENV_FILE}" ]]; then
  echo "[verify] prisma migrate status (from ${ENV_FILE})"
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
  if [[ -n "${DATABASE_URL:-}" ]]; then
    npx prisma migrate status --schema=prisma/schema.prisma || true
  else
    echo "[verify] WARN: DATABASE_URL not set after sourcing env; skipping migrate status"
  fi
else
  echo "[verify] WARN: ${ENV_FILE} missing; skipping prisma migrate status"
fi

echo "[verify] pm2 (kanak apps)"
if command -v pm2 >/dev/null 2>&1; then
  pm2 jlist | node -e '
    const apps = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const want = ["kanak-api","kanak-donor-web","kanak-institution-web","kanak-admin-web"];
    for (const name of want) {
      const p = apps.find((a) => a.name === name);
      if (!p) { console.log(name + ": MISSING"); continue; }
      const st = p.pm2_env?.status || "?";
      console.log(name + ": " + st + (st !== "online" ? "  <-- check this" : ""));
    }
  ' 2>/dev/null || pm2 status
else
  echo "[verify] WARN: pm2 not in PATH"
fi

echo "[verify] API health (local)"
if curl -fsS "${LOCAL_API_BASE}/health" | head -c 200; then
  echo ""
else
  echo "[verify] FAIL: local health check"
  exit 1
fi

echo "[verify] API health (public)"
if curl -fsS "${PUBLIC_API_BASE}/health" | head -c 200; then
  echo ""
else
  echo "[verify] FAIL: public health check"
  exit 1
fi

echo "[verify] protected routes (expect 401 without token, not 5xx)"
for path in institutions/portal/functions institutions/portal/settings-faith; do
  code="$(curl -sS -o /dev/null -w "%{http_code}" "${PUBLIC_API_BASE}/${path}")"
  echo "  GET /${path} -> HTTP ${code}"
  if [[ "${code}" =~ ^5 ]]; then
    echo "[verify] FAIL: upstream error on ${path}"
    exit 1
  fi
done

if [[ "${VERIFY_LOGOS:-1}" == "1" ]]; then
  echo "[verify] public /logo.png (200 + image/png)"
  DONOR_ORIGIN="${DONOR_ORIGIN:-https://kanaksetu.com}"
  INSTITUTION_ORIGIN="${INSTITUTION_ORIGIN:-https://institution.kanaksetu.com}"
  ADMIN_ORIGIN="${ADMIN_ORIGIN:-https://admin.kanaksetu.com}"
  for origin in "${DONOR_ORIGIN}" "${INSTITUTION_ORIGIN}" "${ADMIN_ORIGIN}"; do
    url="${origin}/logo.png"
    code="$(curl -sS -o /dev/null -w "%{http_code}" "${url}")"
    ct="$(curl -sSI "${url}" | tr -d '\r' | grep -i '^content-type:' | head -1 || true)"
    echo "  ${url} -> HTTP ${code} ${ct}"
    if [[ "${code}" != "200" ]]; then
      echo "[verify] FAIL: expected HTTP 200 for ${url}"
      exit 1
    fi
    if ! echo "${ct}" | grep -qi 'image/png'; then
      echo "[verify] FAIL: expected Content-Type image/png for ${url}"
      exit 1
    fi
  done
fi

if [[ "${RUN_SMOKE:-0}" == "1" ]]; then
  echo "[verify] npm run smoke:local (API_BASE=${LOCAL_API_BASE})"
  API_BASE="${LOCAL_API_BASE}" npm run smoke:local
fi

echo "[verify] DONE"
