# Smoke Tests

## Preconditions
- API and DB are running locally.
- Seed data exists with admin credentials.
- `curl` and `node` are available on shell path.

## Command Set
- Platform ops smoke:
  - `npm run smoke:local`
- Proof verification smoke:
  - `DONATION_ID=<donation_id> npm run smoke:proof`
- Proof + certificate verify:
  - `DONATION_ID=<donation_id> CERT_REF=<verification_ref> npm run smoke:proof`
- Full smoke gate + report:
  - `npm run smoke:all`
  - `DONATION_ID=<donation_id> CERT_REF=<verification_ref> npm run smoke:all`
- CI smoke bootstrap (DB + migrate + seed + API + smoke):
  - `npm run smoke:ci`

## What `smoke:local` Validates
- Admin login works.
- Admin dashboard endpoint is reachable with JWT.
- Manual reconciliation trigger works.
- Webhook deliveries list endpoint works.

## What `smoke:proof` Validates
- Donation proof fetch endpoint works.
- Proof verifies successfully via `/merkle/verify`.
- Optional certificate verification endpoint works.

## Failure Handling
- Re-run with `API_BASE=http://<host>:<port>/api/v1`.
- If auth fails, validate seed users and password.
- If proof fails, ensure donation has been batched/anchored before running.

## Machine-Readable Output
- `smoke:all` writes `smoke-report.json` by default.
- Override output path:
  - `SMOKE_OUTPUT=artifacts/smoke-report.json npm run smoke:all`

## CI Automation
- GitHub workflow: `.github/workflows/smoke-ci.yml`
- Triggers: push to `main`/`master` and all pull requests
- Artifact: uploads `smoke-report.json` on every run (including failures)
