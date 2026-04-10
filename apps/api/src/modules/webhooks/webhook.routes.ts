import { Router } from 'express';
import { processPaymentProviderWebhook } from '../payments/paymentWebhook.processor';

export const webhookRouter = Router();

function parseMaybeBuffer(body: unknown): { parsed: unknown; raw: string } {
  if (Buffer.isBuffer(body)) {
    const raw = body.toString('utf8');
    return { parsed: JSON.parse(raw), raw };
  }
  if (typeof body === 'string') {
    return { parsed: JSON.parse(body), raw: body };
  }
  return { parsed: body, raw: JSON.stringify(body ?? {}) };
}

webhookRouter.post('/razorpay', async (req, res, next) => {
  try {
    const { parsed, raw } = parseMaybeBuffer(req.body);
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const result = await processPaymentProviderWebhook({
      provider: 'RAZORPAY',
      body: parsed,
      rawBody: raw,
      signatureHeader: signature,
    });
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

/** PayU typically sends `hash` on the body; header may be empty. */
webhookRouter.post('/payu', async (req, res, next) => {
  try {
    const { parsed, raw } = parseMaybeBuffer(req.body);
    const body = parsed as Record<string, string>;
    const signature =
      (req.headers['x-payu-signature'] as string) || body?.hash || body?.HASH || '';
    const result = await processPaymentProviderWebhook({
      provider: 'PAYU',
      body: parsed,
      rawBody: raw,
      signatureHeader: signature,
    });
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});
