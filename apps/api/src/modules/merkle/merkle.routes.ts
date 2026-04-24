import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { requirePlatformStaff } from '../../middleware/rbac';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { sealCurrentBatch, verifyProof } from './merkle.service';
import { anchorBatch, anchorAllSealed } from './anchor.service';

export const merkleRouter = Router();

// ── Get batches (admin) ──
merkleRouter.get(
  '/batches',
  authenticate,
  requirePlatformStaff,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const [items, total] = await Promise.all([
        prisma.merkleBatch.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            anchor: { select: { txHash: true, blockNumber: true, status: true, attempts: true, updatedAt: true } },
          },
        }),
        prisma.merkleBatch.count(),
      ]);
      paginated(res, items, total, page, limit);
    } catch (e) {
      next(e);
    }
  }
);

// ── Trigger seal batch (admin) ──
merkleRouter.post(
  '/seal',
  authenticate,
  requirePlatformStaff,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await sealCurrentBatch();
      success(res, result);
    } catch (e) {
      next(e);
    }
  }
);

// ── Trigger anchor (admin) ──
merkleRouter.post(
  '/anchor/:batchId',
  authenticate,
  requirePlatformStaff,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await anchorBatch(req.params.batchId);
      success(res, result);
    } catch (e) {
      next(e);
    }
  }
);

// ── Anchor all sealed (admin) ──
merkleRouter.post(
  '/anchor-all',
  authenticate,
  requirePlatformStaff,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const force = req.query.force === '1' || req.body?.force === true;
      const results = await anchorAllSealed(force);
      success(res, results);
    } catch (e) {
      next(e);
    }
  }
);

// ── Get proof for a donation (public) ──
merkleRouter.get('/proof/:donationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(
      JSON.stringify({
        module: 'merkle',
        event: 'proof_fetch_requested',
        donationId: req.params.donationId,
        at: new Date().toISOString(),
      })
    );
    const leaf = await prisma.merkleLeaf.findUnique({
      where: { donationId: req.params.donationId },
      include: {
        batch: {
          include: {
            anchor: {
              select: {
                txHash: true,
                network: true,
                contractAddr: true,
                blockNumber: true,
                status: true,
                attempts: true,
                updatedAt: true,
              },
            },
          },
        },
        donation: {
          select: { donationRef: true, amountPaise: true, goldQuantityMg: true, createdAt: true },
        },
      },
    });
    if (!leaf) {
      const donation = await prisma.donation.findUnique({
        where: { id: req.params.donationId },
        select: { id: true, donationRef: true, status: true, createdAt: true },
      });
      if (!donation) throw new AppError(404, 'NOT_FOUND', 'Proof not found for this donation');
      throw new AppError(
        404,
        'PROOF_NOT_READY',
        `Proof is not available yet for donation status ${donation.status}`
      );
    }

    success(res, {
      donationRef: leaf.donation.donationRef,
      leafHash: leaf.leafHash,
      leafIndex: leaf.leafIndex,
      proof: leaf.proofPath,
      merkleRoot: leaf.batch.merkleRoot,
      batchNumber: leaf.batch.batchNumber,
      batchStatus: leaf.batch.status,
      sealedAt: leaf.batch.sealedAt,
      anchoredAt: leaf.batch.anchoredAt,
      blockchain: leaf.batch.anchor
        ? {
            txHash: leaf.batch.anchor.txHash,
            network: leaf.batch.anchor.network,
            contract: leaf.batch.anchor.contractAddr,
            blockNumber: leaf.batch.anchor.blockNumber,
            status: leaf.batch.anchor.status,
            attempts: leaf.batch.anchor.attempts,
            lastUpdatedAt: leaf.batch.anchor.updatedAt,
          }
        : null,
    });
    console.log(
      JSON.stringify({
        module: 'merkle',
        event: 'proof_fetch_succeeded',
        donationId: req.params.donationId,
        batchStatus: leaf.batch.status,
        at: new Date().toISOString(),
      })
    );
  } catch (e) {
    next(e);
  }
});

// ── Verify a proof (public) ──
merkleRouter.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { leafHash, proof, merkleRoot } = req.body;
    const valid = verifyProof(leafHash, proof, merkleRoot);
    console.log(
      JSON.stringify({
        module: 'merkle',
        event: 'proof_verify',
        valid,
        at: new Date().toISOString(),
      })
    );
    success(res, { valid });
  } catch (e) {
    next(e);
  }
});
