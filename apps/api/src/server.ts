import './loadEnv';
import type { Store } from 'express-rate-limit';
import { getEnv } from './config/env';
getEnv();

import { buildApp } from './app';
import { connectRedisRateLimitStore } from './lib/redisRateLimitStore';
import { prisma } from './config/prisma';
import { startCronJobs } from './jobs/scheduler';
import { assertAnchorRuntimeReady } from './modules/merkle/anchor.service';

const PORT = getEnv().PORT;

async function main() {
  await prisma.$connect();
  console.log('✅ Database connected');

  await assertAnchorRuntimeReady();
  console.log('✅ Anchor runtime checks passed');

  let rateLimitStore: Store | undefined;
  const redisUrl = getEnv().REDIS_URL;
  if (redisUrl) {
    try {
      rateLimitStore = await connectRedisRateLimitStore(redisUrl);
      console.log('✅ Redis rate-limit store connected');
    } catch (err) {
      console.error('⚠️ REDIS_URL set but Redis unavailable — using in-memory rate limits:', err);
    }
  } else {
    console.log('ℹ️ REDIS_URL unset — per-process in-memory rate limits (set Redis for multi-replica limits)');
  }

  const app = buildApp({ rateLimitStore });

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
