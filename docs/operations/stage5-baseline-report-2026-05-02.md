# Kanak Setu Stage 5 Baseline Report

**Date:** 2026-05-02  
**VPS path:** `/opt/kanak-setu`  
**Gate script:** `scripts/prod/stage5-gate.sh`  
**Result:** PASS (`exit 0`)  

---

## Summary

Stage 5 execution has started. The Stage 5 baseline gate now passes on VPS after:

- fixing Stage 4 S4-6 hardcoded-path grep false-exit under `set -euo pipefail`
- aligning Stage 5 backup freshness logic with Stage 4 checks
- creating a fresh SQL backup artifact under `/opt/kanak-setu/backups`

This establishes a stable observability-first baseline before Track 2 feature work.

---

## Final gate run (VPS evidence)

- Timestamp: `2026-05-02T15:19:49Z`
- Command:

```bash
cd /opt/kanak-setu
set -a && source infra/prod/.env.production && set +a
APP_DIR=/opt/kanak-setu INTERNAL_API_BASE=http://127.0.0.1:4100/api/v1 bash scripts/prod/stage5-gate.sh
```

- Key outcomes:
  - Stage 4 baseline: **PASS**
  - S5-3 outbox health: **PASS**
  - S5-4 API health: **PASS**
  - S5-5 backup freshness: **PASS** (`/opt/kanak-setu/backups/2026-05-02-1519-kanak.sql.gz`)
  - S5-6 logging policy doc: **PASS**

---

## Non-blocking warnings (expected until Track 1 completion)

- `SENTRY_DSN_API` not configured yet
- `@logtail/pm2` not active yet

These are expected while Track 1A/1B is still being rolled out and do not block Stage 5 baseline PASS.

---

## Follow-up actions

1. Configure Sentry DSNs in `infra/prod/.env.production` and restart Kanak services.
2. Install and configure Logtail PM2 module (`@logtail/pm2`) on VPS.
3. Re-run `stage5-gate.sh` to clear remaining non-blocking warnings.
4. Continue Stage 5 Track 1A/1B/1C implementation before Track 2 feature expansion.

