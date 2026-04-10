import { prisma } from '../../config/prisma';

export type ReconciliationJobResult = {
  stalePaymentPending: number;
  completedWithoutLedger: number;
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

  const record = await prisma.reconciliationRecord.create({
    data: {
      type: 'SCHEDULED_SCAN',
      status: stalePaymentPending + completedWithoutLedger > 0 ? 'MISMATCH' : 'MATCHED',
      details: {
        at: new Date().toISOString(),
        stalePaymentPending,
        completedWithoutLedger,
      },
    },
  });

  return {
    stalePaymentPending,
    completedWithoutLedger,
    runRecordId: record.id,
  };
}
