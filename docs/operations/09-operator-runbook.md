# Operator Runbook

## Daily Operations
- Check admin dashboard KPIs and failed donation counts.
- Review webhook delivery list for repeated failures.
- Trigger reconciliation manually if anomaly is suspected.
- Review `ANCHOR_FAILED` batches and retry if under attempt threshold.

## Start-of-Day Checks
- API health and DB connectivity.
- Last successful cron execution for merkle seal/anchor and reconciliation.
- No backlog in unresolved support flags.

## End-of-Day Checks
- Reconciliation record for the day is `MATCHED` or has actionable mismatches.
- Webhook failure rate below threshold.
- Anchor queue clear or known issue logged.

## Escalation Conditions
- Repeated signature verification failures.
- High count of `PAYMENT_PENDING` older than SLA.
- Spike in `UNDER_REVIEW` without clear compliance reason.
- Anchor retries exhausted.
