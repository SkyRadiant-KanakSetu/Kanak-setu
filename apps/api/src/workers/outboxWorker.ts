import '../loadEnv';
import { Prisma, PrismaClient, type OutboxEvent } from '@prisma/client';
import { confirmPayment } from '../modules/donations/donation.service';
import { generateDonationReceipt } from '../modules/certificates/certificate.service';

type EventType =
  | 'payment.confirmed'
  | 'payment.failed'
  | 'receipt.generate'
  | 'webhook.dispatch'
  | 'institution.notification'
  | 'donor.confirmation';

const prisma = new PrismaClient();

const MAX_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 5000;
const BATCH_SIZE = 10;

const handlers: Partial<Record<EventType, (payload: Record<string, unknown>, eventId: string) => Promise<void>>> = {
  'payment.confirmed': handlePaymentConfirmed,
  'payment.failed': handlePaymentFailed,
  'receipt.generate': handleReceiptGenerate,
  'webhook.dispatch': handleWebhookDispatch,
  'institution.notification': handleInstitutionNotification,
  'donor.confirmation': handleDonorConfirmation,
};

async function claimOutboxBatch(): Promise<OutboxEvent[]> {
  /**
   * PostgreSQL `FOR UPDATE SKIP LOCKED` claims rows atomically so multiple worker
   * processes (horizontal scaling) cannot process the same event twice.
   */
  const claimed = await prisma.$queryRaw<OutboxEvent[]>`
    WITH picked AS (
      SELECT "id"
      FROM "OutboxEvent"
      WHERE "status" = 'pending' AND "attempts" < ${MAX_ATTEMPTS}
      ORDER BY "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${BATCH_SIZE}
    )
    UPDATE "OutboxEvent" AS o
    SET "status" = 'processing', "lastAttemptAt" = NOW(), "updatedAt" = NOW()
    FROM picked
    WHERE o."id" = picked."id"
    RETURNING o.*;
  `;
  return claimed;
}

async function processBatch() {
  const events = await claimOutboxBatch();

  for (const event of events) {
    const handler = handlers[event.eventType as EventType];

    if (!handler) {
      console.error(
        JSON.stringify({
          level: 'error',
          message: 'No handler for outbox event type',
          eventType: event.eventType,
          eventId: event.id,
        })
      );
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: 'failed', failedAt: new Date(), attempts: { increment: 1 } },
      });
      continue;
    }

    try {
      await handler(event.payload as Record<string, unknown>, event.id);
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: 'delivered', deliveredAt: new Date(), attempts: { increment: 1 } },
      });
    } catch (err) {
      const attempts = event.attempts + 1;
      const isFinal = attempts >= MAX_ATTEMPTS;
      const reason = err instanceof Error ? err.message : String(err);

      console.error(
        JSON.stringify({
          level: 'error',
          message: 'Outbox event processing failed',
          eventType: event.eventType,
          eventId: event.id,
          attempt: attempts,
          final: isFinal,
          error: reason,
        })
      );

      if (isFinal) {
        await prisma.$transaction([
          prisma.outboxDeadLetter.create({
            data: {
              originalId: event.id,
              eventType: event.eventType,
              aggregateId: event.aggregateId,
              aggregateType: event.aggregateType,
              payload: event.payload as Prisma.InputJsonValue,
              failReason: reason,
              attempts,
            },
          }),
          prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'failed', failedAt: new Date(), attempts },
          }),
        ]);
      } else {
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'pending', attempts, lastAttemptAt: new Date() },
        });
      }
    }
  }
}

async function handlePaymentConfirmed(payload: Record<string, unknown>, _eventId: string) {
  const donationId = String(payload.donationId || '');
  const providerPaymentId = String(payload.providerPaymentId || '');
  if (!donationId || !providerPaymentId) {
    throw new Error('payment.confirmed missing donationId/providerPaymentId');
  }
  await confirmPayment(donationId, providerPaymentId);
}

async function handlePaymentFailed(payload: Record<string, unknown>, _eventId: string) {
  const donationId = String(payload.donationId || '');
  if (!donationId) throw new Error('payment.failed missing donationId');

  await prisma.paymentTransaction.updateMany({
    where: { donationId },
    data: { status: 'FAILED' },
  });
  await prisma.donation.update({
    where: { id: donationId },
    data: { status: 'PAYMENT_FAILED' },
  });
}

// TODO(Stage 4): replace placeholder notification/webhook persistence with provider integrations.
async function handleReceiptGenerate(payload: Record<string, unknown>, _eventId: string) {
  const donationId = String(payload.donationId || '');
  if (!donationId) throw new Error('receipt.generate missing donationId');
  await generateDonationReceipt(donationId);
}

async function handleWebhookDispatch(payload: Record<string, unknown>, _eventId: string) {
  const donationId = String(payload.donationId || '');
  if (!donationId) throw new Error('webhook.dispatch missing donationId');
  await prisma.webhookDelivery.create({
    data: {
      provider: 'INTERNAL_OUTBOX',
      idempotencyKey: `outbox:${donationId}:${Date.now()}`,
      payload: payload as Prisma.InputJsonValue,
      status: 'PROCESSED',
      processedAt: new Date(),
      httpStatus: 200,
    },
  });
}

async function handleInstitutionNotification(payload: Record<string, unknown>, _eventId: string) {
  const institutionId = String(payload.institutionId || '');
  if (!institutionId) throw new Error('institution.notification missing institutionId');
  await prisma.notificationLog.create({
    data: {
      channel: 'IN_APP',
      type: 'INSTITUTION_DONATION_CONFIRMED',
      recipient: institutionId,
      body: JSON.stringify(payload),
      status: 'SENT',
      sentAt: new Date(),
    },
  });
}

async function handleDonorConfirmation(payload: Record<string, unknown>, _eventId: string) {
  const donorId = String(payload.donorId || '');
  if (!donorId) throw new Error('donor.confirmation missing donorId');
  await prisma.notificationLog.create({
    data: {
      channel: 'IN_APP',
      type: 'DONOR_DONATION_CONFIRMED',
      recipient: donorId,
      body: JSON.stringify(payload),
      status: 'SENT',
      sentAt: new Date(),
    },
  });
}

async function run() {
  console.log('Outbox worker started');
  while (true) {
    try {
      await processBatch();
    } catch (err) {
      console.error('Outbox worker batch error:', err);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

run().catch((err) => {
  console.error('Outbox worker fatal error:', err);
  process.exit(1);
});
