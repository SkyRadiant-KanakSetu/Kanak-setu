import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

export const agroRouter = Router();
agroRouter.use(authenticate);

agroRouter.get('/commodities', async (_req, res, next) => {
  try {
    const rows = await prisma.commodity.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/commodities', async (req, res, next) => {
  try {
    const { code, name, category = 'vegetable', defaultShelfLifeDays = 7 } = req.body || {};
    if (!code || !name) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'code and name are required' } });
    }
    const row = await prisma.commodity.create({
      data: {
        code: String(code).trim().toUpperCase(),
        name: String(name).trim(),
        category: String(category).trim().toLowerCase(),
        defaultShelfLifeDays: Number(defaultShelfLifeDays),
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/markets', async (_req, res, next) => {
  try {
    const rows = await prisma.market.findMany({ orderBy: [{ region: 'asc' }, { name: 'asc' }] });
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/markets', async (req, res, next) => {
  try {
    const { name, region, type = 'MANDI' } = req.body || {};
    if (!name || !region) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'name and region are required' } });
    }
    const row = await prisma.market.create({
      data: {
        name: String(name),
        region: String(region),
        type: String(type).toUpperCase() as any,
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/ingest/mandi-prices', requireRole('ADMIN', 'OPS'), async (req, res, next) => {
  try {
    const { commodityCode, commodityName, category = 'vegetable', marketName, region, priceMin, priceMax, priceModal, observedAt, source = 'manual' } = req.body || {};
    if (!commodityCode || !marketName || !region) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'commodityCode, marketName and region are required' } });
    }

    const code = String(commodityCode).trim().toUpperCase();
    const commodity = await prisma.commodity.upsert({
      where: { code },
      create: {
        code,
        name: String(commodityName || code),
        category: String(category).trim().toLowerCase(),
        defaultShelfLifeDays: 7,
      },
      update: {
        name: String(commodityName || code),
        category: String(category).trim().toLowerCase(),
      },
    });

    const market = await prisma.market.findFirst({
      where: { name: String(marketName), region: String(region) },
    }) || await prisma.market.create({
      data: { name: String(marketName), region: String(region), type: 'MANDI' },
    });

    const row = await prisma.mandiPrice.create({
      data: {
        commodityId: commodity.id,
        marketId: market.id,
        priceMin: Number(priceMin),
        priceMax: Number(priceMax),
        priceModal: Number(priceModal),
        observedAt: observedAt ? new Date(observedAt) : new Date(),
        source: String(source),
      },
      include: { commodity: { select: { code: true, name: true } }, market: { select: { name: true, region: true } } },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/ingest/weather', requireRole('ADMIN', 'OPS'), async (req, res, next) => {
  try {
    const { region, forecastDate, maxTempC, minTempC, humidityPct, rainfallMm, riskLevel, source = 'manual' } = req.body || {};
    if (!region || !forecastDate) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'region and forecastDate are required' } });
    }

    const inferRisk = () => {
      if (riskLevel) return String(riskLevel).toUpperCase();
      const rain = Number(rainfallMm || 0);
      const temp = Number(maxTempC || 0);
      const hum = Number(humidityPct || 0);
      if (rain >= 20 || (temp >= 40 && hum >= 80)) return 'HIGH';
      if (rain >= 8 || temp >= 35 || hum >= 75) return 'MEDIUM';
      return 'LOW';
    };

    const row = await prisma.weatherSnapshot.create({
      data: {
        region: String(region),
        forecastDate: new Date(forecastDate),
        maxTempC: maxTempC == null ? null : Number(maxTempC),
        minTempC: minTempC == null ? null : Number(minTempC),
        humidityPct: humidityPct == null ? null : Number(humidityPct),
        rainfallMm: rainfallMm == null ? null : Number(rainfallMm),
        riskLevel: inferRisk() as any,
        source: String(source),
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/intelligence/storage-plan', async (req, res, next) => {
  try {
    const commodityCode = String(req.query.commodityCode || '').trim().toUpperCase();
    if (!commodityCode) return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'commodityCode is required' } });

    const commodity = await prisma.commodity.findUnique({ where: { code: commodityCode } });
    if (!commodity) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Commodity not found' } });

    const profiles = await prisma.storageProfile.findMany({
      where: { commodityId: commodity.id },
      orderBy: { maxDays: 'desc' },
    });

    const best = profiles[0] || null;
    res.json({
      success: true,
      data: {
        commodity: { code: commodity.code, name: commodity.name },
        recommendation: best
          ? {
              mode: best.mode.toLowerCase(),
              maxDays: best.maxDays,
              conditions: `${best.tempRange || 'N/A'}; ${best.humidityRange || 'N/A'}`,
            }
          : {
              mode: commodity.defaultShelfLifeDays <= 5 ? 'cold' : 'dry',
              maxDays: commodity.defaultShelfLifeDays,
              conditions: commodity.defaultShelfLifeDays <= 5 ? '8-12C; 85-90% RH' : 'cool and dry',
            },
      },
    });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/quality-specs', requireRole('ADMIN', 'OPS'), async (req, res, next) => {
  try {
    const { commodityCode, grade = 'A', parameter, minValue, maxValue, checklistNote } = req.body || {};
    if (!commodityCode || !parameter) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'commodityCode and parameter are required' } });
    }
    const commodity = await prisma.commodity.findUnique({ where: { code: String(commodityCode).trim().toUpperCase() } });
    if (!commodity) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Commodity not found' } });

    const row = await prisma.qualitySpec.create({
      data: {
        commodityId: commodity.id,
        grade: String(grade).toUpperCase(),
        parameter: String(parameter),
        minValue: minValue ? String(minValue) : null,
        maxValue: maxValue ? String(maxValue) : null,
        checklistNote: checklistNote ? String(checklistNote) : null,
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/storage-profiles', requireRole('ADMIN', 'OPS'), async (req, res, next) => {
  try {
    const { commodityCode, mode = 'COLD', tempRange, humidityRange, maxDays, spoilageRiskNote } = req.body || {};
    if (!commodityCode || !maxDays) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'commodityCode and maxDays are required' } });
    }
    const commodity = await prisma.commodity.findUnique({ where: { code: String(commodityCode).trim().toUpperCase() } });
    if (!commodity) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Commodity not found' } });

    const row = await prisma.storageProfile.create({
      data: {
        commodityId: commodity.id,
        mode: String(mode).toUpperCase() as any,
        tempRange: tempRange ? String(tempRange) : null,
        humidityRange: humidityRange ? String(humidityRange) : null,
        maxDays: Number(maxDays),
        spoilageRiskNote: spoilageRiskNote ? String(spoilageRiskNote) : null,
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/recommendations/generate', async (req, res, next) => {
  try {
    const { commodityCode, sourceRegion, targetMarket, quantityTons = 1 } = req.body || {};
    if (!commodityCode || !sourceRegion || !targetMarket) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'commodityCode, sourceRegion, targetMarket are required' },
      });
    }

    const commodity = await prisma.commodity.findUnique({
      where: { code: String(commodityCode).trim().toUpperCase() },
    });
    if (!commodity) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Commodity not found' } });
    }

    const prices = await prisma.mandiPrice.findMany({
      where: {
        commodityId: commodity.id,
        market: { region: String(sourceRegion) },
      },
      orderBy: { observedAt: 'desc' },
      take: 8,
    });
    if (!prices.length) {
      return res.status(404).json({
        success: false,
        error: { code: 'NO_DATA', message: 'No mandi price data available for commodity + region' },
      });
    }

    const latest = Number(prices[0].priceModal);
    const average =
      prices.reduce((acc: number, p: { priceModal: unknown }) => acc + Number(p.priceModal), 0) / prices.length;
    const confidence = Math.max(0.2, Math.min(0.95, 0.55 + (average - latest) / Math.max(average, 1)));
    const action = confidence > 0.62 ? 'BUY' : confidence < 0.42 ? 'SELL' : 'HOLD';

    const buy = latest;
    const sell = latest * (1 + 0.08 + confidence * 0.08);
    const marginMin = Math.max(0, sell - buy - 0.6);
    const marginMax = Math.max(marginMin, sell - buy + 0.9);
    const validUntil = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const recommendation = await prisma.recommendation.create({
      data: {
        commodityId: commodity.id,
        sourceRegion: String(sourceRegion),
        targetMarket: String(targetMarket),
        action: action as any,
        confidence,
        expectedMarginMin: marginMin,
        expectedMarginMax: marginMax,
        riskFlags: ['Weather and lane disruption may affect realization'],
        assumptions: ['Based on latest 8 mandi entries'],
        payload: {
          commodity: commodity.code,
          quantityTons: Number(quantityTons),
          targetBuyRangePerKg: `${(buy * 0.98).toFixed(2)}-${(buy * 1.02).toFixed(2)}`,
          targetSellRangePerKg: `${(sell * 0.97).toFixed(2)}-${(sell * 1.03).toFixed(2)}`,
        },
        validUntil,
        createdByAgent: 'sky-radiant-master-agent',
      },
    });

    res.status(201).json({ success: true, data: recommendation });
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/recommendations', async (req, res, next) => {
  try {
    const limit = Math.min(100, Number(req.query.limit || 20));
    const rows = await prisma.recommendation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { commodity: { select: { code: true, name: true } } },
      take: limit,
    });
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/recommendations/:id/outcome', requireRole('ADMIN', 'OPS'), async (req, res, next) => {
  try {
    const recommendationId = String(req.params.id);
    const existing = await prisma.recommendation.findUnique({ where: { id: recommendationId } });
    if (!existing) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Recommendation not found' } });

    const row = await prisma.recommendationOutcome.create({
      data: {
        recommendationId,
        executed: Boolean(req.body?.executed),
        executedQtyTons: req.body?.executedQtyTons == null ? null : Number(req.body.executedQtyTons),
        realizedBuyAvg: req.body?.realizedBuyAvg == null ? null : Number(req.body.realizedBuyAvg),
        realizedSellAvg: req.body?.realizedSellAvg == null ? null : Number(req.body.realizedSellAvg),
        realizedMargin: req.body?.realizedMargin == null ? null : Number(req.body.realizedMargin),
        spoilagePct: req.body?.spoilagePct == null ? null : Number(req.body.spoilagePct),
        notes: req.body?.notes ? String(req.body.notes) : null,
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.post('/seo/jobs', requireRole('ADMIN', 'OPS'), async (req, res, next) => {
  try {
    const { topic, targetPersona, primaryKeyword, secondaryKeywords = [] } = req.body || {};
    if (!topic || !targetPersona || !primaryKeyword) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'topic, targetPersona, primaryKeyword are required' } });
    }
    const row = await prisma.seoContentJob.create({
      data: {
        topic: String(topic),
        targetPersona: String(targetPersona),
        primaryKeyword: String(primaryKeyword),
        secondaryKeywords,
      },
    });
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

agroRouter.get('/seo/jobs', async (req, res, next) => {
  try {
    const limit = Math.min(100, Number(req.query.limit || 20));
    const rows = await prisma.seoContentJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
});
