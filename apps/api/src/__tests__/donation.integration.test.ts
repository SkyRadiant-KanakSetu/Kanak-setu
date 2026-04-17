import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import '../loadEnv';
import { app } from '../app';
import { prisma } from '../config/prisma';

async function clearTestData() {
  await prisma.auditLog.deleteMany();
  await prisma.paymentEvent.deleteMany();
  await prisma.webhookDelivery.deleteMany();
  await prisma.goldLedgerEntry.deleteMany();
  await prisma.vendorEvent.deleteMany();
  await prisma.vendorOrder.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.donorProfile.deleteMany();
  await prisma.institutionProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

test.before(async () => {
  process.env.PAYMENT_PROVIDER = 'MOCK';
  process.env.GOLD_VENDOR = 'MOCK';
  await prisma.$connect();
});

test.after(async () => {
  await clearTestData();
  await prisma.$disconnect();
});

test('donation lifecycle completes through webhook and credits ledger', async () => {
  await clearTestData();

  const registerResp = await request(app).post('/api/v1/auth/register').send({
    email: 'donor.integration@kanaksetu.test',
    password: 'TestPassword123!',
    firstName: 'Donor',
    lastName: 'One',
  });
  assert.equal(registerResp.status, 201);
  const accessToken = registerResp.body.data.accessToken as string;
  assert.ok(accessToken);

  const donorUserId = registerResp.body.data.user.id as string;
  const institutionAdmin = await prisma.user.create({
    data: {
      email: 'institution.admin@kanaksetu.test',
      passwordHash: 'not-used-in-test',
      role: 'INSTITUTION_ADMIN',
      institutionProfile: {
        create: {
          legalName: 'Kanak Setu Trust',
          publicName: 'Kanak Setu Trust',
          type: 'TRUST',
          status: 'ACTIVE',
          publicPageSlug: 'kanak-setu-trust',
        },
      },
    },
    include: { institutionProfile: true },
  });
  const institutionId = institutionAdmin.institutionProfile!.id;

  const initiateResp = await request(app)
    .post('/api/v1/donations')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      institutionId,
      amountPaise: 50000,
      idempotencyKey: 'itest-key-001',
    });
  assert.equal(initiateResp.status, 201);
  const donationId = initiateResp.body.data.donationId as string;
  const providerOrderId = initiateResp.body.data.paymentOrderId as string;
  assert.ok(donationId);
  assert.ok(providerOrderId);

  const webhookResp = await request(app).post('/api/v1/webhooks/razorpay').send({
    id: 'evt_test_capture_001',
    event: 'payment.captured',
    providerOrderId,
    paymentId: 'pay_test_capture_001',
    status: 'CAPTURED',
  });
  assert.equal(webhookResp.status, 200);
  assert.equal(webhookResp.body.data.processed, true);

  const finalDonation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { payment: true, vendorOrder: true },
  });
  assert.ok(finalDonation);
  assert.equal(finalDonation.status, 'COMPLETED');
  assert.equal(finalDonation.payment?.status, 'CAPTURED');
  assert.equal(finalDonation.vendorOrder?.status, 'ALLOCATED');

  const ledgerEntry = await prisma.goldLedgerEntry.findFirst({
    where: { donationId },
  });
  assert.ok(ledgerEntry);
  assert.equal(ledgerEntry.entryType, 'CREDIT');
  assert.ok(Number(ledgerEntry.goldQuantityMg) > 0);

  const donor = await prisma.donorProfile.findUnique({ where: { userId: donorUserId } });
  assert.ok(donor);
});

test('duplicate webhook delivery is idempotent', async () => {
  await clearTestData();

  const registerResp = await request(app).post('/api/v1/auth/register').send({
    email: 'donor.integration.dup@kanaksetu.test',
    password: 'TestPassword123!',
    firstName: 'Donor',
    lastName: 'Two',
  });
  assert.equal(registerResp.status, 201);
  const accessToken = registerResp.body.data.accessToken as string;

  const institutionAdmin = await prisma.user.create({
    data: {
      email: 'institution.admin.dup@kanaksetu.test',
      passwordHash: 'not-used-in-test',
      role: 'INSTITUTION_ADMIN',
      institutionProfile: {
        create: {
          legalName: 'Kanak Setu Foundation',
          publicName: 'Kanak Setu Foundation',
          type: 'FOUNDATION',
          status: 'ACTIVE',
          publicPageSlug: 'kanak-setu-foundation',
        },
      },
    },
    include: { institutionProfile: true },
  });
  const institutionId = institutionAdmin.institutionProfile!.id;

  const initiateResp = await request(app)
    .post('/api/v1/donations')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      institutionId,
      amountPaise: 100000,
      idempotencyKey: 'itest-key-dup-001',
    });
  assert.equal(initiateResp.status, 201);
  const providerOrderId = initiateResp.body.data.paymentOrderId as string;

  const payload = {
    id: 'evt_test_dup_001',
    event: 'payment.captured',
    providerOrderId,
    paymentId: 'pay_test_dup_001',
    status: 'CAPTURED',
  };

  const firstResp = await request(app).post('/api/v1/webhooks/razorpay').send(payload);
  assert.equal(firstResp.status, 200);
  assert.equal(firstResp.body.data.duplicate, false);

  const secondResp = await request(app).post('/api/v1/webhooks/razorpay').send(payload);
  assert.equal(secondResp.status, 200);
  assert.equal(secondResp.body.data.duplicate, true);

  const deliveries = await prisma.webhookDelivery.count({
    where: { idempotencyKey: 'RAZORPAY:evt_test_dup_001' },
  });
  assert.equal(deliveries, 1);
});
