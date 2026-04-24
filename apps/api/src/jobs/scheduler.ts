import cron from 'node-cron';
import { sealCurrentBatch } from '../modules/merkle/merkle.service';
import { anchorAllSealed } from '../modules/merkle/anchor.service';
import { runReconciliationJob } from '../modules/reconciliation/reconciliation.service';
import { prisma } from '../config/prisma';

const ENABLE_MERKLE_AUTOMATION = process.env.ENABLE_MERKLE_AUTOMATION !== '0';
const SCHEDULER_LOCK_TTL_MS = Math.max(
  30_000,
  parseInt(process.env.SCHEDULER_LOCK_TTL_MS || '240000', 10)
);

async function withDistributedLock(lockKey: string, fn: () => Promise<void>) {
  const now = Date.now();
  const existing = await prisma.systemConfig.findUnique({ where: { key: lockKey } });
  const lockValue = (existing?.value || {}) as { heldUntil?: number };
  if (lockValue.heldUntil && lockValue.heldUntil > now) {
    return;
  }
  await prisma.systemConfig.upsert({
    where: { key: lockKey },
    update: { value: { heldUntil: now + SCHEDULER_LOCK_TTL_MS } as object },
    create: { key: lockKey, value: { heldUntil: now + SCHEDULER_LOCK_TTL_MS } as object },
  });
  try {
    await fn();
  } finally {
    await prisma.systemConfig.update({
      where: { key: lockKey },
      data: { value: { heldUntil: 0 } as object },
    });
  }
}

export function startCronJobs() {
  if (!ENABLE_MERKLE_AUTOMATION) {
    console.log('  ⏸ Merkle automation disabled by ENABLE_MERKLE_AUTOMATION=0');
    return;
  }

  // Seal merkle batch every 6 hours
  const batchCron = process.env.MERKLE_BATCH_CRON || '0 */6 * * *';
  cron.schedule(batchCron, async () => {
    await withDistributedLock('scheduler:merkle-batch', async () => {
      console.log('[CRON] Sealing merkle batch...');
      try {
        const result = await sealCurrentBatch();
        console.log('[CRON] Batch sealed:', result);

        // Then try to anchor
        const anchored = await anchorAllSealed();
        console.log('[CRON] Anchor results:', anchored);
      } catch (err) {
        console.error('[CRON] Merkle batch/anchor error:', err);
      }
    });
  });

  // Reconciliation placeholder (daily at 2am)
  const reconCron = process.env.RECONCILIATION_CRON || '0 2 * * *';
  cron.schedule(reconCron, async () => {
    await withDistributedLock('scheduler:reconciliation', async () => {
      console.log('[CRON] Running reconciliation...');
      try {
        const r = await runReconciliationJob();
        console.log('[CRON] Reconciliation result:', r);
      } catch (err) {
        console.error('[CRON] Reconciliation error:', err);
      }
    });
  });

  console.log(`  📅 Merkle batch cron: ${batchCron}`);
  console.log(`  📅 Reconciliation cron: ${reconCron}`);
}
