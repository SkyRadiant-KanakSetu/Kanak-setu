// ============================================================
// PAYMENT GATEWAY ADAPTER — Provider-agnostic interface
// ============================================================

import crypto from 'crypto';

export interface PaymentOrder {
  providerOrderId: string;
  amountPaise: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface PaymentVerification {
  valid: boolean;
  providerPaymentId?: string;
  providerOrderId?: string;
  status: 'CAPTURED' | 'FAILED' | 'AUTHORIZED';
  amountPaise?: number;
}

export interface PaymentGatewayAdapter {
  createOrder(
    amountPaise: number,
    receiptId: string,
    metadata?: Record<string, string>
  ): Promise<PaymentOrder>;
  verifyWebhook(body: unknown, signature: string, rawBody?: string): boolean;
  parseWebhook(body: unknown): PaymentVerification;
  initiateRefund(providerPaymentId: string, amountPaise: number): Promise<{ refundId: string }>;
}

function stableStringify(body: unknown): string {
  if (typeof body === 'string') return body;
  return JSON.stringify(body);
}

function timingSafeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

// ── MOCK ADAPTER (for MVP dev) ──
export class MockPaymentAdapter implements PaymentGatewayAdapter {
  async createOrder(amountPaise: number, receiptId: string): Promise<PaymentOrder> {
    return {
      providerOrderId: `mock_order_${Date.now()}`,
      amountPaise,
      currency: 'INR',
      metadata: { receiptId },
    };
  }

  verifyWebhook(_body: unknown, _signature: string, _rawBody?: string): boolean {
    return true;
  }

  parseWebhook(body: Record<string, unknown>): PaymentVerification {
    return {
      valid: true,
      providerPaymentId: (body.paymentId as string) || `mock_pay_${Date.now()}`,
      providerOrderId: body.providerOrderId as string | undefined,
      status: (body.status as PaymentVerification['status']) || 'CAPTURED',
      amountPaise: body.amount as number | undefined,
    };
  }

  async initiateRefund(_providerPaymentId: string, _amountPaise: number) {
    return { refundId: `mock_refund_${Date.now()}` };
  }
}

// ── RAZORPAY ──
export class RazorpayAdapter implements PaymentGatewayAdapter {
  async createOrder(_amountPaise: number, _receiptId: string): Promise<PaymentOrder> {
    throw new Error('Razorpay createOrder not wired — use server-side order API or MOCK for dev');
  }

  verifyWebhook(body: unknown, signature: string, rawBody?: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!secret) {
      return process.env.NODE_ENV !== 'production';
    }
    const payload = rawBody ?? stableStringify(body);
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return timingSafeEqual(expected, signature || '');
  }

  parseWebhook(body: unknown): PaymentVerification {
    const b = body as {
      event?: string;
      payload?: { payment?: { entity?: Record<string, unknown> } };
    };
    const ent = b.payload?.payment?.entity;
    if (!ent) {
      return { valid: false, status: 'FAILED' };
    }
    const orderId = ent.order_id as string | undefined;
    const paymentId = ent.id as string | undefined;
    const status = ent.status as string | undefined;
    const amount = ent.amount as number | undefined;
    if (b.event === 'payment.captured' || status === 'captured') {
      return {
        valid: true,
        providerPaymentId: paymentId,
        providerOrderId: orderId,
        status: 'CAPTURED',
        amountPaise: amount,
      };
    }
    if (b.event === 'payment.failed' || status === 'failed') {
      return {
        valid: true,
        providerPaymentId: paymentId,
        providerOrderId: orderId,
        status: 'FAILED',
        amountPaise: amount,
      };
    }
    if (b.event === 'payment.authorized' || status === 'authorized') {
      return {
        valid: true,
        providerPaymentId: paymentId,
        providerOrderId: orderId,
        status: 'AUTHORIZED',
        amountPaise: amount,
      };
    }
    return { valid: false, status: 'FAILED' };
  }

  async initiateRefund(_id: string, _amt: number): Promise<{ refundId: string }> {
    throw new Error('Razorpay refund not implemented');
  }
}

// ── PAYU (India) — verify pattern varies by product; extend with official hash rules ──
export class PayUAdapter implements PaymentGatewayAdapter {
  async createOrder(_amountPaise: number, _receiptId: string): Promise<PaymentOrder> {
    throw new Error('PayU createOrder not wired — use PayU hosted flow');
  }

  verifyWebhook(body: unknown, signature: string, _rawBody?: string): boolean {
    const salt = process.env.PAYU_MERCHANT_SALT || '';
    const key = process.env.PAYU_MERCHANT_KEY || '';
    if (!salt || !key) {
      return process.env.NODE_ENV !== 'production';
    }
    const b = body as Record<string, string>;
    const received = signature || b.hash || b.HASH || '';
    if (!received) return false;
    const status = b.status || b.unmappedstatus || '';
    // Reverse hash (success / webhook): salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const shash = `${salt}|${status}||||||${b.udf5 || ''}|${b.udf4 || ''}|${b.udf3 || ''}|${b.udf2 || ''}|${b.udf1 || ''}|${b.email || ''}|${b.firstname || ''}|${b.productinfo || ''}|${b.amount || ''}|${b.txnid || ''}|${key}`;
    const expected = crypto.createHash('sha512').update(shash).digest('hex');
    return timingSafeEqual(expected, received);
  }

  parseWebhook(body: unknown): PaymentVerification {
    const b = body as Record<string, string>;
    const status = (b.status || '').toLowerCase();
    const captured = ['success', 'captured', 'completed'].includes(status);
    const failed = ['failure', 'failed', 'cancelled', 'usercancelled'].includes(status);
    return {
      valid: captured || failed,
      providerPaymentId: b.mihpayid || b.payuMoneyId,
      providerOrderId: b.txnid,
      status: captured ? 'CAPTURED' : failed ? 'FAILED' : 'AUTHORIZED',
      amountPaise: b.amount ? Math.round(parseFloat(b.amount) * 100) : undefined,
    };
  }

  async initiateRefund(_id: string, _amt: number): Promise<{ refundId: string }> {
    throw new Error('PayU refund not implemented');
  }
}

// ── FACTORY ──
export function getPaymentAdapter(): PaymentGatewayAdapter {
  const provider = process.env.PAYMENT_PROVIDER || 'MOCK';
  return getPaymentAdapterForProvider(provider);
}

export function getPaymentAdapterForProvider(provider: string): PaymentGatewayAdapter {
  switch (provider.toUpperCase()) {
    case 'RAZORPAY':
      return new RazorpayAdapter();
    case 'PAYU':
      return new PayUAdapter();
    case 'MOCK':
    default:
      return new MockPaymentAdapter();
  }
}
