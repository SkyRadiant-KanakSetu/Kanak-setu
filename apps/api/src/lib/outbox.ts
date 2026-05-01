import type { Prisma, PrismaClient } from '@prisma/client';

export type EventType =
  | 'payment.confirmed'
  | 'payment.failed'
  | 'receipt.generate'
  | 'webhook.dispatch'
  | 'institution.notification'
  | 'donor.confirmation';

export interface OutboxPayload {
  eventType: EventType;
  aggregateId: string;
  aggregateType: 'Donation' | 'Institution' | 'Webhook' | 'Donor';
  payload: Record<string, unknown>;
}

type OutboxTx = Prisma.TransactionClient | PrismaClient;

/**
 * Persist outbox events in the same transaction as business state transitions.
 * This ensures event durability and avoids "DB write succeeded, side-effect lost".
 */
export function writeOutboxEvent(tx: OutboxTx, event: OutboxPayload) {
  return tx.outboxEvent.create({
    data: {
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      payload: event.payload as Prisma.InputJsonValue,
      status: 'pending',
    },
  });
}
