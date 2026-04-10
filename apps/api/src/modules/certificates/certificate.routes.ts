import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../config/prisma';
import { success } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

export const certificateRouter = Router();

// ── Get certificates for a donation ──
certificateRouter.get(
  '/donation/:donationId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certs = await prisma.certificate.findMany({
        where: { donationId: req.params.donationId },
        orderBy: { createdAt: 'desc' },
      });
      success(res, certs);
    } catch (e) {
      next(e);
    }
  }
);

// ── Download certificate ──
certificateRouter.get(
  '/:id/download',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cert = await prisma.certificate.findUnique({ where: { id: req.params.id } });
      if (!cert) throw new AppError(404, 'NOT_FOUND', 'Certificate not found');
      if (!cert.fileUrl) throw new AppError(404, 'NOT_READY', 'Certificate file not yet generated');
      // In production, stream the actual file. For MVP, return the URL.
      success(res, { downloadUrl: cert.fileUrl, serialNumber: cert.serialNumber });
    } catch (e) {
      next(e);
    }
  }
);
