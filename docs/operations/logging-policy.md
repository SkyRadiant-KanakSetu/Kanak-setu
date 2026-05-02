# Logging Policy

## Log sources

| Source | Where | Retention |
|--------|-------|-----------|
| API errors | Sentry | 90 days |
| PM2 stdout/stderr | Logtail (Better Stack) | 30 days (free tier baseline) |
| Deploy telemetry | `/opt/kanak-setu/logs/deploy-telemetry.log` | VPS, rolling manual review |
| Verify snapshot | `/opt/kanak-setu/logs/last-verify.json` | VPS, overwritten each run |
| Backup log | `/opt/kanak-setu/logs/backup.log` | VPS, rolling manual review |

## Search patterns

- `level:error` — all errors
- `correlationId:req_` — request-level trace
- `source:kanak-outbox-worker level:error` — outbox failures
- `source:kanak-api latencyMs:>1000` — slow API paths

## Incident runbook (short)

1. Check Sentry for the newest issue/spike.
2. Copy correlation ID from Sentry and search Logtail.
3. Check outbox queue health:
   - `SELECT status, COUNT(*) FROM "OutboxEvent" GROUP BY status;`
4. Confirm PM2 health:
   - `pm2 list`
   - `pm2 logs kanak-api --lines 50`
5. Run production verify:
   - `APP_DIR=/opt/kanak-setu bash scripts/prod/post-deploy-verify.sh`
