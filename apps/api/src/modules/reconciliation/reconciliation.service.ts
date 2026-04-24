import { prisma } from '../../config/prisma';

export type ReconciliationJobResult = {
  stalePaymentPending: number;
  completedWithoutLedger: number;
  batchedWithoutLeaf: number;
  anchoredBatchesWithoutConfirmedAnchor: number;
  runRecordId: string;
};

/**
 * Scheduled reconciliation: flags structural mismatches (not full five-pillar parity yet).
 */
export async function runReconciliationJob(): Promise<ReconciliationJobResult> {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stalePaymentPending = await prisma.donation.count({
    where: {
      status: 'PAYMENT_PENDING',
      createdAt: { lt: dayAgo },
    },
  });

  const completedDonations = await prisma.donation.findMany({
    where: { status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] } },
    select: { id: true },
  });
  let completedWithoutLedger = 0;
  for (const d of completedDonations) {
    const le = await prisma.goldLedgerEntry.findFirst({ where: { donationId: d.id } });
    if (!le) completedWithoutLedger += 1;
  }

  const batchedDonations = await prisma.donation.findMany({
    where: { status: { in: ['BATCHED', 'ANCHORED'] } },
    select: { id: true },
  });
  let batchedWithoutLeaf = 0;
  for (const d of batchedDonations) {
    const leaf = await prisma.merkleLeaf.findUnique({ where: { donationId: d.id }, select: { id: true } });
    if (!leaf) batchedWithoutLeaf += 1;
  }

  const anchoredBatches = await prisma.merkleBatch.findMany({
    where: { status: 'ANCHORED' },
    include: { anchor: { select: { status: true } } },
  });
  const anchoredBatchesWithoutConfirmedAnchor = anchoredBatches.filter(
    (b) => !b.anchor || b.anchor.status !== 'CONFIRMED'
  ).length;

  const record = await prisma.reconciliationRecord.create({
    data: {
      type: 'SCHEDULED_SCAN',
      status:
        stalePaymentPending +
          completedWithoutLedger +
          batchedWithoutLeaf +
          anchoredBatchesWithoutConfirmedAnchor >
        0
          ? 'MISMATCH'
          : 'MATCHED',
      details: {
        at: new Date().toISOString(),
        stalePaymentPending,
        completedWithoutLedger,
        batchedWithoutLeaf,
        anchoredBatchesWithoutConfirmedAnchor,
      },
    },
  });

  return {
    stalePaymentPending,
    completedWithoutLedger,
    batchedWithoutLeaf,
    anchoredBatchesWithoutConfirmedAnchor,
    runRecordId: record.id,
  };
}
