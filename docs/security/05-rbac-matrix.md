# RBAC Matrix

## Platform Roles
- `SUPER_ADMIN`: full platform authority.
- `ADMIN_OPS`: operational controls (institution flow, retries).
- `COMPLIANCE_ADMIN`: institution review and compliance oversight.
- `FINANCE_ADMIN`: finance controls and webhook monitoring.
- `AUDITOR`: read-only audit access.
- `DONOR`: donor self-service APIs.
- `INSTITUTION_ADMIN`: institution portal management.

## Admin Bundles in Code
- `requirePlatformStaff`: super/compliance/ops/finance.
- `requireInstitutionReviewers`: super/compliance/ops.
- `requireAuditReaders`: super/auditor/compliance.
- `requireFinance`: super/finance.
- `requireWebhookMonitors`: super/finance/ops.
- `requireVendorRetry`: super/ops.

## Control Expectations
- Sensitive mutations require authenticated role checks.
- Public routes are limited to proof/certificate verification.
- Every privileged mutation should emit an audit event.
