-- Institution portal refinements: faith settings, spiritual functions, branches, ops tasks, metrics

-- Enums
CREATE TYPE "SpiritualFunctionType" AS ENUM (
  'PUJA',
  'SEVA',
  'FESTIVAL',
  'COMMUNITY_SERVICE',
  'EDUCATION',
  'HEALTH',
  'OTHER'
);

CREATE TYPE "SpiritualFunctionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

CREATE TYPE "InstitutionTaskType" AS ENUM (
  'PRE_EVENT',
  'EVENT_DAY',
  'POST_EVENT',
  'DONOR_FOLLOWUP',
  'COMPLIANCE',
  'OTHER'
);

CREATE TYPE "InstitutionTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- Institution faith-centric settings
ALTER TABLE "InstitutionProfile"
ADD COLUMN "faithTradition" TEXT,
ADD COLUMN "terminologyDonationLabel" TEXT,
ADD COLUMN "terminologyDonorLabel" TEXT,
ADD COLUMN "sacredCalendarHighlights" JSONB;

-- Geo: institution branches
CREATE TABLE "InstitutionBranch" (
  "id" TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "city" TEXT,
  "state" TEXT,
  "latitude" DECIMAL(10,6),
  "longitude" DECIMAL(10,6),
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InstitutionBranch_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InstitutionBranch_institutionId_idx" ON "InstitutionBranch"("institutionId");

ALTER TABLE "InstitutionBranch"
ADD CONSTRAINT "InstitutionBranch_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Spiritual function catalog
CREATE TABLE "SpiritualFunction" (
  "id" TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "functionType" "SpiritualFunctionType" NOT NULL,
  "status" "SpiritualFunctionStatus" NOT NULL DEFAULT 'ACTIVE',
  "frequency" TEXT,
  "nextDate" TIMESTAMP(3),
  "description" TEXT,
  "city" TEXT,
  "state" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SpiritualFunction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SpiritualFunction_institutionId_status_idx"
ON "SpiritualFunction"("institutionId", "status");

ALTER TABLE "SpiritualFunction"
ADD CONSTRAINT "SpiritualFunction_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Donation attribution to spiritual functions
CREATE TABLE "SpiritualFunctionContribution" (
  "id" TEXT NOT NULL,
  "functionId" TEXT NOT NULL,
  "donationId" TEXT NOT NULL,
  "attributedAmountPaise" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SpiritualFunctionContribution_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SpiritualFunctionContribution_functionId_idx"
ON "SpiritualFunctionContribution"("functionId");
CREATE INDEX "SpiritualFunctionContribution_donationId_idx"
ON "SpiritualFunctionContribution"("donationId");
CREATE UNIQUE INDEX "SpiritualFunctionContribution_functionId_donationId_key"
ON "SpiritualFunctionContribution"("functionId", "donationId");

ALTER TABLE "SpiritualFunctionContribution"
ADD CONSTRAINT "SpiritualFunctionContribution_functionId_fkey"
FOREIGN KEY ("functionId") REFERENCES "SpiritualFunction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SpiritualFunctionContribution"
ADD CONSTRAINT "SpiritualFunctionContribution_donationId_fkey"
FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Operations tasks
CREATE TABLE "InstitutionTask" (
  "id" TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "functionId" TEXT,
  "title" TEXT NOT NULL,
  "taskType" "InstitutionTaskType" NOT NULL,
  "status" "InstitutionTaskStatus" NOT NULL DEFAULT 'TODO',
  "dueDate" TIMESTAMP(3),
  "assigneeName" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InstitutionTask_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InstitutionTask_institutionId_status_idx"
ON "InstitutionTask"("institutionId", "status");

ALTER TABLE "InstitutionTask"
ADD CONSTRAINT "InstitutionTask_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InstitutionTask"
ADD CONSTRAINT "InstitutionTask_functionId_fkey"
FOREIGN KEY ("functionId") REFERENCES "SpiritualFunction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Optional daily analytics snapshots
CREATE TABLE "InstitutionMetricsDaily" (
  "id" TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "metricDate" TIMESTAMP(3) NOT NULL,
  "totalDonations" INTEGER NOT NULL DEFAULT 0,
  "totalAmountPaise" INTEGER NOT NULL DEFAULT 0,
  "activeDonors" INTEGER NOT NULL DEFAULT 0,
  "repeatDonors" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InstitutionMetricsDaily_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InstitutionMetricsDaily_institutionId_metricDate_idx"
ON "InstitutionMetricsDaily"("institutionId", "metricDate");
CREATE UNIQUE INDEX "InstitutionMetricsDaily_institutionId_metricDate_key"
ON "InstitutionMetricsDaily"("institutionId", "metricDate");

ALTER TABLE "InstitutionMetricsDaily"
ADD CONSTRAINT "InstitutionMetricsDaily_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "InstitutionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
