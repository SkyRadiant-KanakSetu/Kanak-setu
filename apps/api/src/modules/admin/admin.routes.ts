import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import {
  requireAuditReaders,
  requireFinance,
  requireInstitutionReviewers,
  requirePlatformStaff,
  requireVendorRetry,
  requireWebhookMonitors,
} from '../../middleware/rbac';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { auditLog } from '../../utils/auditLog';
import { runReconciliationJob } from '../reconciliation/reconciliation.service';

export const adminRouter = Router();
adminRouter.use(authenticate);

// ── Dashboard KPIs ──
adminRouter.get('/dashboard', requirePlatformStaff, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rangeParam = parseInt(String(_req.query.rangeDays || '30'), 10);
    const rangeDays = [7, 30, 90].includes(rangeParam) ? rangeParam : 30;
    const now = new Date();
    const fromDate = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);
    const successfulStatuses = ['COMPLETED', 'BATCHED', 'ANCHORED'] as const;

    const [donors, institutions, donations, pendingInstitutions, failedDonations, newDonorsInRange, amountAggInRange] =
      await Promise.all([
        prisma.donorProfile.count(),
        prisma.institutionProfile.count({ where: { status: 'ACTIVE' } }),
        prisma.donation.count({ where: { status: { in: successfulStatuses as any } } }),
        prisma.institutionProfile.count({
          where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
        }),
        prisma.donation.count({
          where: { status: { in: ['PAYMENT_FAILED', 'VENDOR_FAILED', 'DISPUTED'] } },
        }),
        prisma.donorProfile.count({ where: { createdAt: { gte: fromDate } } }),
        prisma.donation.aggregate({
          where: { status: { in: successfulStatuses as any }, createdAt: { gte: fromDate } },
          _avg: { amountPaise: true },
        }),
      ]);

    const donorCountsInRange = await prisma.donation.groupBy({
      by: ['donorId'],
      where: { status: { in: successfulStatuses as any }, createdAt: { gte: fromDate } },
      _count: { donorId: true },
    });

    const donationRows = await prisma.donation.findMany({
      where: { status: { in: successfulStatuses as any }, createdAt: { gte: fromDate } },
      select: { createdAt: true, donorId: true },
      orderBy: { createdAt: 'asc' },
    });

    const days: string[] = [];
    const dayCursor = new Date(fromDate);
    for (let i = 0; i < rangeDays; i += 1) {
      days.push(dayCursor.toISOString().slice(0, 10));
      dayCursor.setDate(dayCursor.getDate() + 1);
    }
    const donationsByDay: Record<string, number> = {};
    const uniqueDonorSetByDay: Record<string, Set<string>> = {};
    days.forEach((d) => {
      donationsByDay[d] = 0;
      uniqueDonorSetByDay[d] = new Set<string>();
    });
    for (const row of donationRows) {
      const key = row.createdAt.toISOString().slice(0, 10);
      if (donationsByDay[key] === undefined) continue;
      donationsByDay[key] += 1;
      uniqueDonorSetByDay[key].add(row.donorId);
    }
    const donorTrend = days.map((d) => ({
      day: d,
      donations: donationsByDay[d],
      activeDonors: uniqueDonorSetByDay[d].size,
    }));

    const activeDonorsInRange = donorCountsInRange.length;
    const repeatDonorsInRange = donorCountsInRange.filter((row) => row._count.donorId >= 2).length;
    const avgDonationTicketPaiseInRange = Math.round(Number(amountAggInRange._avg.amountPaise || 0));

    success(res, {
      donors,
      institutions,
      donations,
      pendingInstitutions,
      failedDonations,
      rangeDays,
      newDonorsInRange,
      activeDonorsInRange,
      repeatDonorsInRange,
      avgDonationTicketPaiseInRange,
      donorTrend,
    });
  } catch (e) {
    next(e);
  }
});

// ── List institutions (all statuses) ──
adminRouter.get('/institutions', requirePlatformStaff, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const where = status ? { status: status as any } : {};
    const [items, total] = await Promise.all([
      prisma.institutionProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { documents: true, bankDetails: true },
      }),
      prisma.institutionProfile.count({ where }),
    ]);
    paginated(res, items, total, page, limit);
  } catch (e) {
    next(e);
  }
});

// ── Admin onboarding: create institution user + profile ──
adminRouter.post(
  '/institutions/onboard',
  requireInstitutionReviewers,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
        legalName,
        publicName,
        type,
        city,
        state,
        pincode,
        has80G,
        pan,
        registrationNo,
        publicPageSlug,
        upiId,
        notes,
        status,
      } = req.body;

      if (!email || !password || !legalName || !publicName || !type) {
        throw new AppError(
          400,
          'INVALID_INPUT',
          'email, password, legalName, publicName, and type are required'
        );
      }
      if (String(password).length < 8) {
        throw new AppError(400, 'WEAK_PASSWORD', 'Password must be at least 8 characters');
      }

      const allowedTypes = ['TRUST', 'NGO', 'RELIGIOUS', 'FOUNDATION', 'CORPORATE_CSR'];
      if (!allowedTypes.includes(String(type))) {
        throw new AppError(400, 'INVALID_TYPE', 'Invalid institution type');
      }

      const allowedStatuses = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACTIVE', 'SUSPENDED'];
      const targetStatus = allowedStatuses.includes(String(status)) ? String(status) : 'ACTIVE';

      if (publicPageSlug) {
        const existingSlug = await prisma.institutionProfile.findUnique({
          where: { publicPageSlug: String(publicPageSlug) },
          select: { id: true },
        });
        if (existingSlug) throw new AppError(409, 'SLUG_EXISTS', 'Public page slug already exists');
      }

      const { register } = await import('../auth/auth.service');
      const created = await register({
        email: String(email),
        password: String(password),
        role: 'INSTITUTION_ADMIN',
      });

      const profile = await prisma.institutionProfile.create({
        data: {
          userId: created.user.id,
          legalName: String(legalName),
          publicName: String(publicName),
          type: String(type) as any,
          status: targetStatus as any,
          city: city ? String(city) : null,
          state: state ? String(state) : null,
          pincode: pincode ? String(pincode) : null,
          has80G: Boolean(has80G),
          pan: pan ? String(pan) : null,
          registrationNo: registrationNo ? String(registrationNo) : null,
          publicPageSlug: publicPageSlug ? String(publicPageSlug) : null,
          upiId: upiId ? String(upiId) : null,
        },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'CREATE',
        entity: 'InstitutionProfile',
        entityId: profile.id,
        after: { status: profile.status, userId: profile.userId },
        metadata: { onboardedByAdmin: true, notes, email: created.user.email },
        req,
      });

      success(
        res,
        {
          institutionId: profile.id,
          institutionUserId: profile.userId,
          email: created.user.email,
          status: profile.status,
        },
        undefined,
        201
      );
    } catch (e) {
      next(e);
    }
  }
);

// ── Update institution UPI ID ──
adminRouter.patch(
  '/institutions/:id/upi',
  requireInstitutionReviewers,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inst = await prisma.institutionProfile.findUnique({ where: { id: req.params.id } });
      if (!inst) throw new AppError(404, 'NOT_FOUND', 'Institution not found');

      const rawUpiId = typeof req.body?.upiId === 'string' ? req.body.upiId.trim().toLowerCase() : '';
      const upiId = rawUpiId || null;
      if (upiId && !/^[a-z0-9.\-_]{2,}@[a-z]{2,}$/i.test(upiId)) {
        throw new AppError(400, 'INVALID_UPI_ID', 'Enter a valid UPI ID (example: temple@okicici)');
      }

      const updated = await prisma.institutionProfile.update({
        where: { id: req.params.id },
        data: { upiId },
        select: { id: true, upiId: true, updatedAt: true },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'UPDATE',
        entity: 'InstitutionProfile',
        entityId: req.params.id,
        before: { upiId: inst.upiId },
        after: { upiId: updated.upiId },
        req,
      });

      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── Change institution status ──
adminRouter.patch(
  '/institutions/:id/status',
  requireInstitutionReviewers,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, notes } = req.body;
      const validStatuses = ['UNDER_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED'];
      if (!validStatuses.includes(status))
        throw new AppError(400, 'INVALID_STATUS', 'Invalid target status');

      const inst = await prisma.institutionProfile.findUnique({ where: { id: req.params.id } });
      if (!inst) throw new AppError(404, 'NOT_FOUND', 'Institution not found');

      // State transition validation
      const allowed: Record<string, string[]> = {
        SUBMITTED: ['UNDER_REVIEW', 'REJECTED'],
        UNDER_REVIEW: ['ACTIVE', 'REJECTED', 'SUSPENDED'],
        ACTIVE: ['SUSPENDED'],
        SUSPENDED: ['ACTIVE', 'REJECTED'],
        REJECTED: ['UNDER_REVIEW'],
      };
      if (!allowed[inst.status]?.includes(status)) {
        throw new AppError(
          400,
          'INVALID_TRANSITION',
          `Cannot transition from ${inst.status} to ${status}`
        );
      }

      const updated = await prisma.institutionProfile.update({
        where: { id: req.params.id },
        data: { status },
      });

      await prisma.adminReview.create({
        data: {
          institutionId: req.params.id,
          reviewerId: req.auth!.userId,
          action:
            status === 'ACTIVE'
              ? 'APPROVE'
              : status === 'REJECTED'
                ? 'REJECT'
                : status === 'SUSPENDED'
                  ? 'SUSPEND'
                  : 'REVIEW',
          notes,
          fromStatus: inst.status,
          toStatus: status,
        },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'STATUS_CHANGE',
        entity: 'InstitutionProfile',
        entityId: req.params.id,
        before: { status: inst.status },
        after: { status },
        metadata: { notes },
        req,
      });

      success(res, updated);
    } catch (e) {
      next(e);
    }
  }
);

// ── List all donations (admin view) ──
adminRouter.get('/donations', requirePlatformStaff, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const where = status ? { status: status as any } : {};
    const [items, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          donor: { select: { firstName: true, lastName: true } },
          institution: { select: { publicName: true } },
          payment: {
            select: {
              status: true,
              provider: true,
              providerOrderId: true,
              providerPaymentId: true,
              updatedAt: true,
              events: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { eventType: true, createdAt: true },
              },
            },
          },
          vendorOrder: { select: { status: true } },
        },
      }),
      prisma.donation.count({ where }),
    ]);
    paginated(res, items, total, page, limit);
  } catch (e) {
    next(e);
  }
});

// ── Retry vendor allocation for failed donation ──
adminRouter.post(
  '/donations/:id/retry-vendor',
  requireVendorRetry,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donation = await prisma.donation.findUnique({ where: { id: req.params.id } });
      if (!donation || donation.status !== 'VENDOR_FAILED') {
        throw new AppError(400, 'INVALID_STATE', 'Can only retry VENDOR_FAILED donations');
      }
      const { allocateGold } = await import('../donations/donation.service');
      await prisma.donation.update({
        where: { id: req.params.id },
        data: { status: 'PAYMENT_CONFIRMED' },
      });
      const result = await allocateGold(req.params.id);
      await auditLog({
        userId: req.auth!.userId,
        action: 'MANUAL_OVERRIDE',
        entity: 'Donation',
        entityId: req.params.id,
        metadata: { action: 'retry_vendor' },
        req,
      });
      success(res, result);
    } catch (e) {
      next(e);
    }
  }
);

// ── Audit log explorer ──
adminRouter.get(
  '/audit-logs',
  requireAuditReaders,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const entity = req.query.entity as string;
      const where = entity ? { entity } : {};
      const [items, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { email: true, role: true } } },
        }),
        prisma.auditLog.count({ where }),
      ]);
      paginated(res, items, total, page, limit);
    } catch (e) {
      next(e);
    }
  }
);

// ── Reconciliation records ──
adminRouter.get(
  '/reconciliation',
  requireFinance,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const status = req.query.status as string;
      const where = status ? { status } : {};
      const [items, total] = await Promise.all([
        prisma.reconciliationRecord.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.reconciliationRecord.count({ where }),
      ]);
      paginated(res, items, total, page, limit);
    } catch (e) {
      next(e);
    }
  }
);

adminRouter.post('/reconciliation/run', requireFinance, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await runReconciliationJob();
    await auditLog({
      userId: req.auth!.userId,
      action: 'RECONCILIATION_RUN',
      entity: 'ReconciliationRecord',
      entityId: result.runRecordId,
      after: result,
      req,
    });
    success(res, result, undefined, 201);
  } catch (e) {
    next(e);
  }
});

// ── Manual ledger adjustment ──
adminRouter.post(
  '/ledger/adjust',
  requireFinance,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { institutionId, entryType, goldQuantityMg, description } = req.body;
      if (!['ADJUSTMENT', 'REVERSAL', 'DEBIT'].includes(entryType)) {
        throw new AppError(
          400,
          'INVALID_TYPE',
          'Entry type must be ADJUSTMENT, REVERSAL, or DEBIT'
        );
      }

      const lastEntry = await prisma.goldLedgerEntry.findFirst({
        where: { institutionId },
        orderBy: { createdAt: 'desc' },
      });
      const currentBalance = lastEntry?.balanceAfterMg || 0;
      const qty = parseFloat(goldQuantityMg);
      const newBalance =
        entryType === 'DEBIT' || entryType === 'REVERSAL'
          ? Number(currentBalance) - Math.abs(qty)
          : Number(currentBalance) + qty;

      const entry = await prisma.goldLedgerEntry.create({
        data: {
          institutionId,
          entryType: entryType as any,
          goldQuantityMg: Math.abs(qty),
          balanceAfterMg: newBalance,
          description,
          approvedBy: req.auth!.userId,
        },
      });

      await auditLog({
        userId: req.auth!.userId,
        action: 'MANUAL_OVERRIDE',
        entity: 'GoldLedgerEntry',
        entityId: entry.id,
        after: entry,
        metadata: { description },
        req,
      });

      success(res, entry, undefined, 201);
    } catch (e) {
      next(e);
    }
  }
);

// ── Webhook ingest ledger (idempotency audit) ──
adminRouter.get(
  '/webhooks/deliveries',
  requireWebhookMonitors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const provider = req.query.provider as string | undefined;
      const where = provider ? { provider } : {};
      const [items, total] = await Promise.all([
        prisma.webhookDelivery.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            provider: true,
            idempotencyKey: true,
            status: true,
            httpStatus: true,
            errorMessage: true,
            processedAt: true,
            createdAt: true,
          },
        }),
        prisma.webhookDelivery.count({ where }),
      ]);
      paginated(res, items, total, page, limit);
    } catch (e) {
      next(e);
    }
  }
);
