import './loadEnv';
import { getEnv } from './config/env';
getEnv();

import { app } from './app';
import { prisma } from './config/prisma';
import { startCronJobs } from './jobs/scheduler';
import { assertAnchorRuntimeReady } from './modules/merkle/anchor.service';

const PORT = getEnv().PORT;

async function main() {
  await prisma.$connect();
  console.log('✅ Database connected');

  await assertAnchorRuntimeReady();
  console.log('✅ Anchor runtime checks passed');

  startCronJobs();
  console.log('✅ Cron jobs started');

  app.listen(PORT, () => {
    console.log(`🚀 Kanak Setu API running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
