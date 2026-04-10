# Database Schema Guide

## Design Principles
- Monetary values in paise (integers).
- Gold quantity in precise decimal mg.
- State transitions are explicit and auditable.
- Event-style tables preserve provider/vendor payload history.
- Critical idempotency and dedupe keys are first-class constraints.

## Core Tables
- `User`, `Session` for auth lifecycle.
- `DonorProfile`, `InstitutionProfile` for actor domains.
- `Donation`, `PaymentTransaction`, `PaymentEvent`.
- `VendorOrder`, `VendorEvent`.
- `InstitutionLedgerEntry`.
- `MerkleBatch`, `MerkleLeaf`, `Anchor`.
- `Certificate`, `CertificateTemplate`.
- `WebhookDelivery`, `ReconciliationRecord`, `AuditLog`.

## Entity Relationships (High Value)
- `User` 1:N `Session`
- `User` 1:1 `DonorProfile` (for donor role)
- `User` 1:1 `InstitutionProfile` (for institution role)
- `DonorProfile` 1:N `Donation`
- `InstitutionProfile` 1:N `Donation`
- `Donation` 1:1 `PaymentTransaction`
- `PaymentTransaction` 1:N `PaymentEvent`
- `Donation` 1:N `VendorOrder` (latest is operationally active)
- `Donation` 1:1 `MerkleLeaf` once batched
- `MerkleBatch` 1:N `MerkleLeaf`
- `MerkleBatch` 1:1 `Anchor` once anchored
- `Donation` 1:N `Certificate`

## Important Status Fields
- Donation: includes `UNDER_REVIEW`, `COMPLETED`, `BATCHED`, `ANCHORED`.
- Payment: includes `AUTHORIZED`, `CAPTURED`, `FAILED`, `DISPUTED`.
- Batch: includes `COLLECTING`, `SEALED`, `ANCHORED`, `ANCHOR_FAILED`.

## Indexing and Constraints
- Unique idempotency key on webhook delivery.
- Payment event dedupe via provider external event id.
- Entity foreign keys enforce relationship integrity.
- Anchor attempt tracking gates retry behavior.

## Audit and Traceability Tables
- `AuditLog`: privileged state changes and operator actions.
- `PaymentEvent`: raw provider event payload history by transaction.
- `VendorEvent`: vendor-side order/action timeline.
- `WebhookDelivery`: ingestion ledger for duplicate suppression and diagnostics.

## Data Integrity Checks (Operational)
- Donation marked `COMPLETED` should have ledger impact and vendor success trail.
- Donation with Merkle leaf should belong to a sealed/anchored batch.
- Anchored batches should have non-null tx hash and network metadata.
