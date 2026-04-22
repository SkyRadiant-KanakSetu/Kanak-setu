import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { prisma } from '../../config/prisma';
import { success } from '../../utils/response';
import * as donationService from './donation.service';

export const donationRouter = Router();

// ── Create donation (initiate) ──
donationRouter.post(
  '/',
  authenticate,
  requireRole('DONOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await donationService.initiateDonation({
        donorUserId: req.auth!.userId,
        institutionId: req.body.institutionId,
        campaignId: req.body.campaignId,
        amountPaise: req.body.amountPaise,
        idempotencyKey: req.body.idempotencyKey,
        notes: req.body.notes,
      });
      success(res, result, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);

// ── Confirm payment (client-side verification callback) ──
donationRouter.post(
  '/:id/confirm-payment',
  authenticate,
  requireRole('DONOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await donationService.confirmPayment(
        req.params.id,
        req.body.providerPaymentId,
        req.auth!.userId
      );
      success(res, result);
    } catch (e) {
      next(e);
    }
  }
);

// ── Get donation by ID ──
donationRouter.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donation = await prisma.donation.findUnique({
        where: { id: req.params.id },
        include: {
          institution: { select: { publicName: true } },
          payment: { select: { status: true, providerOrderId: true } },
          vendorOrder: { select: { status: true, goldQuantityMg: true } },
          certificates: { select: { id: true, type: true, status: true, verificationRef: true } },
          merkleLeaf: {
            select: {
              leafHash: true,
              proofPath: true,
              batch: { select: { batchNumber: true, status: true, merkleRoot: true } },
            },
          },
        },
      });
      if (!donation)
        return res
          .status(404)
          .json({ success: false, error: { code: 'NOT_FOUND', message: 'Donation not found' } });
      success(res, donation);
    } catch (e) {
      next(e);
    }
  }
);

// ── Get gold quote (indicative) ──
donationRouter.get('/quote/current', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { getGoldVendorAdapter } = await import('../vendor/vendor.adapter');
    const quote = await getGoldVendorAdapter().getQuote();
    success(res, quote);
  } catch (e) {
    next(e);
  }
});
