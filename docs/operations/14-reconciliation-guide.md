# Reconciliation Guide

## Current Reconciliation Scope
- Detect stale `PAYMENT_PENDING` donations.
- Detect `COMPLETED` donations without expected ledger entries.
- Persist result in `ReconciliationRecord`.

## Manual Execution
- Admin API: `POST /api/v1/admin/reconciliation/run`
- Review recent records in admin dashboard after execution.

## Mismatch Taxonomy
- Payment mismatch: provider captured but platform still pending/failed.
- Donation mismatch: donation complete but no vendor/ledger completion.
- Ledger mismatch: institution ledger not matching completed allocations.
- Merkle mismatch: completed donation missing leaf or batch.

## Resolution Process
1. Identify mismatch type.
2. Validate source-of-truth events (`PaymentEvent`, `WebhookDelivery`, `VendorEvent`).
3. Apply corrective action (retry, status transition, manual note).
4. Add audit note and re-run reconciliation.
