import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { success } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

export const verifyRouter = Router();

// ── Public: verify certificate by reference ──
verifyRouter.get('/:ref', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { verificationRef: req.params.ref },
      include: {
        donation: {
          select: {
            donationRef: true,
            amountPaise: true,
            goldQuantityMg: true,
            createdAt: true,
            status: true,
            institution: { select: { publicName: true } },
            merkleLeaf: {
              select: {
                leafHash: true,
                batch: {
                  select: {
                    batchNumber: true,
                    merkleRoot: true,
                    status: true,
                    anchor: { select: { txHash: true, network: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!cert) throw new AppError(404, 'NOT_FOUND', 'Certificate not found');

    success(res, {
      serialNumber: cert.serialNumber,
      type: cert.type,
      status: cert.status,
      issuedAt: cert.issuedAt,
      donation: {
        ref: cert.donation.donationRef,
        amountPaise: cert.donation.amountPaise,
        goldQuantityMg: cert.donation.goldQuantityMg,
        institution: cert.donation.institution.publicName,
        date: cert.donation.createdAt,
        blockchain: cert.donation.merkleLeaf?.batch?.anchor
          ? {
              txHash: cert.donation.merkleLeaf.batch.anchor.txHash,
              network: cert.donation.merkleLeaf.batch.anchor.network,
              merkleRoot: cert.donation.merkleLeaf.batch.merkleRoot,
              leafHash: cert.donation.merkleLeaf.leafHash,
            }
          : null,
      },
    });
  } catch (e) {
    next(e);
  }
});
