import { Router, type Request, type Response, type NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { success } from '../../utils/response';

export const internalRouter = Router();

type Pm2Row = {
  name?: string;
  monit?: { memory?: number };
  pm2_env?: { status?: string; pm_uptime?: number; restart_time?: number };
};

const LOG_DIR = process.env.KANAK_LOG_DIR || '/opt/kanak-setu/logs';
const DEPLOY_TELEMETRY_FILE =
  process.env.TELEMETRY_LOG_PATH || path.join(LOG_DIR, 'deploy-telemetry.log');
const LAST_VERIFY_FILE = path.join(LOG_DIR, 'last-verify.json');

function requireInternalSecret(req: Request, _res: Response, next: NextFunction) {
  const configured = process.env.INTERNAL_API_SECRET;
  if (!configured) {
    return next(new AppError(503, 'INTERNAL_SECRET_MISSING', 'Internal API secret is not configured'));
  }
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token || token !== configured) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid internal API secret'));
  }
  next();
}

internalRouter.use(requireInternalSecret);

internalRouter.get('/pm2-status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { execSync } = await import('child_process');
    const raw = execSync('pm2 jlist', { encoding: 'utf8' });
    const apps = JSON.parse(raw) as Pm2Row[];
    const targetApps = new Set([
      'kanak-api',
      'kanak-donor-web',
      'kanak-institution-web',
      'kanak-admin-web',
      'kanak-outbox-worker',
    ]);
    const rows = apps
      .filter((p) => Boolean(p.name && targetApps.has(p.name)))
      .map((p) => ({
        name: p.name,
        status: p.pm2_env?.status || 'unknown',
        uptimeMs: p.pm2_env?.pm_uptime ? Date.now() - Number(p.pm2_env.pm_uptime) : 0,
        memoryRssBytes: p.monit?.memory || 0,
        restartCount: p.pm2_env?.restart_time || 0,
      }));
    success(res, rows);
  } catch (error) {
    next(new AppError(500, 'PM2_STATUS_FAILED', `Unable to read PM2 status: ${(error as Error).message}`));
  }
});

type DeployEntry = {
  timestamp: string;
  type: string;
  deployType: string;
  installSkipped: string;
  installSkippedBool: boolean;
  durationSeconds: number;
};

function parseDeployTelemetryLine(line: string): DeployEntry {
  const parts = line.split('|').map((part) => part.trim());
  const timestamp = parts[0] || '';
  const type = parts[1] || '';
  const installField = parts[2] || '';
  const durationField = parts[3] || '0';
  const installSkippedBool =
    installField.toLowerCase() === 'yes' ||
    installField.includes('install_skipped=yes') ||
    installField.includes('yes');
  const durationSeconds = parseInt(String(durationField).replace(/\D/g, '') || '0', 10) || 0;
  return {
    timestamp,
    type,
    deployType: type,
    installSkipped: installField,
    installSkippedBool,
    durationSeconds,
  };
}

internalRouter.get('/deploy-telemetry', (req: Request, res: Response, next: NextFunction) => {
  try {
    const limitRaw = Number(req.query.limit ?? req.query.take ?? 10);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 50) : 10;
    if (!fs.existsSync(DEPLOY_TELEMETRY_FILE)) {
      return next(new AppError(404, 'NOT_FOUND', 'Telemetry log not found'));
    }
    const raw = fs.readFileSync(DEPLOY_TELEMETRY_FILE, 'utf8');
    const lines = raw
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(-limit)
      .reverse();
    const entries = lines.map(parseDeployTelemetryLine);
    const withInstall = entries.filter((e) => !e.installSkippedBool);
    const withoutInstall = entries.filter((e) => e.installSkippedBool);
    const avg = (arr: DeployEntry[]) =>
      arr.length ? Math.round(arr.reduce((s, e) => s + e.durationSeconds, 0) / arr.length) : null;
    const avgWithSkip = avg(withoutInstall);
    const avgWithInstall = avg(withInstall);
    const savingsSeconds = (avgWithInstall ?? 0) - (avgWithSkip ?? 0);
    success(res, {
      entries: entries.map((e) => ({
        timestamp: e.timestamp,
        deployType: e.deployType,
        installSkipped: e.installSkipped,
        durationSeconds: e.durationSeconds,
      })),
      summary: {
        total: entries.length,
        skipRate: entries.length
          ? Math.round((withoutInstall.length / entries.length) * 100)
          : 0,
        avgDurationWithSkip: avgWithSkip,
        avgDurationWithInstall: avgWithInstall,
        savingsSeconds,
      },
    });
  } catch (error) {
    next(new AppError(500, 'INTERNAL_ERROR', `Deploy telemetry read failed: ${(error as Error).message}`));
  }
});

internalRouter.get('/last-verify', (_req: Request, res: Response) => {
  if (!fs.existsSync(LAST_VERIFY_FILE)) {
    success(res, { found: false, message: 'No verification result file found yet.' });
    return;
  }
  const raw = fs.readFileSync(LAST_VERIFY_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  success(res, { found: true, ...parsed });
});

internalRouter.get('/db-health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    success(res, { ok: true, checkedAt: new Date().toISOString() });
  } catch (error) {
    next(new AppError(500, 'DB_HEALTH_FAILED', `Database check failed: ${(error as Error).message}`));
  }
});

internalRouter.get('/operator-activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const daysRaw = Number(req.query.days || 14);
    const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.min(daysRaw, 90) : 14;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const [totalActions, grouped, uniqueOperators, lastAction] = await Promise.all([
      prisma.operatorActionLog.count({ where: { createdAt: { gte: since } } }),
      prisma.operatorActionLog.groupBy({
        by: ['actionType'],
        where: { createdAt: { gte: since } },
        _count: { actionType: true },
      }),
      prisma.operatorActionLog.findMany({
        where: { createdAt: { gte: since } },
        distinct: ['operatorId'],
        select: { operatorId: true },
      }),
      prisma.operatorActionLog.findFirst({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);
    const byType: Record<string, number> = {};
    for (const row of grouped) byType[row.actionType] = row._count.actionType;
    success(res, {
      window_days: days,
      total_actions: totalActions,
      by_type: byType,
      unique_operators: uniqueOperators.length,
      last_action_at: lastAction?.createdAt?.toISOString() || null,
    });
  } catch (error) {
    next(
      new AppError(500, 'OPERATOR_ACTIVITY_FAILED', `Unable to read operator activity: ${(error as Error).message}`)
    );
  }
});

internalRouter.get('/dead-letters', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limitRaw = Number(req.query.limit || 20);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 20;
    const rows = await prisma.outboxDeadLetter.findMany({
      where: { dismissedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    success(res, rows);
  } catch (error) {
    next(new AppError(500, 'DEAD_LETTER_LIST_FAILED', `Unable to list dead letters: ${(error as Error).message}`));
  }
});

internalRouter.post('/dead-letters/:id/retry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const row = await prisma.outboxDeadLetter.findUnique({ where: { id } });
    if (!row) return next(new AppError(404, 'NOT_FOUND', 'Dead letter not found'));

    const event = await prisma.$transaction(async (tx) => {
      await tx.outboxDeadLetter.update({
        where: { id },
        data: { dismissedAt: new Date() },
      });
      return tx.outboxEvent.create({
        data: {
          eventType: row.eventType,
          aggregateId: row.aggregateId,
          aggregateType: row.aggregateType,
          payload: row.payload as Prisma.InputJsonValue,
          status: 'pending',
          attempts: 0,
        },
      });
    });

    success(res, { retried: true, outboxEventId: event.id });
  } catch (error) {
    next(new AppError(500, 'DEAD_LETTER_RETRY_FAILED', `Unable to retry dead letter: ${(error as Error).message}`));
  }
});

internalRouter.post('/dead-letters/:id/dismiss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const row = await prisma.outboxDeadLetter.findUnique({ where: { id } });
    if (!row) return next(new AppError(404, 'NOT_FOUND', 'Dead letter not found'));
    await prisma.outboxDeadLetter.update({
      where: { id },
      data: { dismissedAt: new Date() },
    });
    success(res, { dismissed: true });
  } catch (error) {
    next(
      new AppError(500, 'DEAD_LETTER_DISMISS_FAILED', `Unable to dismiss dead letter: ${(error as Error).message}`)
    );
  }
});

