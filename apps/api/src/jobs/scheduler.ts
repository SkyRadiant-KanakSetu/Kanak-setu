import cron from 'node-cron';
import { sealCurrentBatch } from '../modules/merkle/merkle.service';
import { anchorAllSealed } from '../modules/merkle/anchor.service';
import { runReconciliationJob } from '../modules/reconciliation/reconciliation.service';

export function startCronJobs() {
  // Seal merkle batch every 6 hours
  const batchCron = process.env.MERKLE_BATCH_CRON || '0 */6 * * *';
  cron.schedule(batchCron, async () => {
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

  // Reconciliation placeholder (daily at 2am)
  const reconCron = process.env.RECONCILIATION_CRON || '0 2 * * *';
  cron.schedule(reconCron, async () => {
    console.log('[CRON] Running reconciliation...');
    try {
      const r = await runReconciliationJob();
      console.log('[CRON] Reconciliation result:', r);
    } catch (err) {
      console.error('[CRON] Reconciliation error:', err);
    }
  });

  console.log(`  📅 Merkle batch cron: ${batchCron}`);
  console.log(`  📅 Reconciliation cron: ${reconCron}`);
}
