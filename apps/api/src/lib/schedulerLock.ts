import { Prisma, PrismaClient } from '@prisma/client';

function defaultLockTtlMs(): number {
  return Math.max(30_000, parseInt(process.env.SCHEDULER_LOCK_TTL_MS || '240000', 10));
}

/**
 * Runs `job` only if this process wins an atomic DB row claim for `lockKey`.
 * Safe across multiple API instances: PostgreSQL serializes concurrent UPDATEs on the row.
 *
 * Lock format in SystemConfig.value JSON: `{ heldUntil: number }` where `heldUntil` is a wall-clock
 * expiry (epoch ms). Free lock: `heldUntil === 0` or expired (`heldUntil < now`).
 */
export async function withSchedulerLock(
  prisma: PrismaClient,
  lockKey: string,
  job: () => Promise<void>,
  options?: { lockTtlMs?: number }
): Promise<{ ran: boolean; reason?: string }> {
  const lockTtlMs = options?.lockTtlMs ?? defaultLockTtlMs();
  const nowMs = Date.now();
  const leaseUntil = nowMs + lockTtlMs;

  await prisma.systemConfig.upsert({
    where: { key: lockKey },
    create: { key: lockKey, value: { heldUntil: 0 } as Prisma.InputJsonValue },
    update: {},
  });

  const updated = await prisma.$executeRaw`
    UPDATE "SystemConfig"
    SET
      "value" = jsonb_build_object('heldUntil', to_jsonb(${leaseUntil})),
      "updatedAt" = NOW()
    WHERE "key" = ${lockKey}
      AND (
        COALESCE(("value"->>'heldUntil')::bigint, 0) = 0
        OR ("value"->>'heldUntil')::bigint < ${nowMs}
      )
  `;

  if (updated === 0) {
    return { ran: false, reason: 'lock_held' };
  }

  try {
    await job();
    return { ran: true };
  } finally {
    await prisma.systemConfig
      .update({
        where: { key: lockKey },
        data: { value: { heldUntil: 0 } as Prisma.InputJsonValue },
      })
      .catch((err) => {
        console.error('[scheduler-lock] failed to release', lockKey, err);
      });
  }
}
