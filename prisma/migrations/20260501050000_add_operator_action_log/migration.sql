-- Add operator action log for proving-window workflow adoption tracking
CREATE TABLE "OperatorActionLog" (
  "id" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "operatorId" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OperatorActionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OperatorActionLog_actionType_createdAt_idx"
ON "OperatorActionLog"("actionType", "createdAt");

CREATE INDEX "OperatorActionLog_operatorId_createdAt_idx"
ON "OperatorActionLog"("operatorId", "createdAt");

-- Rollback plan (manual):
-- DROP TABLE IF EXISTS "OperatorActionLog";
