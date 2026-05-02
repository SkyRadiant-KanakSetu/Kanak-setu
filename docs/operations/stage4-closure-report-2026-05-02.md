# Kanak Setu Stage 4 Closure Report

**Date:** 2026-05-02  
**Stabilization commit (VPS reference):** `a5919ec` — API listen order, Caddy `KANAK_API_PORT`, backup globs, gate alignment  
**Declaration docs:** Port **4100** defaults, smoke and gate defaults, closure documentation, and `vps-process-registry.md` land on `main` in the same release as this file — use `git log -1 --oneline` after `git pull` to record the exact SHA in your change ticket.  
**API port:** 4100  
**Gate script:** `scripts/prod/stage4-gate.sh`  
**Gate result:** PASS — WARN allowed on non-blocking checks per operations policy  
**Declared by:** Engineering

---

## Summary

Stage 4 is declared for Kanak Setu. The platform has an automated release pipeline, PostgreSQL outbox with a dedicated PM2 worker, atomic scheduler locks, optional Redis-backed rate limits, and production-oriented scripts that **default internal API traffic to `http://127.0.0.1:4100/api/v1`**, not port 4000 (reserved on shared VPS hosts for `sky-radiant-agent`). Caddy routes `api.kanaksetu.com` using `{$KANAK_API_PORT}` with no silent fallback to 4000. The API binds HTTP before Prisma connects so the listen port is reachable under database pressure.

**Run the gate on the VPS** (authoritative machine with PM2, PostgreSQL, logs):

```bash
cd /opt/kanak-setu
git pull
bash scripts/prod/run-stage4-gate-production.sh 2>&1 | tee /tmp/stage4-gate-result.txt
echo "Gate exit: $?"
```

Or set env explicitly:

```bash
cd /opt/kanak-setu
git pull
set -a && source infra/prod/.env.production && set +a
APP_DIR=/opt/kanak-setu \
INTERNAL_API_BASE=http://127.0.0.1:4100/api/v1 \
bash scripts/prod/stage4-gate.sh 2>&1 | tee /tmp/stage4-gate-result.txt
echo "Gate exit: $?"
```

Archive `/tmp/stage4-gate-result.txt` with change-management records. Resolve any **FAIL** lines; **WARN** on operator adoption, backup timing, branch-protection wording, or hardcoded-path grep noise is acceptable per policy.

---

## Environment at closure

| Variable | Value |
|----------|-------|
| `PORT` | 4100 (`infra/prod/.env.production` on VPS) |
| `REDIS_URL` | `redis://127.0.0.1:6379` |
| App dir | `/opt/kanak-setu` |
| API health | `http://127.0.0.1:4100/api/v1/health` |

---

## Gate results (final VPS run)

Final declaration run captured on VPS at **2026-05-02T14:20:57Z** using `scripts/prod/run-stage4-gate-production.sh` with transcript at `/tmp/stage4-gate-result.txt`.

| Gate | Check | Result |
|------|-------|--------|
| S3-1 | Telemetry log | PASS — 3 deploy entries |
| S3-2 | Last verify snapshot | PASS — `PASS` at `2026-05-02T14:18:22Z` |
| S3-3 | PM2 core services | PASS — all core apps online |
| S3-4 | Dependency audit (high/critical) | PASS — 0 in all apps |
| S3-5 | CI strict policy | PASS |
| S3-6 | Operator adoption | PASS — 1 operator action |
| S3-7 | Backup freshness | WARN — no recent backup in last 24h (non-blocking) |
| S4-1 | Release pipeline | PASS |
| S4-2 | Outbox worker | PASS |
| S4-3 | Outbox DB health | PASS — no stuck backlog / no undismissed dead letters |
| S4-4 | API health endpoint | PASS — `http://127.0.0.1:4100/api/v1/health` |
| S4-5 | Release targets `main` | PASS |
| S4-6 | Hardcoded path audit | WARN — 2 grep hits in API src (non-blocking in gate run) |

**Overall:** PASS (`exit code 0`).

Follow-up after declaration: S4-6 warning cleanup was committed on `main` in `c9cb69a` (removed `/opt` and localhost defaults in API runtime paths).

---

## What was delivered in Stage 4

| Area | Deliverable |
|------|-------------|
| Pipeline | GitHub Actions release + rollback with production approval |
| Pipeline | `main` as release target |
| Events | PostgreSQL outbox (`OutboxEvent`, `OutboxDeadLetter`) |
| Events | `kanak-outbox-worker` with `FOR UPDATE SKIP LOCKED` |
| Events | Admin dead-letter UX |
| Scale | `withSchedulerLock` for merkle / reconciliation crons |
| Scale | Redis-backed rate limiter when `REDIS_URL` is set |
| Stability | API listens before DB connect; DB connect timeout |
| Stability | Backup verify accepts `*.sql*` and `kanak-setu-*.tgz` |
| Ops | `INTERNAL_API_BASE` / discovery default to port **4100** in gates and smoke scripts |
| Ops | `ecosystem.config.cjs` default API port **4100** when `PORT` missing from file |
| Ops | Caddy sync scripts default **4100** when `PORT` missing from env file |

---

## Production state at closure (2026-05-02 session)

- API health: HTTP 200, Kanak JSON `success: true`, `data.status: ok`
- PM2: `kanak-api`, `kanak-donor-web`, `kanak-institution-web`, `kanak-admin-web`, `kanak-outbox-worker` — online
- Telemetry: **HEALTHY** after verify; `logs/last-verify.json` written
- Example backup artifact: `backups/kanak-setu-2026-05-02-1356.tgz` (config snapshot); database dumps use `scripts/prod/backup.sh` → `*.sql.gz`
- Redis: `redis://127.0.0.1:6379`

---

## Open items entering Stage 5

| Item | Severity | Owner | Due |
|------|----------|-------|-----|
| postcss GHSA-qx2v-qp2m-jg93 | Low | Engineering | 2026-05-15 |
| Operator adoption (S3-6) | Low | Ops | Monitor |
| `sky-radiant-agro-api` on PM2 | Low | Platform | Fix with owner or `pm2 delete` if abandoned — see `vps-process-registry.md` |
| Log aggregation | Medium | Stage 5 | TBD |

---

## Stage 5 conditions

Stage 5 execution starts after agreed kickoff:

- Observation window on Stage 4 production
- postcss advisory review by 2026-05-15
- Operator adoption trending upward (targets TBD with product)

Focus: observability (centralized logs, alerting), donor and institution growth, multi-VPS only when warranted.

---

## References

- `docs/operations/stage-status.md`
- `docs/operations/vps-production-validation-report-2026-05-02.md`
- `docs/operations/vps-process-registry.md`

*Kanak Setu — Stage 4 closure*
