import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

export type WebhookProvider = 'RAZORPAY' | 'PAYU' | 'GOLD_VENDOR' | 'MOCK';

/**
 * Persist webhook for idempotency. Signature verification and domain side-effects
 * are applied after this record succeeds (same delivery key → duplicate).
 */
export async function ingestWebhook(args: {
  provider: WebhookProvider;
  idempotencyKey: string;
  payload: unknown;
}): Promise<{ duplicate: boolean; deliveryId: string }> {
  try {
    const row = await prisma.webhookDelivery.create({
      data: {
        provider: args.provider,
        idempotencyKey: args.idempotencyKey,
        payload: args.payload as object,
        status: 'PROCESSED',
        processedAt: new Date(),
        httpStatus: 200,
      },
    });
    return { duplicate: false, deliveryId: row.id };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const existing = await prisma.webhookDelivery.findUnique({
        where: { idempotencyKey: args.idempotencyKey },
      });
      if (existing) return { duplicate: true, deliveryId: existing.id };
    }
    throw e;
  }
}

export function hashPayloadIdempotencyKey(provider: WebhookProvider, body: unknown): string {
  const h = createHash('sha256');
  h.update(provider);
  h.update(':');
  h.update(typeof body === 'string' ? body : JSON.stringify(body));
  return h.digest('hex');
}
