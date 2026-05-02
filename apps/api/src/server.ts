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

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

async function main() {
  let rateLimitStore: Store | undefined;
  const redisUrl = getEnv().REDIS_URL;
  if (redisUrl) {
    try {
      rateLimitStore = await withTimeout(
        connectRedisRateLimitStore(redisUrl),
        12000,
        'Redis rate-limit connect'
      );
      console.log('✅ Redis rate-limit store connected');
    } catch (err) {
      console.error('⚠️ REDIS_URL set but connect failed or timed out — using in-memory rate limits:', err);
    }
  } else {
    console.log('ℹ️ REDIS_URL unset — per-process in-memory rate limits (set Redis for multi-replica limits)');
  }

  const app = buildApp({ rateLimitStore });

  startCronJobs();
  console.log('✅ Cron jobs started');

  // Bind HTTP before DB + anchor work so a slow/hung Prisma connect never leaves the process with no listener
  // (operators can still hit /api/v1/health; DB routes may 500 until connect completes).
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Kanak Setu API listening on port ${PORT}`);
      resolve();
    });
    server.on('error', reject);
  });

  await withTimeout(prisma.$connect(), 60000, 'Database connect');
  console.log('✅ Database connected');

  try {
    await withTimeout(assertAnchorRuntimeReady(), 45000, 'Anchor runtime checks');
    console.log('✅ Anchor runtime checks passed');
  } catch (err) {
    console.error('❌ Anchor runtime checks failed:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
