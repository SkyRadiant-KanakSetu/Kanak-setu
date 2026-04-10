// ============================================================
// KANAK SETU — SHARED TYPES & ENUMS
// ============================================================

// --- USER & AUTH ---
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_OPS = 'ADMIN_OPS',
  COMPLIANCE_ADMIN = 'COMPLIANCE_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
  INSTITUTION_STAFF = 'INSTITUTION_STAFF',
  DONOR = 'DONOR',
  AUDITOR = 'AUDITOR',
}

export enum DonorKycStatus {
  UNVERIFIED = 'UNVERIFIED',
  BASIC = 'BASIC',
  PENDING_KYC = 'PENDING_KYC',
  VERIFIED = 'VERIFIED',
  FLAGGED = 'FLAGGED',
  BLOCKED = 'BLOCKED',
}

// --- INSTITUTION ---
export enum InstitutionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export enum InstitutionType {
  TRUST = 'TRUST',
  NGO = 'NGO',
  RELIGIOUS = 'RELIGIOUS',
  FOUNDATION = 'FOUNDATION',
  CORPORATE_CSR = 'CORPORATE_CSR',
}

// --- DONATION ---
export enum DonationStatus {
  INITIATED = 'INITIATED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VENDOR_ORDER_PLACED = 'VENDOR_ORDER_PLACED',
  GOLD_ALLOCATED = 'GOLD_ALLOCATED',
  COMPLETED = 'COMPLETED',
  BATCHED = 'BATCHED',
  ANCHORED = 'ANCHORED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  VENDOR_FAILED = 'VENDOR_FAILED',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

// --- PAYMENT ---
export enum PaymentStatus {
  CREATED = 'CREATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
  DISPUTED = 'DISPUTED',
  REFUND_INITIATED = 'REFUND_INITIATED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  RAZORPAY = 'RAZORPAY',
  PAYU = 'PAYU',
  MOCK = 'MOCK',
}

// --- VENDOR ---
export enum VendorOrderStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  CONFIRMED = 'CONFIRMED',
  ALLOCATED = 'ALLOCATED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export enum GoldVendor {
  MMTC_PAMP = 'MMTC_PAMP',
  SAFEGOLD = 'SAFEGOLD',
  AUGMONT = 'AUGMONT',
  MOCK = 'MOCK',
}

// --- LEDGER ---
export enum LedgerEntryType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REVERSAL = 'REVERSAL',
  ADJUSTMENT = 'ADJUSTMENT',
}

// --- MERKLE / BLOCKCHAIN ---
export enum MerkleBatchStatus {
  COLLECTING = 'COLLECTING',
  SEALED = 'SEALED',
  ANCHORING = 'ANCHORING',
  ANCHORED = 'ANCHORED',
  ANCHOR_FAILED = 'ANCHOR_FAILED',
}

// --- CERTIFICATE ---
export enum CertificateType {
  DONATION_RECEIPT = 'DONATION_RECEIPT',
  BLOCKCHAIN_PROOF = 'BLOCKCHAIN_PROOF',
  TAX_80G = 'TAX_80G',
}

export enum CertificateStatus {
  PENDING = 'PENDING',
  GENERATED = 'GENERATED',
  ISSUED = 'ISSUED',
  REVOKED = 'REVOKED',
  GENERATION_FAILED = 'GENERATION_FAILED',
}

// --- REDEMPTION ---
export enum RedemptionStatus {
  REQUESTED = 'REQUESTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// --- NOTIFICATION ---
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  IN_APP = 'IN_APP',
}

// --- AUDIT ---
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  LOGIN = 'LOGIN',
  MANUAL_OVERRIDE = 'MANUAL_OVERRIDE',
  APPROVAL = 'APPROVAL',
  REJECTION = 'REJECTION',
}

// --- API RESPONSE ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  meta?: { page?: number; limit?: number; total?: number };
}

// --- DOMAIN EVENTS ---
export enum DomainEvent {
  DONATION_CREATED = 'donation.created',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  VENDOR_ORDER_ALLOCATED = 'vendor.order.allocated',
  VENDOR_ORDER_FAILED = 'vendor.order.failed',
  LEDGER_CREDITED = 'ledger.credited',
  BATCH_SEALED = 'batch.sealed',
  BATCH_ANCHORED = 'batch.anchored',
  CERTIFICATE_ISSUED = 'certificate.issued',
  INSTITUTION_APPROVED = 'institution.approved',
  INSTITUTION_SUSPENDED = 'institution.suspended',
  KYC_VERIFIED = 'kyc.verified',
}
