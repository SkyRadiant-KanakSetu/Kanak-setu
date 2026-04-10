import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

export const donorRouter = Router();

// Get own profile
donorRouter.get(
  '/me',
  authenticate,
  requireRole('DONOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.donorProfile.findUnique({
        where: { userId: req.auth!.userId },
        include: { user: { select: { email: true, phone: true } } },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'Donor profile not found');
      success(res, profile);
    } catch (e) {
      next(e);
    }
  }
);

// Update profile
donorRouter.put(
  '/me',
  authenticate,
  requireRole('DONOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, pan, address, city, state, pincode } = req.body;
      const profile = await prisma.donorProfile.update({
        where: { userId: req.auth!.userId },
        data: { firstName, lastName, pan, address, city, state, pincode },
      });
      success(res, profile);
    } catch (e) {
      next(e);
    }
  }
);

// Donation history
donorRouter.get(
  '/me/donations',
  authenticate,
  requireRole('DONOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const where = {
        donorId: (await prisma.donorProfile.findUnique({ where: { userId: req.auth!.userId } }))!
          .id,
      };
      const [donations, total] = await Promise.all([
        prisma.donation.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            institution: { select: { publicName: true } },
            certificates: { select: { id: true, type: true, status: true } },
          },
        }),
        prisma.donation.count({ where }),
      ]);
      paginated(res, donations, total, page, limit);
    } catch (e) {
      next(e);
    }
  }
);
