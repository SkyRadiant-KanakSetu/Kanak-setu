# Environment Setup Guide

## Prerequisites
- Node.js 18+
- npm 9+
- Docker + Docker Compose

## Local Setup
1. Install dependencies:
   - `npm install`
2. Start infra:
   - `npm run docker:up`
3. Prepare env:
   - `cp infra/.env.example infra/.env`
4. Apply migrations:
   - `npx prisma migrate dev --schema=prisma/schema.prisma`
5. Seed data:
   - `npx ts-node prisma/seed.ts`

## Core Env Variables
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `CORS_ORIGINS`
- `PAYMENT_PROVIDER`
- `GOLD_VENDOR`
- `MERKLE_BATCH_CRON`
- `RECONCILIATION_CRON`
- `CHAIN_RPC_URL`
- `ANCHOR_PRIVATE_KEY`
- `ANCHOR_CONTRACT_ADDRESS`

## Run Services
- API: `npm run dev:api`
- Donor web: `npm run dev:donor`
- Institution web: `npm run dev:institution`
- Admin web: `npm run dev:admin`

## Troubleshooting
- Prisma env issue: export `DATABASE_URL` inline in command.
- Webhook signature mismatch: ensure raw body route is configured for provider route.
- Chain anchor fail: verify RPC, key, and contract env vars.
