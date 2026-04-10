# Phase 1 — Master Technical Blueprint

## Goal
Build Kanak Setu as a production-grade digital gold donation platform with auditability, controlled operations, and blockchain-backed proof.

## System Shape
- Architecture: modular monolith (`apps/api`) + 3 Next.js apps (`apps/donor-web`, `apps/institution-web`, `apps/admin-web`).
- Database: PostgreSQL with Prisma, append-style financial records, strict state transitions.
- Integrations: payment gateway adapter + gold vendor adapter + Polygon Amoy anchor.
- Proof layer: `DonationLeafV1` canonical leaf, keccak hashing, sorted-pair Merkle tree.

## Bounded Contexts
- Identity and Access: users, sessions, JWT, RBAC bundles.
- Donor: donor profile, donation create/list, receipts.
- Institution: onboarding, KYC artifacts, lifecycle state transitions.
- Payments: order creation, webhook verification, payment events.
- Gold and Ledger: allocation, vendor orders/events, institution ledger entries.
- Merkle and Anchor: batching, proof generation, chain anchor retries.
- Certificates: receipt/proof generation and verification references.
- Admin and Operations: review queues, webhooks monitoring, reconciliation, audit.

## Core Workflow (Happy Path)
1. Donor creates donation for an institution.
2. Payment order is created through adapter.
3. Provider webhook confirms capture.
4. Donation moves to `PAYMENT_CONFIRMED`.
5. Gold vendor allocation succeeds and ledger is updated.
6. Donation becomes `COMPLETED`.
7. Batch seals, leaf proof is stored.
8. Merkle root is anchored on-chain.
9. Certificate is issued with verification reference.

## Critical Control Points
- Webhook integrity: Razorpay raw body HMAC, PayU reverse hash validation.
- Idempotency: `WebhookDelivery` + `PaymentEvent` duplicate guards.
- Compliance hold: if institution not `ACTIVE`, donation moves to `UNDER_REVIEW`.
- Anchor resilience: failed batches retried up to max attempts before hard fail.
- Public verification: proof and certificate verification routes.

## Non-Functional Targets
- Traceability: request IDs and audit logs for privileged actions.
- Operational safety: retries, explicit failures, admin remediation actions.
- Evolvability: adapter interfaces for payment/vendor provider replacement.
- Verifiability: deterministic leaf serialization and proof reconstruction.

## Phase Completion Baseline
- API + all frontends build.
- End-to-end donation path runs locally.
- Admin can review institutions, monitor webhooks, run reconciliation, retry anchors.
- Public proof endpoints return verifiable data.
