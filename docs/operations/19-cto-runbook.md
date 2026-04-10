# CTO Runbook — Kanak Setu

Short operational authority doc: backups, deploys, rollback, and schema changes.

## Deploy (production VPS)

- Source of truth: Git `main` (or your release branch).
- Command: `APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-vps.sh`
- First-time or full stack: `scripts/prod/vps-one-shot.sh` (see `docs/deployment/18-kanaksetu-domain-go-live.md`).

Deploy script behavior:

- If `prisma/migrations/*/migration.sql` exists → **`prisma migrate deploy`** (preferred).
- Otherwise → **`prisma db push`** (bootstrap / legacy only).

## Database backup (daily minimum)

On the VPS, with `DATABASE_URL` or explicit connection:

```bash
export PGPASSWORD='...'
pg_dump -h localhost -U kanak -d kanak_setu -Fc -f "/root/backups/kanak_setu_$(date -u +%Y%m%d_%H%M).dump"
```

Store dumps off-server (S3, second region, or encrypted object storage). **Test restore** to a scratch DB quarterly.

Restore example:

```bash
pg_restore -h localhost -U kanak -d kanak_setu_restore --clean --if-exists /path/to/dump.dump
```

## Rollback (application)

1. Check out previous known-good commit on the server: `git fetch && git checkout <sha>`.
2. Run `APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-vps.sh` **or** manually `npm ci && npm run build && pm2 startOrReload ecosystem.config.cjs`.
3. If the bad deploy ran migrations, **do not** blindly revert Git without a DB plan — restore DB from backup or forward-fix with a new migration.

## Rollback (database)

- **Forward-fix preferred:** add a new Prisma migration that corrects schema/data.
- **Point-in-time:** restore from `pg_dump` / provider snapshot; expect brief downtime; invalidate sessions if needed.

## Brownfield: DB was created with `db push`, then repo gained migrations

If production already has tables from `db push` and the baseline migration matches that schema:

```bash
cd /opt/kanak-setu
set -a && source infra/prod/.env.production && set +a
npx prisma migrate resolve --applied 20260411000000_baseline --schema=prisma/schema.prisma
```

Then future deploys use `migrate deploy` only. If drift exists, diff the DB against `schema.prisma` and fix before resolving.

## Secrets and GitHub

- Never commit `infra/prod/.env.production`.
- PAT used for `git push` must include **`workflow`** scope if the repo contains `.github/workflows/*`.

## Release checklist (minimal)

- [ ] Smoke: `npm run smoke:local` against production API (or post-deploy hook).
- [ ] HTTPS endpoints respond for donor / institution / admin / API.
- [ ] Backup job ran in last 24h (or run manual dump after major change).

## Escalation

- Payment or webhook anomalies: `docs/operations/14-reconciliation-guide.md` and `docs/operations/13-incident-response-guide.md`.
- Full go-live: `docs/deployment/16-production-go-live-checklist.md`.
