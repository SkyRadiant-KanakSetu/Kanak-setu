# Kanak Setu — Production VPS validation report (Claude handoff)

**Date:** 2026-05-02 (Asia/Kolkata context: same calendar day)  
**Purpose:** Single document for operators and AI assistants continuing work on Kanak Setu production.  
**Validated repo on VPS:** `main` @ **`a5919ec`** (`fix(prod): API listen order, Caddy port, backup/gate checks`)

---

## Executive summary

Production Kanak Setu on the VPS at `/opt/kanak-setu` was stabilized after port/env drift and reverse-proxy misrouting. The API now binds **before** a blocking DB connect, Caddy requires an explicit **`KANAK_API_PORT`**, Redis points at the host default port, post-deploy verification accepts both **SQL backups** and **`kanak-setu-*.tgz`** config snapshots, and **`logs/last-verify.json`** is written on every successful verify run.

**Latest operator outcome (reference):** `bash scripts/prod/run-stage4-gate-production.sh` → **Stage 4 gate PASS (exit 0)** on 2026-05-02, with non-blocking WARNs for backup freshness and hardcoded-path audit; operator adoption passed with 1 action.

---

## Environment (must match)

From `infra/prod/.env.production` (grep sanity check):

| Variable | Expected on this VPS |
|----------|----------------------|
| `PORT` | `4100` |
| `REDIS_URL` | `redis://127.0.0.1:6379` |

**Why:** Another stack uses port **4000** (`sky-radiant-agent`). Kanak API must not share that port. Wrong `REDIS_URL` (e.g. 6380) breaks rate limiting / Redis-backed behavior.

---

## Repository changes that matter on the server

| Area | Change |
|------|--------|
| `apps/api/src/server.ts` | HTTP **listen first**, then `prisma.$connect()` with timeout so the process still binds if DB connect is slow. |
| `infra/prod/Caddyfile` | **No silent default** to `:4000` for `api.kanaksetu.com`; upstream uses `{$KANAK_API_PORT}`. |
| `scripts/prod/sync-caddy-kanak-api-port.sh` | Writes systemd drop-in for `KANAK_API_PORT`, restarts Caddy, sanity-checks env. |
| `scripts/prod/post-deploy-verify.sh` | Hints when public `/health` returns HTML; backup find includes `*.sql*` **or** `kanak-setu-*.tgz`. |
| `scripts/prod/stage3-gate.sh` / `stage4-gate.sh` | Same backup glob as verify. |
| `scripts/prod/inc-local-api-base.sh` | Safer local API base discovery for verify. |

After `git pull`, always prefer **recreating** `kanak-api` from the ecosystem file if env/port drift is suspected:

```bash
cd /opt/kanak-setu
pm2 delete kanak-api
APP_DIR=/opt/kanak-setu pm2 start ecosystem.config.cjs --only kanak-api
pm2 save
```

---

## Verification commands

```bash
cd /opt/kanak-setu
git pull
grep -E '^(PORT|REDIS_URL)=' infra/prod/.env.production
curl -sS http://127.0.0.1:4100/api/v1/health
APP_DIR=/opt/kanak-setu bash scripts/prod/post-deploy-verify.sh
ls -l logs/last-verify.json
```

Optional full Stage 4 declaration gate (needs env + optional internal secret):

```bash
cd /opt/kanak-setu
bash scripts/prod/run-stage4-gate-production.sh 2>&1 | tee /tmp/stage4-gate-result.txt
```

Equivalent manual invocation:

```bash
cd /opt/kanak-setu
set -a && source infra/prod/.env.production && set +a
APP_DIR=/opt/kanak-setu INTERNAL_API_BASE=http://127.0.0.1:4100/api/v1 \
  bash scripts/prod/stage4-gate.sh
```

---

## Backups

- **Database dumps:** `scripts/prod/backup.sh` → `backups/<timestamp>-kanak.sql.gz` (matches `*.sql*`).
- **Config snapshot (manual):** `tar -czf "backups/kanak-setu-$(date +%F-%H%M).tgz" …` → matches `kanak-setu-*.tgz` for verify.

If verify shows backup **WARN**, create one of the above and re-run verify.

### Daily backup cron (recommended)

`backup.sh` loads `DATABASE_URL` from `infra/prod/.env.production` when the variable is unset, so cron only needs `APP_DIR`:

```bash
sudo crontab -e
```

Add (example: 03:15 UTC daily; adjust timezone as needed):

```cron
15 3 * * * APP_DIR=/opt/kanak-setu /bin/bash /opt/kanak-setu/scripts/prod/backup.sh >> /opt/kanak-setu/logs/backup-cron.log 2>&1
```

Ensure `pg_dump` is on `PATH` for the cron user (often install `postgresql-client` or use full path to `pg_dump` in `backup.sh` if needed).

---

## PM2 notes

- Kanak processes: `kanak-api`, `kanak-donor-web`, `kanak-institution-web`, `kanak-admin-web`, `kanak-outbox-worker` — expect **online**.
- Historical restart counters can be reset per process: `pm2 reset <name> && pm2 save` (telemetry will reflect lower counts).
- **`sky-radiant-agro-api`** may show **errored** — separate product; does not gate Kanak verify unless you explicitly care about that stack.

---

## VPS working tree (do not commit from server)

Expect dirty or generated paths: `packages/*/tsconfig.tsbuildinfo`, `logs/`, `backups/`. **Do not commit from the VPS**; ship changes from a developer machine.

---

## Open items (non-blocking for Kanak core)

| Item | Notes |
|------|--------|
| postcss advisory (GHSA-qx2v-qp2m-jg93) | Tracked in ops docs; review by 2026-05-15 |
| Operator adoption | Internal/operator activity may still warn in gates |
| `sky-radiant-agro-api` | Fix or remove from PM2 if unused |

---

## Reference links (repo)

- Stage status: `docs/operations/stage-status.md`  
- Stage 4 closure report: `docs/operations/stage4-closure-report-2026-05-02.md`  
- VPS PM2 registry: `docs/operations/vps-process-registry.md`  
- Post-deploy verify: `scripts/prod/post-deploy-verify.sh`  
- DB backup cron script: `scripts/prod/backup.sh`

---

*End of report — paste or attach this file when onboarding Claude or another operator.*
