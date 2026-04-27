import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { success, paginated } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { authenticate } from '../../middleware/auth';
import { requirePlatformStaff } from '../../middleware/rbac';

export const agroRouter = Router();
agroRouter.use(authenticate, requirePlatformStaff);

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function riskFromWeather(maxTempC: number, humidityPct: number, rainfallMm: number) {
  if (rainfallMm >= 20 || (maxTempC >= 40 && humidityPct >= 80)) return 'HIGH';
  if (rainfallMm >= 8 || maxTempC >= 35 || humidityPct >= 75) return 'MEDIUM';
  return 'LOW';
}

function actionFromSignal(score: number): 'BUY' | 'SELL' | 'HOLD' {
  if (score >= 0.62) return 'BUY';
  if (score <= 0.42) return 'SELL';
  return 'HOLD';
}

agroRouter.get('/commodities', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.agroCommodity.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        defaultShelfLifeDays: true,
      },
    });
    success(res, items);
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/markets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = String(req.query.region || '').trim();
    const type = String(req.query.type || '').trim().toUpperCase();
    const where: Record<string, unknown> = {};
    if (region) where.region = region;
    if (type) where.type = type;

    const items = await prisma.agroMarket.findMany({
      where,
      orderBy: [{ region: 'asc' }, { name: 'asc' }],
    });
    success(res, items);
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/ingest/mandi-prices', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      commodityCode,
      commodityName,
      category = 'vegetable',
      marketName,
      region,
      priceMin,
      priceMax,
      priceModal,
      observedAt,
      source = 'manual',
    } = req.body || {};

    if (!commodityCode || !marketName || !region) {
      throw new AppError(400, 'INVALID_INPUT', 'commodityCode, marketName, and region are required');
    }

    const code = String(commodityCode).trim().toUpperCase();
    const commodity = await prisma.agroCommodity.upsert({
      where: { code },
      update: {
        name: String(commodityName || code),
        category: String(category || 'vegetable').toLowerCase(),
      },
      create: {
        code,
        name: String(commodityName || code),
        category: String(category || 'vegetable').toLowerCase(),
        defaultShelfLifeDays: 7,
      },
    });

    const market = await prisma.agroMarket.create({
      data: {
        name: String(marketName),
        region: String(region),
        type: 'MANDI',
      },
    });

    const row = await prisma.agroMandiPrice.create({
      data: {
        commodityId: commodity.id,
        marketId: market.id,
        priceMin: toNumber(priceMin),
        priceMax: toNumber(priceMax),
        priceModal: toNumber(priceModal),
        observedAt: observedAt ? new Date(observedAt) : new Date(),
        source: String(source),
      },
      include: {
        commodity: { select: { code: true, name: true } },
        market: { select: { name: true, region: true } },
      },
    });

    success(res, row, undefined, 201);
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/ingest/weather', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { region, forecastDate, maxTempC, minTempC, humidityPct, rainfallMm, riskLevel, source = 'manual' } =
      req.body || {};

    if (!region || !forecastDate) {
      throw new AppError(400, 'INVALID_INPUT', 'region and forecastDate are required');
    }

    const inferredRisk = riskLevel
      ? String(riskLevel).toUpperCase()
      : riskFromWeather(toNumber(maxTempC), toNumber(humidityPct), toNumber(rainfallMm));

    const snapshot = await prisma.agroWeatherSnapshot.create({
      data: {
        region: String(region),
        forecastDate: new Date(forecastDate),
        maxTempC: maxTempC == null ? null : toNumber(maxTempC),
        minTempC: minTempC == null ? null : toNumber(minTempC),
        humidityPct: humidityPct == null ? null : toNumber(humidityPct),
        rainfallMm: rainfallMm == null ? null : toNumber(rainfallMm),
        riskLevel: inferredRisk as any,
        source: String(source),
      },
    });

    success(res, snapshot, undefined, 201);
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/intelligence/storage-plan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commodityCode = String(req.query.commodityCode || '').trim().toUpperCase();
    if (!commodityCode) throw new AppError(400, 'INVALID_INPUT', 'commodityCode is required');

    const commodity = await prisma.agroCommodity.findUnique({ where: { code: commodityCode } });
    if (!commodity) throw new AppError(404, 'NOT_FOUND', 'Commodity not found');

    const profiles = await prisma.agroStorageProfile.findMany({
      where: { commodityId: commodity.id },
      orderBy: { maxDays: 'desc' },
    });

    const fallback = {
      mode: commodity.defaultShelfLifeDays <= 5 ? 'cold' : 'dry',
      maxDays: commodity.defaultShelfLifeDays,
      conditions: commodity.defaultShelfLifeDays <= 5 ? '8-12C, 85-90% RH' : 'cool, dry, ventilated',
    };

    const best = profiles[0]
      ? {
          mode: profiles[0].mode.toLowerCase(),
          maxDays: profiles[0].maxDays,
          conditions: `${profiles[0].tempRange || 'N/A'}; ${profiles[0].humidityRange || 'N/A'}`,
        }
      : fallback;

    success(res, {
      commodity: { code: commodity.code, name: commodity.name },
      recommendation: best,
      alternatives: profiles.map((p) => ({
        mode: p.mode.toLowerCase(),
        maxDays: p.maxDays,
        conditions: `${p.tempRange || 'N/A'}; ${p.humidityRange || 'N/A'}`,
        riskNote: p.spoilageRiskNote,
      })),
    });
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/intelligence/market-signal', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commodityCode = String(req.query.commodityCode || '').trim().toUpperCase();
    const sourceRegion = String(req.query.sourceRegion || '').trim();
    const targetMarket = String(req.query.targetMarket || '').trim();
    if (!commodityCode || !sourceRegion || !targetMarket) {
      throw new AppError(400, 'INVALID_INPUT', 'commodityCode, sourceRegion, and targetMarket are required');
    }

    const commodity = await prisma.agroCommodity.findUnique({ where: { code: commodityCode } });
    if (!commodity) throw new AppError(404, 'NOT_FOUND', 'Commodity not found');

    const [latestPrices, weather] = await Promise.all([
      prisma.agroMandiPrice.findMany({
        where: {
          commodityId: commodity.id,
          market: { region: sourceRegion },
        },
        orderBy: { observedAt: 'desc' },
        take: 5,
      }),
      prisma.agroWeatherSnapshot.findFirst({
        where: { region: sourceRegion },
        orderBy: { forecastDate: 'asc' },
      }),
    ]);

    if (!latestPrices.length) {
      throw new AppError(404, 'NO_DATA', 'No mandi price data for this commodity and region');
    }

    const avgModal =
      latestPrices.reduce((sum, row) => sum + Number(row.priceModal), 0) / Math.max(1, latestPrices.length);
    const latest = Number(latestPrices[0].priceModal);
    const trendScore = avgModal === 0 ? 0.5 : Math.min(1, Math.max(0, 0.5 + (avgModal - latest) / avgModal));
    const riskPenalty =
      weather?.riskLevel === 'HIGH' ? 0.24 : weather?.riskLevel === 'MEDIUM' ? 0.12 : 0.03;
    const score = Math.max(0, Math.min(1, trendScore - riskPenalty + 0.2));
    const action = actionFromSignal(score);

    const expectedBuy = latest;
    const expectedSell = Math.max(expectedBuy, expectedBuy * (1 + 0.08 + score * 0.1));
    const margin = expectedSell - expectedBuy;

    success(res, {
      commodity: commodity.code,
      sourceRegion,
      targetMarket,
      action,
      confidence: Number(score.toFixed(3)),
      expected: {
        buyPricePerKg: Number(expectedBuy.toFixed(2)),
        sellPricePerKg: Number(expectedSell.toFixed(2)),
        marginPerKg: Number(margin.toFixed(2)),
      },
      riskLevel: weather?.riskLevel?.toLowerCase() || 'unknown',
      assumptions: [
        'Demand remains within 7-day historical range',
        'Transit SLA is met for target market dispatch',
      ],
    });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/recommendations/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commodityCode = String(req.body?.commodityCode || '').trim().toUpperCase();
    const sourceRegion = String(req.body?.sourceRegion || '').trim();
    const targetMarket = String(req.body?.targetMarket || '').trim();
    const quantityTons = toNumber(req.body?.quantityTons, 1);

    if (!commodityCode || !sourceRegion || !targetMarket) {
      throw new AppError(400, 'INVALID_INPUT', 'commodityCode, sourceRegion, and targetMarket are required');
    }

    const commodity = await prisma.agroCommodity.findUnique({ where: { code: commodityCode } });
    if (!commodity) throw new AppError(404, 'NOT_FOUND', 'Commodity not found');

    const prices = await prisma.agroMandiPrice.findMany({
      where: { commodityId: commodity.id, market: { region: sourceRegion } },
      orderBy: { observedAt: 'desc' },
      take: 8,
    });
    if (!prices.length) throw new AppError(404, 'NO_DATA', 'No mandi price data found for recommendation');

    const latest = Number(prices[0].priceModal);
    const avg = prices.reduce((sum, p) => sum + Number(p.priceModal), 0) / prices.length;
    const delta = avg === 0 ? 0 : (avg - latest) / avg;
    const score = Math.max(0, Math.min(1, 0.55 + delta));
    const action = actionFromSignal(score);
    const confidence = Number(score.toFixed(3));

    const buy = latest;
    const sell = latest * (1 + 0.07 + score * 0.09);
    const marginMin = Math.max(0, sell - buy - 0.5);
    const marginMax = Math.max(marginMin, sell - buy + 0.9);
    const validUntil = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const recommendation = await prisma.agroRecommendation.create({
      data: {
        commodityId: commodity.id,
        sourceRegion,
        targetMarket,
        action: action as any,
        confidence,
        expectedMarginMin: marginMin,
        expectedMarginMax: marginMax,
        riskFlags: [
          confidence < 0.6 ? 'Low confidence due to weak trend signal' : null,
          'Weather variability can shift intraday pricing',
        ].filter(Boolean),
        assumptions: ['Data window: last 8 mandi snapshots', 'Normal logistics conditions'],
        payload: {
          commodity: commodity.code,
          quantityTons,
          targetBuyRangePerKg: `${(buy * 0.98).toFixed(2)}-${(buy * 1.02).toFixed(2)}`,
          targetSellRangePerKg: `${(sell * 0.97).toFixed(2)}-${(sell * 1.03).toFixed(2)}`,
        },
        validUntil,
        createdByAgent: 'sky-radiant-master-agent',
      },
    });

    success(
      res,
      {
        recommendationId: recommendation.id,
        commodity: commodity.code,
        sourceRegion,
        targetMarket,
        action,
        confidence,
        recommendedQuantityTons: quantityTons,
        targetBuyRangePerKg: `${(buy * 0.98).toFixed(2)}-${(buy * 1.02).toFixed(2)}`,
        targetSellRangePerKg: `${(sell * 0.97).toFixed(2)}-${(sell * 1.03).toFixed(2)}`,
        expectedMarginPerKg: `${marginMin.toFixed(2)}-${marginMax.toFixed(2)}`,
        riskFlags: recommendation.riskFlags,
        assumptions: recommendation.assumptions,
        validUntil,
      },
      undefined,
      201
    );
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/recommendations/latest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = Math.min(100, parseInt(String(req.query.limit || '20'), 10));
    const commodityCode = String(req.query.commodityCode || '').trim().toUpperCase();

    let commodityId: string | undefined;
    if (commodityCode) {
      const commodity = await prisma.agroCommodity.findUnique({ where: { code: commodityCode } });
      if (!commodity) throw new AppError(404, 'NOT_FOUND', 'Commodity not found');
      commodityId = commodity.id;
    }

    const where = commodityId ? { commodityId } : {};
    const [items, total] = await Promise.all([
      prisma.agroRecommendation.findMany({
        where,
        include: { commodity: { select: { code: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.agroRecommendation.count({ where }),
    ]);

    paginated(res, items, total, page, limit);
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/recommendations/:id/outcome', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const recommendation = await prisma.agroRecommendation.findUnique({ where: { id } });
    if (!recommendation) throw new AppError(404, 'NOT_FOUND', 'Recommendation not found');

    const created = await prisma.agroRecommendationOutcome.create({
      data: {
        recommendationId: id,
        executed: Boolean(req.body?.executed),
        executedQtyTons: req.body?.executedQtyTons == null ? null : toNumber(req.body.executedQtyTons),
        realizedBuyAvg: req.body?.realizedBuyAvg == null ? null : toNumber(req.body.realizedBuyAvg),
        realizedSellAvg: req.body?.realizedSellAvg == null ? null : toNumber(req.body.realizedSellAvg),
        realizedMargin: req.body?.realizedMargin == null ? null : toNumber(req.body.realizedMargin),
        spoilagePct: req.body?.spoilagePct == null ? null : toNumber(req.body.spoilagePct),
        notes: req.body?.notes ? String(req.body.notes) : null,
      },
    });

    success(res, created, undefined, 201);
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/seo/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic, targetPersona, primaryKeyword, secondaryKeywords = [] } = req.body || {};
    if (!topic || !targetPersona || !primaryKeyword) {
      throw new AppError(400, 'INVALID_INPUT', 'topic, targetPersona, and primaryKeyword are required');
    }

    const job = await prisma.agroSeoContentJob.create({
      data: {
        topic: String(topic),
        targetPersona: String(targetPersona),
        primaryKeyword: String(primaryKeyword),
        secondaryKeywords,
      },
    });
    success(res, job, undefined, 201);
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/seo/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = Math.min(100, parseInt(String(req.query.limit || '20'), 10));
    const status = String(req.query.status || '').trim().toUpperCase();
    const where = status ? { status: status as any } : {};

    const [items, total] = await Promise.all([
      prisma.agroSeoContentJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.agroSeoContentJob.count({ where }),
    ]);

    paginated(res, items, total, page, limit);
  } catch (e) {
    next(e);
  }
});
