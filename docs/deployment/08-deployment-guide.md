# Deployment Guide

## Target Topology
- API service (containerized Node.js app)
- PostgreSQL (managed preferred)
- Redis (optional for future queues/cache)
- Frontend apps as static/serverless deployments
- Anchor job runner using same API image with scheduler enabled

## Build and Release
1. Install and test:
   - `npm ci`
   - `npm run lint`
   - `npm run typecheck`
2. Build apps:
   - `npm run build`
3. Run DB migration in deploy stage:
   - `npx prisma migrate deploy --schema=prisma/schema.prisma`

## Runtime Requirements
- Set production env vars from `docs/deployment/15-environment-setup-guide.md`.
- Ensure network access to payment provider webhooks and chain RPC.
- Enable TLS and reverse proxy request size limits for webhook payloads.

## Post-Deploy Checks
- Health endpoint returns success.
- Admin login works.
- Test donation runs end-to-end in sandbox mode.
- Reconciliation cron and Merkle cron show successful logs.
