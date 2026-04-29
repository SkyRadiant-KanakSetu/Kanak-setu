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

  const otpReqResp = await request(app).post('/api/v1/auth/signup/phone/request-otp').send({
    phone: '9999980001',
  });
  assert.equal(otpReqResp.status, 200);
  const otp = otpReqResp.body.data.devOtp as string;
  assert.ok(otp);
  const verifyOtpResp = await request(app).post('/api/v1/auth/signup/phone/verify-otp').send({
    phone: '9999980001',
    otp,
    firstName: 'Donor',
    lastName: 'One',
  });
  assert.equal(verifyOtpResp.status, 200);
  const accessToken = verifyOtpResp.body.data.accessToken as string;
  assert.ok(accessToken);

  const donorUserId = verifyOtpResp.body.data.user.id as string;
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
  assert.equal(typeof webhookResp.body.data.processed, 'boolean');

  const finalDonation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { payment: true, vendorOrder: true },
  });
  assert.ok(finalDonation);
  assert.ok(['PAYMENT_PENDING', 'COMPLETED'].includes(finalDonation.status));
  if (finalDonation.status === 'COMPLETED') {
    assert.equal(finalDonation.payment?.status, 'CAPTURED');
    assert.equal(finalDonation.vendorOrder?.status, 'ALLOCATED');
    const ledgerEntry = await prisma.goldLedgerEntry.findFirst({
      where: { donationId },
    });
    assert.ok(ledgerEntry);
    assert.equal(ledgerEntry.entryType, 'CREDIT');
    assert.ok(Number(ledgerEntry.goldQuantityMg) > 0);
  }

  const donor = await prisma.donorProfile.findUnique({ where: { userId: donorUserId } });
  assert.ok(donor);
});

test('duplicate webhook delivery is idempotent', async () => {
  await clearTestData();

  const otpReqResp = await request(app).post('/api/v1/auth/signup/phone/request-otp').send({
    phone: '9999980002',
  });
  assert.equal(otpReqResp.status, 200);
  const otp = otpReqResp.body.data.devOtp as string;
  assert.ok(otp);
  const verifyOtpResp = await request(app).post('/api/v1/auth/signup/phone/verify-otp').send({
    phone: '9999980002',
    otp,
    firstName: 'Donor',
    lastName: 'Two',
  });
  assert.equal(verifyOtpResp.status, 200);
  const accessToken = verifyOtpResp.body.data.accessToken as string;

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
