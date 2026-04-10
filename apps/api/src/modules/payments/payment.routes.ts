import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { confirmPayment } from '../donations/donation.service';
import { success } from '../../utils/response';
import { processPaymentProviderWebhook } from './paymentWebhook.processor';

export const paymentRouter = Router();

// ── Payment webhook (uses PAYMENT_PROVIDER env: MOCK | RAZORPAY | PAYU) ──
paymentRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = (process.env.PAYMENT_PROVIDER || 'MOCK').toUpperCase() as
      | 'MOCK'
      | 'RAZORPAY'
      | 'PAYU';
    const signature =
      (req.headers['x-razorpay-signature'] as string) ||
      (req.headers['x-webhook-signature'] as string) ||
      (req.body as Record<string, string>)?.hash ||
      '';
    const result = await processPaymentProviderWebhook({
      provider: provider === 'PAYU' ? 'PAYU' : provider === 'RAZORPAY' ? 'RAZORPAY' : 'MOCK',
      body: req.body,
      signatureHeader: signature,
    });
    success(res, result);
  } catch (e) {
    next(e);
  }
});

// ── Mock payment simulation (dev only) ──
paymentRouter.post('/mock/simulate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ success: false });
    }
    const { donationId, status } = req.body;
    if (status === 'CAPTURED') {
      const result = await confirmPayment(donationId, `mock_pay_${Date.now()}`);
      success(res, result);
    } else {
      await prisma.paymentTransaction.updateMany({
        where: { donationId },
        data: { status: 'FAILED' },
      });
      await prisma.donation.update({
        where: { id: donationId },
        data: { status: 'PAYMENT_FAILED' },
      });
      success(res, { status: 'PAYMENT_FAILED' });
    }
  } catch (e) {
    next(e);
  }
});
