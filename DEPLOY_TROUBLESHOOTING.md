# Kanak Setu Deploy Troubleshooting

This runbook is for production deploy and post-deploy recovery on VPS.

## 0) Server setup

```bash
ssh root@91.108.110.104
cd /opt/kanak-setu
```

## 1) Fast preflight checks

```bash
cd /opt/kanak-setu
git status --short
git rev-parse --short HEAD
pm2 status
curl -sS https://api.kanaksetu.com/api/v1/health
```

Expected:
- Repo has no unexpected local edits (except transient build artifacts).
- PM2 apps are `online`.
- Health endpoint returns `{"success":true,...}`.

## 2) Standard deploy

```bash
cd /opt/kanak-setu
git pull origin main
bash scripts/prod/deploy-vps.sh
```

If this passes, verify health:

```bash
curl -sS https://api.kanaksetu.com/api/v1/health
pm2 status
```

## 3) Critical recovery: Prisma schema mismatch (P2022)

Use this when logs show errors like:
- `The column InstitutionProfile.faithTradition does not exist`
- `PrismaClientKnownRequestError` with code `P2022`

### Step A: Load env and sync schema

```bash
cd /opt/kanak-setu
set -a
source infra/prod/.env.production
set +a

echo "$DATABASE_URL" | sed 's/:\/\/.*@/:\/\/***:***@/'

npx prisma db push --schema=prisma/schema.prisma
npm run db:generate
```

If `db push` fails with `DATABASE_URL` missing, env was not loaded in the same shell.

### Step B: Restart services with refreshed env

```bash
pm2 restart kanak-api kanak-institution-web --update-env
```

### Step C: Verify columns exist

```bash
PAGER=cat psql "$DATABASE_URL" -c 'SELECT column_name FROM information_schema.columns WHERE table_name = '\''InstitutionProfile'\'' AND column_name IN ('\''faithTradition'\'','\''terminologyDonationLabel'\'','\''terminologyDonorLabel'\'','\''sacredCalendarHighlights'\'') ORDER BY column_name;'
```

Expected: 4 rows returned.

## 4) Read clean logs (no stale noise)

```bash
pm2 flush
pm2 restart kanak-api kanak-institution-web --update-env
pm2 logs kanak-api --lines 120
```

Notes:
- `401` on protected endpoints without token is expected.
- `500` with Prisma errors is not expected.

## 5) Quick endpoint smoke checks

No token checks (should be unauthorized, not 500/502):

```bash
curl -i https://api.kanaksetu.com/api/v1/institutions/portal/settings-faith
curl -i https://api.kanaksetu.com/api/v1/institutions/portal/functions
curl -i https://api.kanaksetu.com/api/v1/institutions/portal/tasks
```

Expected: HTTP `401` JSON error for missing/invalid token.

Base API health:

```bash
curl -i https://api.kanaksetu.com/api/v1/health
```

Expected: HTTP `200`.

## 6) UI smoke checklist (manual)

- `admin.kanaksetu.com`
  - Login works.
  - Dashboard loads.
  - Donations table opens.
- `institution.kanaksetu.com`
  - Login works.
  - Dashboard loads without server error banner.
  - `Functions`, `Tasks`, `Settings (Faith)` tabs load.
- `donor.kanaksetu.com`
  - OTP flow works.
  - Institutions list loads.
  - Donate flow reaches confirmation.

## 7) Common symptoms and fixes

- **Symptom:** API health is OK but institution screens show server error.
  - **Likely cause:** Schema drift between Prisma client and DB.
  - **Fix:** Run Section 3.

- **Symptom:** `npx prisma db push` says `DATABASE_URL` missing.
  - **Likely cause:** Production env not sourced in current shell.
  - **Fix:** Re-run `set -a; source infra/prod/.env.production; set +a` and retry.

- **Symptom:** Caddy returns `502`.
  - **Likely cause:** Upstream process restarting/crashing.
  - **Fix:** Check `pm2 status`, then `pm2 logs kanak-api --lines 150`.

## 8) Optional one-time tooling improvement

Install ripgrep on VPS for faster searching in logs/files:

```bash
apt update && apt install -y ripgrep
```
