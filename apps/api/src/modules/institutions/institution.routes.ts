import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { auditLog } from '../../utils/auditLog';

export const institutionRouter = Router();

function calculateAgeFromDob(dateOfBirth: Date | null | undefined) {
  if (!dateOfBirth) return null;
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  const hasBirthdayPassed =
    monthDiff > 0 || (monthDiff === 0 && today.getDate() >= dateOfBirth.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age >= 0 ? age : null;
}

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

      const [totalDonations, totalGoldMg, recentDonations, donorSnapshotDonations] = await Promise.all([
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
            donor: {
              select: {
                firstName: true,
                lastName: true,
                profession: true,
                dateOfBirth: true,
                city: true,
                state: true,
                pincode: true,
                address: true,
                user: {
                  select: {
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        }),
        prisma.donation.findMany({
          where: {
            institutionId: profile.id,
            status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
          },
          take: 100,
          orderBy: { createdAt: 'desc' },
          select: {
            donorId: true,
            createdAt: true,
            donor: {
              select: {
                firstName: true,
                lastName: true,
                profession: true,
                dateOfBirth: true,
                city: true,
                state: true,
                pincode: true,
                address: true,
                user: {
                  select: {
                    email: true,
                    phone: true,
                  },
                },
              },
            },
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

      const donorDirectoryMap = new Map<string, any>();
      for (const row of donorSnapshotDonations) {
        if (!row.donor || donorDirectoryMap.has(row.donorId)) continue;
        donorDirectoryMap.set(row.donorId, {
          donorId: row.donorId,
          firstName: row.donor.firstName,
          lastName: row.donor.lastName,
          email: row.donor.user.email,
          phone: row.donor.user.phone,
          profession: row.donor.profession,
          age: calculateAgeFromDob(row.donor.dateOfBirth),
          dateOfBirth: row.donor.dateOfBirth,
          address: row.donor.address,
          city: row.donor.city,
          state: row.donor.state,
          pincode: row.donor.pincode,
          latestDonationAt: row.createdAt,
        });
      }
      const donorDirectory = Array.from(donorDirectoryMap.values());

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
        donorDirectory,
        recentDonations,
      });
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Faith settings ──
institutionRouter.get(
  '/portal/settings-faith',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
        select: {
          id: true,
          faithTradition: true,
          terminologyDonationLabel: true,
          terminologyDonorLabel: true,
          sacredCalendarHighlights: true,
        },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      success(res, profile);
    } catch (e) {
      next(e);
    }
  }
);

institutionRouter.patch(
  '/portal/settings-faith',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const updated = await prisma.institutionProfile.update({
        where: { id: profile.id },
        data: {
          faithTradition: req.body.faithTradition || null,
          terminologyDonationLabel: req.body.terminologyDonationLabel || null,
          terminologyDonorLabel: req.body.terminologyDonorLabel || null,
          sacredCalendarHighlights: req.body.sacredCalendarHighlights || null,
        },
        select: {
          id: true,
          faithTradition: true,
          terminologyDonationLabel: true,
          terminologyDonorLabel: true,
          sacredCalendarHighlights: true,
          updatedAt: true,
        },
      });
      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Spiritual functions ──
institutionRouter.get(
  '/portal/functions',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const status = String(req.query.status || '').trim();
      const list = await prisma.spiritualFunction.findMany({
        where: {
          institutionId: profile.id,
          ...(status ? { status: status as any } : {}),
        },
        orderBy: [{ nextDate: 'asc' }, { createdAt: 'desc' }],
      });
      success(res, list);
    } catch (e) {
      next(e);
    }
  }
);

institutionRouter.post(
  '/portal/functions',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      if (!req.body?.name) throw new AppError(400, 'VALIDATION_ERROR', 'Function name is required');
      const created = await prisma.spiritualFunction.create({
        data: {
          institutionId: profile.id,
          name: String(req.body.name),
          functionType: (req.body.functionType || 'OTHER') as any,
          status: (req.body.status || 'ACTIVE') as any,
          frequency: req.body.frequency || null,
          nextDate: req.body.nextDate ? new Date(req.body.nextDate) : null,
          description: req.body.description || null,
          city: req.body.city || null,
          state: req.body.state || null,
          isPublic: req.body.isPublic ?? true,
        },
      });
      success(res, created, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);

institutionRouter.patch(
  '/portal/functions/:id',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const existing = await prisma.spiritualFunction.findFirst({
        where: { id: req.params.id, institutionId: profile.id },
      });
      if (!existing) throw new AppError(404, 'NOT_FOUND', 'Function not found');
      const updated = await prisma.spiritualFunction.update({
        where: { id: existing.id },
        data: {
          name: req.body.name ?? existing.name,
          functionType: (req.body.functionType ?? existing.functionType) as any,
          status: (req.body.status ?? existing.status) as any,
          frequency: req.body.frequency ?? existing.frequency,
          nextDate: req.body.nextDate ? new Date(req.body.nextDate) : existing.nextDate,
          description: req.body.description ?? existing.description,
          city: req.body.city ?? existing.city,
          state: req.body.state ?? existing.state,
          isPublic: req.body.isPublic ?? existing.isPublic,
        },
      });
      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Operations tasks ──
institutionRouter.get(
  '/portal/tasks',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const status = String(req.query.status || '').trim();
      const items = await prisma.institutionTask.findMany({
        where: {
          institutionId: profile.id,
          ...(status ? { status: status as any } : {}),
        },
        include: {
          spiritualFunction: { select: { id: true, name: true, functionType: true } },
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      });
      success(res, items);
    } catch (e) {
      next(e);
    }
  }
);

institutionRouter.post(
  '/portal/tasks',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      if (!req.body?.title) throw new AppError(400, 'VALIDATION_ERROR', 'Task title is required');
      const created = await prisma.institutionTask.create({
        data: {
          institutionId: profile.id,
          functionId: req.body.functionId || null,
          title: String(req.body.title),
          taskType: (req.body.taskType || 'OTHER') as any,
          status: (req.body.status || 'TODO') as any,
          dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
          assigneeName: req.body.assigneeName || null,
          notes: req.body.notes || null,
        },
      });
      success(res, created, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);

institutionRouter.patch(
  '/portal/tasks/:id',
  authenticate,
  requireRole('INSTITUTION_ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const existing = await prisma.institutionTask.findFirst({
        where: { id: req.params.id, institutionId: profile.id },
      });
      if (!existing) throw new AppError(404, 'NOT_FOUND', 'Task not found');
      const updated = await prisma.institutionTask.update({
        where: { id: existing.id },
        data: {
          functionId: req.body.functionId ?? existing.functionId,
          title: req.body.title ?? existing.title,
          taskType: (req.body.taskType ?? existing.taskType) as any,
          status: (req.body.status ?? existing.status) as any,
          dueDate: req.body.dueDate ? new Date(req.body.dueDate) : existing.dueDate,
          assigneeName: req.body.assigneeName ?? existing.assigneeName,
          notes: req.body.notes ?? existing.notes,
        },
      });
      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── PORTAL: Donor demographics / geo distribution ──
institutionRouter.get(
  '/portal/demographics',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const rows = await prisma.donation.findMany({
        where: {
          institutionId: profile.id,
          status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
        },
        select: {
          amountPaise: true,
          donor: {
            select: {
              dateOfBirth: true,
              profession: true,
              city: true,
              state: true,
              user: { select: { phone: true, email: true } },
            },
          },
        },
      });
      const ageBands = { under25: 0, from25to40: 0, from41to60: 0, above60: 0, unknown: 0 };
      const profession: Record<string, number> = {};
      let totalAmountPaise = 0;
      for (const row of rows) {
        totalAmountPaise += row.amountPaise || 0;
        const age = calculateAgeFromDob(row.donor?.dateOfBirth);
        if (age === null) ageBands.unknown += 1;
        else if (age < 25) ageBands.under25 += 1;
        else if (age <= 40) ageBands.from25to40 += 1;
        else if (age <= 60) ageBands.from41to60 += 1;
        else ageBands.above60 += 1;
        const p = String(row.donor?.profession || 'Unknown').trim() || 'Unknown';
        profession[p] = (profession[p] || 0) + 1;
      }
      const topProfessions = Object.entries(profession)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([label, count]) => ({ label, count }));
      success(res, {
        totalDonations: rows.length,
        totalAmountPaise,
        ageBands,
        topProfessions,
      });
    } catch (e) {
      next(e);
    }
  }
);

institutionRouter.get(
  '/portal/geo-distribution',
  authenticate,
  requireRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const rows = await prisma.donation.findMany({
        where: {
          institutionId: profile.id,
          status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] },
        },
        select: {
          amountPaise: true,
          donor: { select: { city: true, state: true } },
        },
      });
      const bucket: Record<string, { state: string; city: string; donations: number; amountPaise: number }> = {};
      for (const row of rows) {
        const state = (row.donor?.state || 'Unknown').trim() || 'Unknown';
        const city = (row.donor?.city || 'Unknown').trim() || 'Unknown';
        const key = `${state}__${city}`;
        if (!bucket[key]) bucket[key] = { state, city, donations: 0, amountPaise: 0 };
        bucket[key].donations += 1;
        bucket[key].amountPaise += row.amountPaise || 0;
      }
      const cities = Object.values(bucket).sort((a, b) => b.donations - a.donations);
      const stateTotals: Record<string, { state: string; donations: number; amountPaise: number }> = {};
      for (const city of cities) {
        if (!stateTotals[city.state]) stateTotals[city.state] = { state: city.state, donations: 0, amountPaise: 0 };
        stateTotals[city.state].donations += city.donations;
        stateTotals[city.state].amountPaise += city.amountPaise;
      }
      success(res, {
        states: Object.values(stateTotals).sort((a, b) => b.donations - a.donations),
        cities: cities.slice(0, 100),
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
