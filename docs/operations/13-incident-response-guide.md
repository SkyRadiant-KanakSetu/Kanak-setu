# Incident Response Guide

## Severity Levels
- SEV-1: Payment flow unavailable, data corruption risk, or security breach.
- SEV-2: Core flow degraded (webhooks/anchor failing broadly).
- SEV-3: Isolated module or non-critical admin/reporting issue.

## Response Flow
1. Acknowledge incident and assign incident commander.
2. Freeze risky admin actions if consistency is uncertain.
3. Capture timeline and blast radius.
4. Apply mitigation (rollback, feature flag, queue pause, retry path).
5. Run reconciliation after mitigation.
6. Publish postmortem with root cause and action items.

## Immediate Commands
- Check API logs, webhook error spikes, and cron status.
- Verify DB health and connection saturation.
- Validate chain RPC availability and anchor key validity.

## Recovery Criteria
- End-to-end donation test passes.
- New webhooks process successfully.
- Reconciliation mismatch count returns to baseline.
