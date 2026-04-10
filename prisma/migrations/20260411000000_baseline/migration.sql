-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN_OPS', 'COMPLIANCE_ADMIN', 'FINANCE_ADMIN', 'INSTITUTION_ADMIN', 'INSTITUTION_STAFF', 'DONOR', 'AUDITOR');

-- CreateEnum
CREATE TYPE "DonorKycStatus" AS ENUM ('UNVERIFIED', 'BASIC', 'PENDING_KYC', 'VERIFIED', 'FLAGGED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('TRUST', 'NGO', 'RELIGIOUS', 'FOUNDATION', 'CORPORATE_CSR');

-- CreateEnum
CREATE TYPE "InstitutionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('INITIATED', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'UNDER_REVIEW', 'VENDOR_ORDER_PLACED', 'GOLD_ALLOCATED', 'COMPLETED', 'BATCHED', 'ANCHORED', 'PAYMENT_FAILED', 'VENDOR_FAILED', 'DISPUTED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY', 'PAYU', 'MOCK');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'SETTLED', 'FAILED', 'DISPUTED', 'REFUND_INITIATED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "GoldVendor" AS ENUM ('MMTC_PAMP', 'SAFEGOLD', 'AUGMONT', 'MOCK');

-- CreateEnum
CREATE TYPE "VendorOrderStatus" AS ENUM ('CREATED', 'SUBMITTED', 'CONFIRMED', 'ALLOCATED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('CREDIT', 'DEBIT', 'REVERSAL', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "RedemptionStatus" AS ENUM ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('DONATION_RECEIPT', 'BLOCKCHAIN_PROOF', 'TAX_80G');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('PENDING', 'GENERATED', 'ISSUED', 'REVOKED', 'GENERATION_FAILED');

-- CreateEnum
CREATE TYPE "MerkleBatchStatus" AS ENUM ('COLLECTING', 'SEALED', 'ANCHORING', 'ANCHORED', 'ANCHOR_FAILED');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'DUPLICATE', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DONOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pan" TEXT,
    "kycStatus" "DonorKycStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonorKycDoc" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonorKycDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "publicName" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL,
    "status" "InstitutionStatus" NOT NULL DEFAULT 'DRAFT',
    "registrationNo" TEXT,
    "pan" TEXT,
    "gst" TEXT,
    "has80G" BOOLEAN NOT NULL DEFAULT false,
    "cert80GNumber" TEXT,
    "cert80GExpiry" TIMESTAMP(3),
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "authorizedSignatory" TEXT,
    "signatoryDesignation" TEXT,
    "signatoryPhone" TEXT,
    "signatoryEmail" TEXT,
    "publicPageSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionDoc" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionBank" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminReview" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "fromStatus" "InstitutionStatus" NOT NULL,
    "toStatus" "InstitutionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "targetAmountPaise" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "donationRef" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "campaignId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "goldQuantityMg" DECIMAL(18,4),
    "goldPricePerGramPaise" INTEGER,
    "status" "DonationStatus" NOT NULL DEFAULT 'INITIATED',
    "idempotencyKey" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "providerData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "externalEventId" TEXT,
    "payload" JSONB NOT NULL,
    "signature" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOrder" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "vendor" "GoldVendor" NOT NULL,
    "vendorOrderRef" TEXT,
    "goldQuantityMg" DECIMAL(18,4),
    "pricePerGramPaise" INTEGER,
    "status" "VendorOrderStatus" NOT NULL DEFAULT 'CREATED',
    "vendorData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorEvent" (
    "id" TEXT NOT NULL,
    "vendorOrderId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldLedgerEntry" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "donationId" TEXT,
    "entryType" "LedgerEntryType" NOT NULL,
    "goldQuantityMg" DECIMAL(18,4) NOT NULL,
    "balanceAfterMg" DECIMAL(18,4) NOT NULL,
    "description" TEXT,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoldLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedemptionRequest" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "goldQuantityMg" DECIMAL(18,4) NOT NULL,
    "status" "RedemptionStatus" NOT NULL DEFAULT 'REQUESTED',
    "notes" TEXT,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RedemptionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "type" "CertificateType" NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT,
    "verificationRef" TEXT NOT NULL,
    "qrData" TEXT,
    "issuedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerkleBatch" (
    "id" TEXT NOT NULL,
    "batchNumber" SERIAL NOT NULL,
    "status" "MerkleBatchStatus" NOT NULL DEFAULT 'COLLECTING',
    "merkleRoot" TEXT,
    "leafCount" INTEGER NOT NULL DEFAULT 0,
    "sealedAt" TIMESTAMP(3),
    "anchoredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerkleBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerkleLeaf" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "leafIndex" INTEGER NOT NULL,
    "leafHash" TEXT NOT NULL,
    "proofPath" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerkleLeaf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockchainAnchor" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "txHash" TEXT,
    "contractAddr" TEXT,
    "merkleRoot" TEXT NOT NULL,
    "gasUsed" TEXT,
    "blockNumber" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockchainAnchor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "channel" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReconciliationRecord" (
    "id" TEXT NOT NULL,
    "donationId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "details" JSONB,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReconciliationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'RECEIVED',
    "httpStatus" INTEGER,
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportFlag" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CertificateType" NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DonorProfile_userId_key" ON "DonorProfile"("userId");

-- CreateIndex
CREATE INDEX "DonorProfile_kycStatus_idx" ON "DonorProfile"("kycStatus");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionProfile_userId_key" ON "InstitutionProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionProfile_publicPageSlug_key" ON "InstitutionProfile"("publicPageSlug");

-- CreateIndex
CREATE INDEX "InstitutionProfile_status_idx" ON "InstitutionProfile"("status");

-- CreateIndex
CREATE INDEX "InstitutionProfile_type_idx" ON "InstitutionProfile"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_donationRef_key" ON "Donation"("donationRef");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_idempotencyKey_key" ON "Donation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");

-- CreateIndex
CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId");

-- CreateIndex
CREATE INDEX "Donation_institutionId_idx" ON "Donation"("institutionId");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_donationId_key" ON "PaymentTransaction"("donationId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_providerOrderId_idx" ON "PaymentTransaction"("providerOrderId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE INDEX "PaymentEvent_transactionId_idx" ON "PaymentEvent"("transactionId");

-- CreateIndex
CREATE INDEX "PaymentEvent_transactionId_externalEventId_idx" ON "PaymentEvent"("transactionId", "externalEventId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOrder_donationId_key" ON "VendorOrder"("donationId");

-- CreateIndex
CREATE INDEX "VendorOrder_status_idx" ON "VendorOrder"("status");

-- CreateIndex
CREATE INDEX "VendorOrder_vendorOrderRef_idx" ON "VendorOrder"("vendorOrderRef");

-- CreateIndex
CREATE INDEX "VendorEvent_vendorOrderId_idx" ON "VendorEvent"("vendorOrderId");

-- CreateIndex
CREATE INDEX "GoldLedgerEntry_institutionId_idx" ON "GoldLedgerEntry"("institutionId");

-- CreateIndex
CREATE INDEX "GoldLedgerEntry_createdAt_idx" ON "GoldLedgerEntry"("createdAt");

-- CreateIndex
CREATE INDEX "RedemptionRequest_status_idx" ON "RedemptionRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_serialNumber_key" ON "Certificate"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verificationRef_key" ON "Certificate"("verificationRef");

-- CreateIndex
CREATE INDEX "Certificate_donationId_idx" ON "Certificate"("donationId");

-- CreateIndex
CREATE INDEX "Certificate_type_idx" ON "Certificate"("type");

-- CreateIndex
CREATE UNIQUE INDEX "MerkleBatch_batchNumber_key" ON "MerkleBatch"("batchNumber");

-- CreateIndex
CREATE INDEX "MerkleBatch_status_idx" ON "MerkleBatch"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MerkleLeaf_donationId_key" ON "MerkleLeaf"("donationId");

-- CreateIndex
CREATE INDEX "MerkleLeaf_batchId_idx" ON "MerkleLeaf"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainAnchor_batchId_key" ON "BlockchainAnchor"("batchId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_idx" ON "NotificationLog"("userId");

-- CreateIndex
CREATE INDEX "NotificationLog_status_idx" ON "NotificationLog"("status");

-- CreateIndex
CREATE INDEX "ReconciliationRecord_status_idx" ON "ReconciliationRecord"("status");

-- CreateIndex
CREATE INDEX "ReconciliationRecord_type_idx" ON "ReconciliationRecord"("type");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookDelivery_idempotencyKey_key" ON "WebhookDelivery"("idempotencyKey");

-- CreateIndex
CREATE INDEX "WebhookDelivery_provider_idx" ON "WebhookDelivery"("provider");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_idx" ON "WebhookDelivery"("status");

-- CreateIndex
CREATE INDEX "AdminNote_entity_entityId_idx" ON "AdminNote"("entity", "entityId");

-- CreateIndex
CREATE INDEX "SupportFlag_targetType_targetId_idx" ON "SupportFlag"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "SupportFlag_status_idx" ON "SupportFlag"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateTemplate_name_key" ON "CertificateTemplate"("name");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorProfile" ADD CONSTRAINT "DonorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorKycDoc" ADD CONSTRAINT "DonorKycDoc_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DonorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionProfile" ADD CONSTRAINT "InstitutionProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionDoc" ADD CONSTRAINT "InstitutionDoc_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionBank" ADD CONSTRAINT "InstitutionBank_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminReview" ADD CONSTRAINT "AdminReview_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DonorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "PaymentTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrder" ADD CONSTRAINT "VendorOrder_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorEvent" ADD CONSTRAINT "VendorEvent_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "VendorOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoldLedgerEntry" ADD CONSTRAINT "GoldLedgerEntry_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedemptionRequest" ADD CONSTRAINT "RedemptionRequest_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerkleLeaf" ADD CONSTRAINT "MerkleLeaf_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "MerkleBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerkleLeaf" ADD CONSTRAINT "MerkleLeaf_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainAnchor" ADD CONSTRAINT "BlockchainAnchor_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "MerkleBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

