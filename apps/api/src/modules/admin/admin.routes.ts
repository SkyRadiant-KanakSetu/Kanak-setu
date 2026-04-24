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

function buildLocalAssistantReply(query: string) {
  const q = query.toLowerCase();
  if (q.includes('anchor') || q.includes('merkle') || q.includes('blockchain')) {
    return [
      'To stabilize blockchain operations: 1) check anchor wallet balance, 2) seal pending donations, 3) anchor sealed batches, and 4) verify recent tx hashes in the Blockchain tab.',
      'If you see ANCHOR_FAILED rows, they are often historical retries-exhausted batches. Prioritize newly sealed batches first, then retry failed ones selectively.',
    ].join('\n\n');
  }
  if (q.includes('donation') || q.includes('payment') || q.includes('utr')) {
    return [
      'For donation/payment issues: verify donation status progression (CREATED -> COMPLETED/BATCHED/ANCHORED), confirm UTR/providerPaymentId presence, and inspect latest payment event in Admin > Donations.',
      'If many failures appear, check webhook delivery statuses and run reconciliation from Admin > Webhooks.',
    ].join('\n\n');
  }
  if (q.includes('institution') || q.includes('upi')) {
    return [
      'For institution onboarding and UPI support: validate status transitions, ensure UPI ID format is valid, and confirm donor link/slug correctness before sharing.',
      'When donors report wrong QR target, re-save institution UPI ID and retest `/give/[slug]` resolution.',
    ].join('\n\n');
  }
  if (q.includes('deploy') || q.includes('live') || q.includes('production')) {
    return [
      'Recommended production sequence: git pull -> db:generate -> build api/admin/donor/institution -> pm2 startOrReload --update-env -> pm2 save.',
      'After deploy, always run health check and one end-to-end donation + proof check before declaring success.',
    ].join('\n\n');
  }
  return [
    'I can help with operations, donations, institutions, blockchain anchoring, deploy checks, and troubleshooting.',
    'Ask me a specific task such as: "Why is proof not found?", "How to fix anchor failed batches?", or "Give go-live checklist for today."',
  ].join('\n\n');
}

async function askOpenAiAdminAssistant(query: string, adminContext: Record<string, unknown>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_ADMIN_ASSISTANT_MODEL || 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are the Kanak Setu platform master admin assistant. Give practical, safe, concise operational guidance. Do not fabricate metrics. If data is missing, say so and provide next checks.',
        },
        {
          role: 'user',
          content: `Admin context:\n${JSON.stringify(adminContext)}\n\nAdmin question:\n${query}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }
  const payload = (await response.json()) as any;
  return payload?.choices?.[0]?.message?.content?.trim() || null;
}

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

// ── Master admin assistant (guidance only) ──
adminRouter.post('/assistant/query', requirePlatformStaff, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = String(req.body?.query || '').trim();
    if (!query || query.length < 3) {
      throw new AppError(400, 'INVALID_INPUT', 'Please provide a meaningful query');
    }

    const [activeInstitutions, completedDonations, pendingReviewCount, anchorSummary] = await Promise.all([
      prisma.institutionProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.donation.count({ where: { status: { in: ['COMPLETED', 'BATCHED', 'ANCHORED'] as any } } }),
      prisma.institutionProfile.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
      prisma.merkleBatch.groupBy({ by: ['status'], _count: { status: true } }),
    ]);

    const context = {
      activeInstitutions,
      completedDonations,
      pendingReviewCount,
      anchorSummary: anchorSummary.map((row) => ({ status: row.status, count: row._count.status })),
      timestamp: new Date().toISOString(),
    };

    let answer: string | null = null;
    try {
      answer = await askOpenAiAdminAssistant(query, context);
    } catch {
      answer = null;
    }
    if (!answer) answer = buildLocalAssistantReply(query);

    await auditLog({
      userId: req.auth!.userId,
      action: 'READ',
      entity: 'AdminAssistant',
      entityId: 'query',
      metadata: { query, usedLlm: Boolean(process.env.OPENAI_API_KEY) },
      req,
    });

    success(res, { answer, context });
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
