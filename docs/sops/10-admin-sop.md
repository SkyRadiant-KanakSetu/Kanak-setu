# Admin SOP

## Institution Review
1. Open institution queue.
2. Validate KYC documents and bank details.
3. Move status through allowed transitions only.
4. Record review notes for each decision.

## Webhook Monitoring
1. Open webhook delivery screen.
2. Check provider, idempotency key reuse, and status.
3. Investigate repeated failures and escalate as needed.

## Reconciliation
1. Trigger manual run if mismatch signal appears.
2. Investigate record details and related donation/payment entities.
3. Document corrective action in admin notes.

## Anchor Operations
1. Review `SEALED` and `ANCHOR_FAILED` batches.
2. Retry failed anchors within attempt budget.
3. Escalate once max attempts are exhausted.
