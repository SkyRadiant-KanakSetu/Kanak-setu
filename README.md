# 🪙 Kanak Setu — India's Digital Gold Donation Highway

> Donate verified digital gold directly to temples and institutions. Every donation is blockchain-anchored for transparency.

## Architecture

```
┌──────────────┐  ┌──────────────────┐  ┌──────────────┐
│  donor-web   │  │ institution-web  │  │  admin-web   │
│  :3000       │  │  :3001           │  │  :3002       │
└──────┬───────┘  └────────┬─────────┘  └──────┬───────┘
       └──────────────────┼────────────────────┘
                          ▼
              ┌───────────────────────┐
              │   API Server :4100   │
              │  Express + Prisma     │
              └───────┬───────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      PostgreSQL    Payment    Gold Vendor
        :5432      Gateway      (Mock)
                   (Mock)
                                  │
                          Polygon Amoy
                          (Merkle anchoring)
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm 9+

### 1. Clone & Install

```bash
cd kanak-setu
npm install
```

### 2. Start Database

```bash
npm run docker:up
```

### 3. Configure Environment

```bash
cp infra/.env.example infra/.env
# Edit infra/.env if needed (defaults work for local dev)
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --schema=prisma/schema.prisma --name init
```

### 5. Seed Database

```bash
npm run db:seed
```

### 6. Start API Server

```bash
npm run dev:api
```

### 7. Start Frontend Apps (separate terminals)

```bash
npm run dev:donor        # http://localhost:3000
npm run dev:institution  # http://localhost:3001
npm run dev:admin        # http://localhost:3002
```

### 8. Start Mobile App (Expo)

```bash
# In a new terminal
npm run dev:mobile
```

Set mobile API base before starting Expo (device cannot use your laptop localhost):

```bash
export EXPO_PUBLIC_API_BASE_URL=http://<your-lan-ip>:4100/api/v1
# Example: http://192.168.1.20:4100/api/v1
```

### 9. Publish Mobile App (Live)

```bash
cd apps/mobile
npx expo login
npx eas login

# One-time project setup and cloud build
EXPO_PUBLIC_API_BASE_URL=https://api.kanaksetu.com/api/v1 npm run build:android
EXPO_PUBLIC_API_BASE_URL=https://api.kanaksetu.com/api/v1 npm run build:ios
```

After build completes, submit stores:

```bash
npm run submit:android
npm run submit:ios
```

## Test Accounts

After `npm run db:seed` (non-production defaults), seeded users share `SEED_PASSWORD` (defaults to `password123` in dev).

| Role        | Auth method        | Identifier / notes |
| ----------- | ------------------ | -------------------- |
| Super Admin | Email + password   | `admin@kanaksetu.in` |
| Donor       | **Phone OTP only** | Donor app uses `/auth/login/phone/*` and `/auth/signup/phone/*`. Email login is disabled for donors. Seeded donor `donor@example.com` exists for API/testing only if you create a session via admin or OTP-linked phone. |
| Institution | Email + password   | `temple@example.com` |
| Auditor     | Email + password   | `auditor@kanaksetu.in` |

## Project Structure

```
kanak-setu/
├── apps/
│   ├── api/                 Express modular monolith (REST API)
│   ├── donor-web/           Next.js donor app (:3000)
│   ├── institution-web/     Next.js institution portal (:3001)
│   └── admin-web/           Next.js admin panel (:3002)
├── packages/
│   ├── shared-types/        Cross-cutting enums and DTO types
│   ├── validators/          Zod schemas (pagination, money, etc.)
│   ├── config/              Typed environment parsing
│   ├── sdk/                 Typed API client wrapper
│   ├── ui/                  Shared React primitives (KsButton, KsCard, …)
│   └── blockchain/          Merkle leaf canonicalization + hash helpers
├── prisma/                  Schema, migrations, seed
├── contracts/               Solidity + Hardhat (Polygon Amoy MVP)
├── infra/                   Docker Compose + `.env.example`
├── scripts/                 Dev and ops helper scripts
└── docs/                    Architecture and runbooks (growing)
```

## Key Flows

### Donation Flow

1. Donor selects institution → enters amount
2. Payment order created → donor pays (mock for MVP)
3. Gold vendor allocates digital gold
4. Institution gold ledger credited
5. Donation queued for Merkle batch
6. Batch sealed → leaves hashed with **`DonationLeafV1` (keccak)** from `@kanak-setu/blockchain`, sorted-pair keccak Merkle tree → root anchored on Polygon Amoy
7. Proof certificate generated

### Admin Operations

- Review & approve institutions
- Monitor all donations
- Retry failed vendor allocations
- Seal & anchor Merkle batches
- Browse full audit log

## Smart Contract

Deploy to Polygon Amoy:

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network amoy
```

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Blockchain:** Solidity, Hardhat, Polygon (Merkle proof anchoring)
- **Auth:** JWT with refresh token rotation
- **Architecture:** Modular monolith, provider adapter pattern

## MVP Scope

✅ Mock payment gateway & gold vendor
✅ Full donation flow
✅ Institution onboarding & approval
✅ Gold ledger
✅ Merkle tree batching & anchoring
✅ Certificate system (stub)
✅ Admin panel with all controls
✅ Audit logging
✅ RBAC (8 roles)
✅ Blockchain proof verification

## Documentation

- Docs index: `docs/README.md`
- Master blueprint: `docs/architecture/01-master-blueprint.md`
- Deployment guide: `docs/deployment/08-deployment-guide.md`
- Environment setup: `docs/deployment/15-environment-setup-guide.md`
- Go-live checklist: `docs/deployment/16-production-go-live-checklist.md`
- Domain go-live: `docs/deployment/18-kanaksetu-domain-go-live.md`
- CTO / backup / rollback: `docs/operations/19-cto-runbook.md`
- Smoke tests: `docs/testing/17-smoke-tests.md`

## Smoke Commands

```bash
npm run smoke:local
DONATION_ID=<donation_id> npm run smoke:proof
DONATION_ID=<donation_id> CERT_REF=<verification_ref> npm run smoke:proof
npm run smoke:all
DONATION_ID=<donation_id> CERT_REF=<verification_ref> npm run smoke:all
npm run smoke:ci
```

## Integration Tests (API)

Integration tests now include an automatic schema sync step before execution.

```bash
# Runs setup + API integration tests
npm run test:integration -w apps/api
```

Under the hood:

- `test:integration:setup` runs `tsx src/__tests__/setupPrisma.ts`
- setup loads env through `apps/api/src/loadEnv.ts`
- then executes `prisma db push --skip-generate` against `prisma/schema.prisma`
- then tests run in single-concurrency mode for DB stability

If setup fails with `DATABASE_URL` missing, ensure `infra/.env` (or `infra/prod/.env.production`) is present and valid.

## License

Proprietary — All rights reserved.
