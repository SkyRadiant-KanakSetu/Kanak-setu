import { requireRole } from './auth';

/**
 * Role bundles for the admin API. Institution users use separate routes (`/institutions` app).
 */
export const requirePlatformStaff = requireRole(
  'SUPER_ADMIN',
  'ADMIN_OPS',
  'COMPLIANCE_ADMIN',
  'FINANCE_ADMIN'
);

export const requireInstitutionReviewers = requireRole(
  'SUPER_ADMIN',
  'ADMIN_OPS',
  'COMPLIANCE_ADMIN'
);

export const requireAuditReaders = requireRole('SUPER_ADMIN', 'AUDITOR', 'COMPLIANCE_ADMIN');

export const requireFinance = requireRole('SUPER_ADMIN', 'FINANCE_ADMIN');

export const requireWebhookMonitors = requireRole('SUPER_ADMIN', 'FINANCE_ADMIN', 'ADMIN_OPS');

export const requireVendorRetry = requireRole('SUPER_ADMIN', 'ADMIN_OPS');
