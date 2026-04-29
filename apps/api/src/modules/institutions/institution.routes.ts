import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { auditLog } from '../../utils/auditLog';
import { z } from 'zod';

export const institutionRouter = Router();

const ENABLE_PORTAL_REFINEMENTS = process.env.ENABLE_INSTITUTION_PORTAL_REFINEMENTS === '1';
const ENABLE_FAITH_SETTINGS = process.env.ENABLE_FAITH_CONTEXT_SETTINGS === '1';
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T/;

const spiritualFunctionPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  functionType: z
    .enum(['PUJA', 'SEVA', 'FESTIVAL', 'COMMUNITY_SERVICE', 'EDUCATION', 'HEALTH', 'OTHER'])
    .optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
  frequency: z.string().trim().max(80).optional().nullable(),
  nextDate: z
    .string()
    .refine((value) => isoDateRegex.test(value) || isoDateTimeRegex.test(value), 'Invalid nextDate format')
    .optional()
    .nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  state: z.string().trim().max(120).optional().nullable(),
  isPublic: z.boolean().optional(),
});

const institutionTaskPayloadSchema = z.object({
  functionId: z.string().cuid().optional().nullable(),
  title: z.string().trim().min(2).max(140),
  taskType: z
    .enum(['PRE_EVENT', 'EVENT_DAY', 'POST_EVENT', 'DONOR_FOLLOWUP', 'COMPLIANCE', 'OTHER'])
    .optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']).optional(),
  dueDate: z
    .string()
    .refine((value) => isoDateRegex.test(value) || isoDateTimeRegex.test(value), 'Invalid dueDate format')
    .optional()
    .nullable(),
  assigneeName: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

const faithSettingsPayloadSchema = z.object({
  faithTradition: z.string().trim().max(80).optional().nullable(),
  terminologyDonationLabel: z.string().trim().min(2).max(40).optional().nullable(),
  terminologyDonorLabel: z.string().trim().min(2).max(40).optional().nullable(),
  sacredCalendarHighlights: z
    .array(
      z.object({
        title: z.string().trim().min(2).max(100),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        note: z.string().trim().max(240).optional(),
      })
    )
    .max(20)
    .optional()
    .nullable(),
});

function assertPortalRefinementsEnabled() {
  if (!ENABLE_PORTAL_REFINEMENTS) {
    throw new AppError(404, 'FEATURE_DISABLED', 'Institution portal refinements are not enabled');
  }
}

function parseOptionalIsoDate(input?: string | null) {
  if (!input) return null;
  const value = new Date(input);
  if (Number.isNaN(value.getTime())) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid date format. Use ISO date format.');
  }
  return value;
}

function getPortalLabels(profile: {
  terminologyDonationLabel: string | null;
  terminologyDonorLabel: string | null;
}) {
  return {
    donationLabel: (profile.terminologyDonationLabel || 'Donation').trim() || 'Donation',
    donorLabel: (profile.terminologyDonorLabel || 'Donor').trim() || 'Donor',
  };
}

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
      assertPortalRefinementsEnabled();
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
      const includeDemographics = String(req.query.includeDemographics || '') === '1';
      const includeGeoDistribution = String(req.query.includeGeoDistribution || '') === '1';
      const labels = getPortalLabels(profile);

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
        labels,
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
        ...(includeDemographics && ENABLE_PORTAL_REFINEMENTS
          ? {
              demographics: {
                uniqueDonors: donorCounts.length,
                repeatDonors: donorCounts.filter((row) => row._count.donorId >= 2).length,
              },
            }
          : {}),
        ...(includeGeoDistribution && ENABLE_PORTAL_REFINEMENTS
          ? {
              geo: donorDirectory.reduce(
                (acc: Record<string, number>, donor: any) => {
                  const state = String(donor.state || 'Unknown').trim() || 'Unknown';
                  acc[state] = (acc[state] || 0) + 1;
                  return acc;
                },
                {}
              ),
            }
          : {}),
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
      if (!ENABLE_FAITH_SETTINGS) {
        throw new AppError(404, 'FEATURE_DISABLED', 'Faith context settings are not enabled');
      }
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
      success(res, {
        ...profile,
        terminologyDonationLabel:
          (profile.terminologyDonationLabel || 'Donation').trim() || 'Donation',
        terminologyDonorLabel: (profile.terminologyDonorLabel || 'Donor').trim() || 'Donor',
        sacredCalendarHighlights: profile.sacredCalendarHighlights || [],
      });
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
      if (!ENABLE_FAITH_SETTINGS) {
        throw new AppError(404, 'FEATURE_DISABLED', 'Faith context settings are not enabled');
      }
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const parsed = faithSettingsPayloadSchema.safeParse(req.body || {});
      if (!parsed.success) {
        throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues[0]?.message || 'Invalid payload');
      }
      const payload = parsed.data;
      const updated = await prisma.institutionProfile.update({
        where: { id: profile.id },
        data: {
          faithTradition: payload.faithTradition || null,
          terminologyDonationLabel: payload.terminologyDonationLabel || null,
          terminologyDonorLabel: payload.terminologyDonorLabel || null,
          sacredCalendarHighlights: payload.sacredCalendarHighlights || [],
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
      await auditLog({
        userId: req.auth!.userId,
        action: 'UPDATE',
        entity: 'InstitutionProfileFaithSettings',
        entityId: profile.id,
        before: {
          faithTradition: profile.faithTradition,
          terminologyDonationLabel: profile.terminologyDonationLabel,
          terminologyDonorLabel: profile.terminologyDonorLabel,
          sacredCalendarHighlights: profile.sacredCalendarHighlights,
        },
        after: updated,
        req,
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
      assertPortalRefinementsEnabled();
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const parsed = spiritualFunctionPayloadSchema.safeParse(req.body || {});
      if (!parsed.success) {
        throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues[0]?.message || 'Invalid payload');
      }
      const payload = parsed.data;
      const created = await prisma.spiritualFunction.create({
        data: {
          institutionId: profile.id,
          name: payload.name,
          functionType: payload.functionType || 'OTHER',
          status: payload.status || 'ACTIVE',
          frequency: payload.frequency || null,
          nextDate: parseOptionalIsoDate(payload.nextDate),
          description: payload.description || null,
          city: payload.city || null,
          state: payload.state || null,
          isPublic: payload.isPublic ?? true,
        },
      });
      await auditLog({
        userId: req.auth!.userId,
        action: 'CREATE',
        entity: 'SpiritualFunction',
        entityId: created.id,
        after: created,
        req,
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
      assertPortalRefinementsEnabled();
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const existing = await prisma.spiritualFunction.findFirst({
        where: { id: req.params.id, institutionId: profile.id },
      });
      if (!existing) throw new AppError(404, 'NOT_FOUND', 'Function not found');
      const parsed = spiritualFunctionPayloadSchema.partial().safeParse(req.body || {});
      if (!parsed.success) {
        throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues[0]?.message || 'Invalid payload');
      }
      const payload = parsed.data;
      const updated = await prisma.spiritualFunction.update({
        where: { id: existing.id },
        data: {
          name: payload.name ?? existing.name,
          functionType: payload.functionType ?? existing.functionType,
          status: payload.status ?? existing.status,
          frequency: payload.frequency ?? existing.frequency,
          nextDate:
            payload.nextDate !== undefined ? parseOptionalIsoDate(payload.nextDate) : existing.nextDate,
          description: payload.description ?? existing.description,
          city: payload.city ?? existing.city,
          state: payload.state ?? existing.state,
          isPublic: payload.isPublic ?? existing.isPublic,
        },
      });
      await auditLog({
        userId: req.auth!.userId,
        action: 'UPDATE',
        entity: 'SpiritualFunction',
        entityId: existing.id,
        before: existing,
        after: updated,
        req,
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
      assertPortalRefinementsEnabled();
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
      assertPortalRefinementsEnabled();
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const parsed = institutionTaskPayloadSchema.safeParse(req.body || {});
      if (!parsed.success) {
        throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues[0]?.message || 'Invalid payload');
      }
      const payload = parsed.data;
      const created = await prisma.institutionTask.create({
        data: {
          institutionId: profile.id,
          functionId: payload.functionId || null,
          title: payload.title,
          taskType: payload.taskType || 'OTHER',
          status: payload.status || 'TODO',
          dueDate: parseOptionalIsoDate(payload.dueDate),
          assigneeName: payload.assigneeName || null,
          notes: payload.notes || null,
        },
      });
      await auditLog({
        userId: req.auth!.userId,
        action: 'CREATE',
        entity: 'InstitutionTask',
        entityId: created.id,
        after: created,
        req,
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
      assertPortalRefinementsEnabled();
      const profile = await prisma.institutionProfile.findUnique({
        where: { userId: req.auth!.userId },
      });
      if (!profile) throw new AppError(404, 'NOT_FOUND', 'No institution profile');
      const existing = await prisma.institutionTask.findFirst({
        where: { id: req.params.id, institutionId: profile.id },
      });
      if (!existing) throw new AppError(404, 'NOT_FOUND', 'Task not found');
      const parsed = institutionTaskPayloadSchema.partial().safeParse(req.body || {});
      if (!parsed.success) {
        throw new AppError(400, 'VALIDATION_ERROR', parsed.error.issues[0]?.message || 'Invalid payload');
      }
      const payload = parsed.data;
      const updated = await prisma.institutionTask.update({
        where: { id: existing.id },
        data: {
          functionId: payload.functionId ?? existing.functionId,
          title: payload.title ?? existing.title,
          taskType: payload.taskType ?? existing.taskType,
          status: payload.status ?? existing.status,
          dueDate:
            payload.dueDate !== undefined ? parseOptionalIsoDate(payload.dueDate) : existing.dueDate,
          assigneeName: payload.assigneeName ?? existing.assigneeName,
          notes: payload.notes ?? existing.notes,
        },
      });
      await auditLog({
        userId: req.auth!.userId,
        action: 'UPDATE',
        entity: 'InstitutionTask',
        entityId: existing.id,
        before: existing,
        after: updated,
        req,
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
      assertPortalRefinementsEnabled();
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
      assertPortalRefinementsEnabled();
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
