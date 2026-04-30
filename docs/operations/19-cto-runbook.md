# CTO Runbook — Kanak Setu

Short operational authority doc: backups, deploys, rollback, and schema changes.

## Deploy (production VPS)

- Source of truth: Git `main` (or your release branch).
- Primary command (recommended): `APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-safe.sh`
- Legacy command (manual source update): `APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-vps.sh`
- First-time or full stack: `scripts/prod/vps-one-shot.sh` (see `docs/deployment/18-kanaksetu-domain-go-live.md`).
- **GitHub Actions (optional):** workflow `.github/workflows/deploy-vps.yml` runs on **workflow_dispatch** after you add secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (see comments in that file). This is the only way to “push to deploy” without logging into the server each time.

Deploy behavior:

- If `prisma/migrations/*/migration.sql` exists → **`prisma migrate deploy`** (preferred).
- Otherwise → **`prisma db push`** (bootstrap / legacy only).
- `deploy-safe.sh` always runs: `git fetch` → `git reset --hard origin/<branch>` → deploy → verify.
- `deploy-safe.sh` also cleans tracked `packages/*/tsconfig.tsbuildinfo` artifacts after build.

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

## Git on the VPS (HTTPS vs SSH)

- If `git remote -v` shows **`https://github.com/...`**, Git will prompt for credentials on every `git pull` unless you cache a **Personal Access Token** (`git config --global credential.helper store`) or use **`gh auth login`**.
- **Recommended:** `git remote set-url origin git@github.com:SkyRadiant-KanakSetu/Kanak-setu.git` and use an SSH key whose public half is in GitHub (user key or **read-only deploy key** on the repo). Then `git pull` needs no password.

## Production `logo.png` (donor / institution / admin)

- Source of truth should be **this repo** under `apps/*/public/logo.png` so deploys never revert a hand-copied asset.
- If the large logo exists only on the server, pull it into your laptop repo (run **on your Mac**, not over SSH on the VPS):

  `PROD_SSH=root@YOUR_VPS_IP bash scripts/dev/pull-prod-logo-from-vps.sh`

  Then commit and push the three files.

## Secrets and GitHub

- Never commit `infra/prod/.env.production`.
- PAT used for `git push` must include **`workflow`** scope if the repo contains `.github/workflows/*`.

## Dependency security posture

- Run production-only audit from repo root: `npm run audit:prod`.
- Policy: fail deployment pipelines on **critical** vulnerabilities; track and plan remediation for highs that require major-framework upgrades.
- Current known high is tied to `next@14.2.35`; address in a planned Next major upgrade window with regression testing across donor, institution, and admin apps.

## Release checklist (minimal)

- [ ] Smoke: `npm run smoke:local` against production API (or post-deploy hook).
- [ ] HTTPS endpoints respond for donor / institution / admin / API.
- [ ] Backup job ran in last 24h (or run manual dump after major change).

## Escalation

- Payment or webhook anomalies: `docs/operations/14-reconciliation-guide.md` and `docs/operations/13-incident-response-guide.md`.
- Full go-live: `docs/deployment/16-production-go-live-checklist.md`.
