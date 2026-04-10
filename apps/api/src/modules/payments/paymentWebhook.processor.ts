import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { auditLog } from '../../utils/auditLog';
import { confirmPayment } from '../donations/donation.service';
import { getPaymentAdapterForProvider } from './payment.adapter';
import { ingestWebhook, hashPayloadIdempotencyKey, type WebhookProvider } from '../webhooks/webhook.service';

function extractProviderOrderId(body: unknown): string | undefined {
  const b = body as Record<string, unknown>;
  if (b.payload && typeof b.payload === 'object') {
    const p = b.payload as { payment?: { entity?: { order_id?: string } } };
    const oid = p.payment?.entity?.order_id;
    if (oid) return oid;
  }
  return (b.orderId as string) || (b.providerOrderId as string) || (b.txnid as string);
}

function extractExternalEventId(provider: string, body: unknown): string {
  const b = body as Record<string, unknown>;
  if (typeof b.id === 'string' && b.id) return `${provider}:${b.id}`;
  if (typeof b.mihpayid === 'string' && b.mihpayid) return `${provider}:${b.mihpayid}`;
  return `${provider}:${hashPayloadIdempotencyKey(provider as WebhookProvider, body)}`;
}

/**
 * Full payment webhook pipeline: HMAC verify → WebhookDelivery idempotency → PaymentEvent dedupe → state updates.
 */
export async function processPaymentProviderWebhook(input: {
  provider: 'RAZORPAY' | 'PAYU' | 'MOCK';
  body: unknown;
  rawBody?: string;
  signatureHeader: string;
}): Promise<{ duplicate: boolean; processed: boolean; message: string }> {
  const adapter = getPaymentAdapterForProvider(input.provider === 'MOCK' ? 'MOCK' : input.provider);
  const rawBody =
    input.rawBody || (typeof input.body === 'string' ? input.body : JSON.stringify(input.body ?? {}));

  if (!adapter.verifyWebhook(input.body, input.signatureHeader, rawBody)) {
    throw new AppError(400, 'INVALID_SIGNATURE', 'Webhook signature verification failed');
  }

  const extProvider: WebhookProvider = input.provider;
  const idempotencyKey = extractExternalEventId(input.provider, input.body);
  const { duplicate: deliveryDup } = await ingestWebhook({
    provider: extProvider,
    idempotencyKey,
    payload: input.body,
  });
  if (deliveryDup) {
    return { duplicate: true, processed: false, message: 'Duplicate delivery (ingest ledger)' };
  }

  const verification = adapter.parseWebhook(input.body);
  if (!verification.valid) {
    return { duplicate: false, processed: false, message: 'Event type ignored or unrecognized' };
  }

  const providerOrderId =
    verification.providerOrderId || extractProviderOrderId(input.body);
  if (!providerOrderId) {
    await auditLog({
      action: 'WEBHOOK_UNKNOWN',
      entity: 'PaymentEvent',
      metadata: { reason: 'missing_order_id', provider: input.provider },
    });
    return { duplicate: false, processed: false, message: 'No provider order id in payload' };
  }

  const payment = await prisma.paymentTransaction.findFirst({
    where: { providerOrderId },
    include: { donation: true },
  });

  if (!payment) {
    await auditLog({
      action: 'WEBHOOK_UNKNOWN',
      entity: 'PaymentEvent',
      metadata: { providerOrderId, provider: input.provider },
    });
    return { duplicate: false, processed: false, message: 'Unknown order — acknowledged' };
  }

  const externalEventId = extractExternalEventId(input.provider, input.body);
  const existingEvent = await prisma.paymentEvent.findFirst({
    where: { transactionId: payment.id, externalEventId },
  });
  if (existingEvent) {
    return { duplicate: true, processed: false, message: 'Duplicate payment event' };
  }

  await prisma.paymentEvent.create({
    data: {
      transactionId: payment.id,
      eventType: (input.body as { event?: string }).event || 'payment.webhook',
      externalEventId,
      payload: input.body as object,
      signature: input.signatureHeader || null,
      processedAt: new Date(),
    },
  });

  if (verification.status === 'CAPTURED' && payment.status === 'CREATED') {
    try {
      await confirmPayment(
        payment.donationId,
        verification.providerPaymentId || `unknown_${payment.id}`
      );
    } catch (err) {
      await auditLog({
        action: 'WEBHOOK_PROCESSING_ERROR',
        entity: 'Donation',
        entityId: payment.donationId,
        metadata: { error: String(err), provider: input.provider },
      });
      throw err;
    }
    return { duplicate: false, processed: true, message: 'Payment captured and donation advanced' };
  }

  if (verification.status === 'FAILED') {
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    await prisma.donation.update({
      where: { id: payment.donationId },
      data: { status: 'PAYMENT_FAILED' },
    });
    return { duplicate: false, processed: true, message: 'Payment failure recorded' };
  }

  if (verification.status === 'AUTHORIZED') {
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { status: 'AUTHORIZED' },
    });
    return { duplicate: false, processed: true, message: 'Payment authorized' };
  }

  return { duplicate: false, processed: false, message: 'No state transition for current payment status' };
}
