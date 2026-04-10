# Production Go-Live Checklist

## Security and Compliance
- [ ] Production secrets in managed secret store
- [ ] JWT secrets rotated from defaults
- [ ] CORS origins locked to production domains
- [ ] Admin roles reviewed and least privilege enforced

## Data and Infra
- [ ] Production Postgres provisioned with backups
- [ ] Migration dry run completed in staging
- [ ] Alerting configured for API errors and cron failures
- [ ] Log retention and audit retention policies documented

## Integrations
- [ ] Payment webhook URLs configured and tested
- [ ] Signature verification tested with live sandbox payloads
- [ ] Gold vendor adapter keys configured (or explicit mock disabled policy)
- [ ] Polygon anchor wallet funded and contract address validated

## Operational Readiness
- [ ] Reconciliation runbook approved
- [ ] Incident response contacts and severity matrix published
- [ ] Support SOPs for donor/institution/admin teams approved
- [ ] Final smoke test executed and signed off
