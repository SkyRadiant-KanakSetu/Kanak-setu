import cron from 'node-cron';
import { sealCurrentBatch } from '../modules/merkle/merkle.service';
import { anchorAllSealed } from '../modules/merkle/anchor.service';
import { runReconciliationJob } from '../modules/reconciliation/reconciliation.service';
import { prisma } from '../config/prisma';
import { withSchedulerLock } from '../lib/schedulerLock';

const ENABLE_MERKLE_AUTOMATION = process.env.ENABLE_MERKLE_AUTOMATION !== '0';

export function startCronJobs() {
  if (!ENABLE_MERKLE_AUTOMATION) {
    console.log('  ⏸ Merkle automation disabled by ENABLE_MERKLE_AUTOMATION=0');
    return;
  }

  const batchCron = process.env.MERKLE_BATCH_CRON || '0 */6 * * *';
  cron.schedule(batchCron, async () => {
    const r = await withSchedulerLock(prisma, 'scheduler:merkle-batch', async () => {
      console.log('[CRON] Sealing merkle batch...');
      try {
        const result = await sealCurrentBatch();
        console.log('[CRON] Batch sealed:', result);

        const anchored = await anchorAllSealed();
        console.log('[CRON] Anchor results:', anchored);
      } catch (err) {
        console.error('[CRON] Merkle batch/anchor error:', err);
      }
    });
    if (!r.ran && r.reason === 'lock_held') {
      console.log('[CRON] Merkle batch skipped — lock held by another instance');
    }
  });

  const reconCron = process.env.RECONCILIATION_CRON || '0 2 * * *';
  cron.schedule(reconCron, async () => {
    const r = await withSchedulerLock(prisma, 'scheduler:reconciliation', async () => {
      console.log('[CRON] Running reconciliation...');
      try {
        const reconResult = await runReconciliationJob();
        console.log('[CRON] Reconciliation result:', reconResult);
      } catch (err) {
        console.error('[CRON] Reconciliation error:', err);
      }
    });
    if (!r.ran && r.reason === 'lock_held') {
      console.log('[CRON] Reconciliation skipped — lock held by another instance');
    }
  });

  console.log(`  📅 Merkle batch cron: ${batchCron}`);
  console.log(`  📅 Reconciliation cron: ${reconCron}`);
}
