import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { auditLog } from '../../utils/auditLog';

export const institutionRouter = Router();

// ── PUBLIC: List active institutions ──
institutionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const where = { status: 'ACTIVE' as const };
    const [items, total] = await Promise.all([
      prisma.institutionProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          publicName: true,
          type: true,
          description: true,
          logoUrl: true,
          city: true,
          state: true,
          publicPageSlug: true,
          upiId: true,
          has80G: true,
        },
        orderBy: { publicName: 'asc' },
      }),
      prisma.institutionProfile.count({ where }),
    ]);
    paginated(res, items, total, page, limit);
  } catch (e) {
    next(e);
  }
});

// ── PUBLIC: Get institution by slug ──
institutionRouter.get('/slug/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inst = await prisma.institutionProfile.findFirst({
      where: { publicPageSlug: req.params.slug, status: 'ACTIVE' },
      select: {
        id: true,
        publicName: true,
        type: true,
        description: true,
        logoUrl: true,
        websiteUrl: true,
        city: true,
        state: true,
        upiId: true,
        has80G: true,
        campaigns: {
          where: { isActive: true },
          select: { id: true, name: true, description: true },
        },
      },
    });
    if (!inst) throw new AppError(404, 'NOT_FOUND', 'Institution not found');
    success(res, inst);
  } catch (e) {
    next(e);
  }
});

// ── PUBLIC: Get institution by id ──
institutionRouter.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inst = await prisma.institutionProfile.findFirst({
      where: { id: req.params.id, status: 'ACTIVE' },
      select: {
        id: true,
        publicName: true,
        upiId: true,
        publicPageSlug: true,
      },
    });
    if (!inst) throw new AppError(404, 'NOT_FOUND', 'Institution not found');
    success(res, inst);
  } catch (e) {
    next(e);
  }
});

// ── PORTAL: Onboard institution ──
institutionRouter.post(
  '/portal/onboard',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (existing) throw new AppError(409, 'ALREADY_EXISTS', 'Institution profile already exists');

      const {
        legalName,
        publicName,
        type,
        registrationNo,
        pan,
        gst,
        has80G,
        cert80GNumber,
        cert80GExpiry,
        description,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        authorizedSignatory,
        signatoryDesignation,
        signatoryPhone,
        signatoryEmail,
        publicPageSlug,
        upiId,
      } = req.body;

      const profile = await prisma.institutionProfile.create({
        data: {
          userId: req.auth!.userId,
          legalName,
          publicName,
          type,
          registrationNo,
          pan,
          gst,
          has80G: has80G || false,
          cert80GNumber,
          cert80GExpiry: cert80GExpiry ? new Date(cert80GExpiry) : null,
          description,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          authorizedSignatory,
          signatoryDesignation,
          signatoryPhone,
          signatoryEmail,
          publicPageSlug,
          upiId,
          status: 'DRAFT',
        },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'CREATE',
        entity: 'InstitutionProfile',
        entityId: profile.id,
        after: profile,
        req,
      });

      success(res, profile, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Submit for review ──
institutionRouter.post(
  '/portal/submit',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      if (profile.status !== 'DRAFT' && profile.status !== 'REJECTED') {
        throw new AppError(400, 'INVALID_STATE', `Cannot submit from status ${profile.status}`);
      }

      const updated = await prisma.institutionProfile.update({
        where: { id: profile.id },
        data: { status: 'SUBMITTED' },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'STATUS_CHANGE',
        entity: 'InstitutionProfile',
        entityId: profile.id,
        before: { status: profile.status },
        after: { status: 'SUBMITTED' },
        req,
      });

      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Update donation UPI ID ──
institutionRouter.patch(
  '/portal/upi',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');

      const rawUpiId = typeof req.body?.upiId === 'string' ? req.body.upiId.trim().toLowerCase() : '';
      const upiId = rawUpiId || null;
      if (upiId && !/^[a-z0-9.\-_]{2,}@[a-z]{2,}$/i.test(upiId)) {
        throw new AppError(400, 'INVALID_UPI_ID', 'Enter a valid UPI ID (example: temple@okicici)');
      }

      const updated = await prisma.institutionProfile.update({
        where: { id: profile.id },
        data: { upiId },
        select: { id: true, upiId: true, updatedAt: true },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'UPDATE',
        entity: 'InstitutionProfile',
        entityId: profile.id,
        before: { upiId: profile.upiId },
        after: { upiId: updated.upiId },
        req,
      });

      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Dashboard ──
institutionRouter.get(
  '/portal/dashboard',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rangeParam = parseInt(String(req.query.rangeDays || '30'), 10);
      const rangeDays = [7, 30, 90].includes(rangeParam) ? rangeParam : 30;
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');

      const [totalDonations, totalGoldMg, recentDonations] = await Promise.all([
        prisma.donation.count({
          where: {
            institutionId: profile.id,
            status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
          },
        }),
        prisma.goldLedgerEntry.aggregate({
          where: { institutionId: profile.id, entryType: 'CREDIT' },
          _sum: { goldQuantityMg: true },
        }),
        prisma.donation.findMany({
          where: { institutionId: profile.id },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            donationRef: true,
            amountPaise: true,
            goldQuantityMg: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

      const fromDate = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
      const donorCounts = await prisma.donation.groupBy({
        by: ['donorId'],
        where: {
          institutionId: profile.id,
          status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
        },
        _count: { donorId: true },
      });
      const donorCounts30d = await prisma.donation.groupBy({
        by: ['donorId'],
        where: {
          institutionId: profile.id,
          status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
          createdAt: { gte: fromDate },
        },
        _count: { donorId: true },
      });

      const donationRows = await prisma.donation.findMany({
        where: {
          institutionId: profile.id,
          status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
          createdAt: { gte: fromDate },
        },
        select: { donorId: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      });
      const days: string[] = [];
      const dayCursor = new Date(fromDate);
      for (let i = 0; i < rangeDays; i += 1) {
        days.push(dayCursor.toISOString().slice(0, 10));
        dayCursor.setDate(dayCursor.getDate() + 1);
      }
      const donationsByDay: Record<string, number> = {};
      const donorsByDay: Record<string, Set<string>> = {};
      days.forEach((d) => {
        donationsByDay[d] = 0;
        donorsByDay[d] = new Set<string>();
      });
      for (const row of donationRows) {
        const key = row.createdAt.toISOString().slice(0, 10);
        if (donationsByDay[key] === undefined) continue;
        donationsByDay[key] += 1;
        donorsByDay[key].add(row.donorId);
      }
      const donorTrend = days.map((d) => ({
        day: d,
        donations: donationsByDay[d],
        activeDonors: donorsByDay[d].size,
      }));

      success(res, {
        institutionId: profile.id,
        publicName: profile.publicName,
        publicPageSlug: profile.publicPageSlug,
        upiId: profile.upiId,
        status: profile.status,
        totalDonations,
        totalGoldMg: totalGoldMg._sum.goldQuantityMg || 0,
        uniqueDonors: donorCounts.length,
        repeatDonors: donorCounts.filter((row) => row._count.donorId >= 2).length,
        activeDonorsInRange: donorCounts30d.length,
        rangeDays,
        donorTrend,
        recentDonations,
      });
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Ledger ──
institutionRouter.get(
  '/portal/ledger',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const where = { institutionId: profile.id };
      const [entries, total] = await Promise.all([
        prisma.goldLedgerEntry.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.goldLedgerEntry.count({ where }),
      ]);
      paginated(res, entries, total, page, limit);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Add bank details ──
institutionRouter.post(
  '/portal/bank',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');

      const bank = await prisma.institutionBank.create({
        data: {
          institutionId: profile.id,
          accountName: req.body.accountName,
          accountNumber: req.body.accountNumber,
          ifsc: req.body.ifsc,
          bankName: req.body.bankName,
          isPrimary: req.body.isPrimary || false,
        },
      });

      success(res, bank, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Request redemption ──
institutionRouter.post(
  '/portal/redemptions',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile || profile.status !== 'ACTIVE')
        throw new AppError(400, 'INVALID_STATE', 'Institution not active');

      const redemption = await prisma.redemptionRequest.create({
        data: {
          institutionId: profile.id,
          goldQuantityMg: req.body.goldQuantityMg,
          notes: req.body.notes,
        },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'CREATE',
        entity: 'RedemptionRequest',
        entityId: redemption.id,
        after: redemption,
        req,
      });

      success(res, redemption, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);
