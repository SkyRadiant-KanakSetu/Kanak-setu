import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import '../loadEnv';
import { app } from '../app';
import { prisma } from '../config/prisma';

async function clearTestData() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "AuditLog",
      "PhoneOtpChallenge",
      "NotificationLog",
      "PaymentEvent",
      "WebhookDelivery",
      "GoldLedgerEntry",
      "SpiritualFunctionContribution",
      "InstitutionTask",
      "SpiritualFunction",
      "InstitutionMetricsDaily",
      "InstitutionBranch",
      "VendorEvent",
      "VendorOrder",
      "PaymentTransaction",
      "MerkleLeaf",
      "BlockchainAnchor",
      "MerkleBatch",
      "Donation",
      "Campaign",
      "AdminReview",
      "InstitutionDoc",
      "InstitutionBank",
      "RedemptionRequest",
      "DonorProfile",
      "InstitutionProfile",
      "Session",
      "User"
    RESTART IDENTITY CASCADE
  `);
}

async function createInstitutionAdmin() {
  const email = `institution.portal.${Date.now()}@kanaksetu.test`;
  await request(app).post('/api/v1/auth/register').send({
    email,
    password: 'TestPassword123!',
    firstName: 'Portal',
    lastName: 'Admin',
    role: 'INSTITUTION_ADMIN',
  });
  const loginResp = await request(app).post('/api/v1/auth/login').send({
    email,
    password: 'TestPassword123!',
  });
  const accessToken = loginResp.body.data.accessToken as string;
  assert.ok(accessToken);
  return accessToken;
}

test.before(async () => {
  await prisma.$connect();
});

test.after(async () => {
  await clearTestData();
  await prisma.$disconnect();
});

test('dashboard remains backward compatible with optional include flags', async () => {
  await clearTestData();
  const accessToken = await createInstitutionAdmin();

  const onboardResp = await request(app)
    .post('/api/v1/institutions/portal/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      legalName: 'Integration Temple Trust',
      publicName: 'Integration Temple',
      type: 'TRUST',
      publicPageSlug: `integration-temple-${Date.now()}`,
    });
  assert.equal(onboardResp.status, 201);

  const dashboardResp = await request(app)
    .get('/api/v1/institutions/portal/dashboard?rangeDays=30&includeDemographics=1&includeGeoDistribution=1')
    .set('Authorization', `Bearer ${accessToken}`);
  assert.equal(dashboardResp.status, 200);
  assert.equal(dashboardResp.body.data.rangeDays, 30);
  assert.equal(typeof dashboardResp.body.data.totalDonations, 'number');
  assert.equal(typeof dashboardResp.body.data.rolloutFlags?.portalRefinements, 'boolean');
  assert.equal(typeof dashboardResp.body.data.rolloutFlags?.faithContextSettings, 'boolean');
});

test('refinement and faith routes are gated off by default rollout flags', async () => {
  await clearTestData();
  const accessToken = await createInstitutionAdmin();

  await request(app)
    .post('/api/v1/institutions/portal/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      legalName: 'Harmony Center',
      publicName: 'Harmony Center',
      type: 'FOUNDATION',
      publicPageSlug: `harmony-center-${Date.now()}`,
    });

  const getDefaultsResp = await request(app)
    .get('/api/v1/institutions/portal/settings-faith')
    .set('Authorization', `Bearer ${accessToken}`);
  assert.equal(getDefaultsResp.status, 404);
  assert.equal(getDefaultsResp.body.error?.code, 'FEATURE_DISABLED');

  const functionsResp = await request(app)
    .get('/api/v1/institutions/portal/functions')
    .set('Authorization', `Bearer ${accessToken}`)
    .send();
  assert.ok([200, 404].includes(functionsResp.status));
  if (functionsResp.status === 404) {
    assert.equal(functionsResp.body.error?.code, 'FEATURE_DISABLED');
  } else {
    assert.ok(Array.isArray(functionsResp.body.data));
  }
});

test('refinement routes work when rollout flags are enabled', async () => {
  await clearTestData();
  const prevRefinements = process.env.ENABLE_INSTITUTION_PORTAL_REFINEMENTS;
  const prevFaith = process.env.ENABLE_FAITH_CONTEXT_SETTINGS;
  process.env.ENABLE_INSTITUTION_PORTAL_REFINEMENTS = '1';
  process.env.ENABLE_FAITH_CONTEXT_SETTINGS = '1';

  try {
    const accessToken = await createInstitutionAdmin();
    const onboardResp = await request(app)
      .post('/api/v1/institutions/portal/onboard')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        legalName: 'Rollout Temple Trust',
        publicName: 'Rollout Temple',
        type: 'TRUST',
        publicPageSlug: `rollout-temple-${Date.now()}`,
      });
    assert.equal(onboardResp.status, 201);

    const createFunctionResp = await request(app)
      .post('/api/v1/institutions/portal/functions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Weekly Community Service',
        functionType: 'COMMUNITY_SERVICE',
        nextDate: '2026-05-01',
      });
    assert.equal(createFunctionResp.status, 201);
    assert.equal(createFunctionResp.body.data.name, 'Weekly Community Service');

    const demographicsResp = await request(app)
      .get('/api/v1/institutions/portal/demographics')
      .set('Authorization', `Bearer ${accessToken}`);
    assert.equal(demographicsResp.status, 200);
    assert.equal(typeof demographicsResp.body.data.totalDonations, 'number');

    const geoResp = await request(app)
      .get('/api/v1/institutions/portal/geo-distribution')
      .set('Authorization', `Bearer ${accessToken}`);
    assert.equal(geoResp.status, 200);
    assert.ok(Array.isArray(geoResp.body.data.states));

    const taskResp = await request(app)
      .post('/api/v1/institutions/portal/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Coordinate volunteers',
        taskType: 'PRE_EVENT',
      });
    assert.equal(taskResp.status, 201);
    assert.equal(taskResp.body.data.status, 'TODO');

    const faithResp = await request(app)
      .patch('/api/v1/institutions/portal/settings-faith')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        faithTradition: 'Multi-faith',
        terminologyDonationLabel: 'Offering',
        terminologyDonorLabel: 'Supporter',
        sacredCalendarHighlights: [{ title: 'Service Week', date: '2026-05-15' }],
      });
    assert.equal(faithResp.status, 200);
    assert.equal(faithResp.body.data.terminologyDonationLabel, 'Offering');
  } finally {
    process.env.ENABLE_INSTITUTION_PORTAL_REFINEMENTS = prevRefinements;
    process.env.ENABLE_FAITH_CONTEXT_SETTINGS = prevFaith;
  }
});

