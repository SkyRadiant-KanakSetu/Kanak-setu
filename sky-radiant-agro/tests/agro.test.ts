import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

process.env.API_KEYS = 'ADMIN:test-admin-key,OPS:test-ops-key,VIEWER:test-viewer-key';

test('health endpoint returns ok', async () => {
  const app = createApp();
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
});

test('ingest mandi prices requires API key', async () => {
  const app = createApp();
  const res = await request(app).post('/api/v1/ingest/mandi-prices').send({});
  assert.equal(res.status, 401);
});

test('generate recommendation works with mocked prisma', async () => {
  const app = createApp();

  const originalCommodityFindUnique = prisma.commodity.findUnique;
  const originalMandiPriceFindMany = prisma.mandiPrice.findMany;
  const originalRecommendationCreate = prisma.recommendation.create;

  (prisma.commodity.findUnique as any) = async () => ({
    id: 'c1',
    code: 'TOMATO',
    name: 'Tomato',
  });
  (prisma.mandiPrice.findMany as any) = async () => [
    { priceModal: 10.5 },
    { priceModal: 11.0 },
    { priceModal: 10.8 },
  ];
  (prisma.recommendation.create as any) = async ({ data }: any) => ({
    id: 'r1',
    ...data,
  });

  const res = await request(app)
    .post('/api/v1/recommendations/generate')
    .set('x-api-key', 'test-admin-key')
    .send({
      commodityCode: 'TOMATO',
      sourceRegion: 'Delhi',
      targetMarket: 'Noida',
      quantityTons: 5,
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.id, 'r1');

  prisma.commodity.findUnique = originalCommodityFindUnique;
  prisma.mandiPrice.findMany = originalMandiPriceFindMany;
  prisma.recommendation.create = originalRecommendationCreate;
});
