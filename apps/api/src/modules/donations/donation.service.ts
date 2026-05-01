import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { getPaymentAdapter } from '../payments/payment.adapter';
import { getGoldVendorAdapter } from '../vendor/vendor.adapter';
import { auditLog } from '../../utils/auditLog';
import { Decimal } from '@prisma/client/runtime/library';
import { writeOutboxEvent } from '../../lib/outbox';

const paymentGW = getPaymentAdapter();
const goldVendor = getGoldVendorAdapter();

// ── Step 1: Initiate donation & create payment order ──
export async function initiateDonation(params: {
  donorUserId: string;
  institutionId: string;
  campaignId?: string;
  amountPaise: number;
  idempotencyKey?: string;
  notes?: string;
}) {
  // Check idempotency
  if (params.idempotencyKey) {
    const existing = await prisma.donation.findUnique({
      where: { idempotencyKey: params.idempotencyKey },
    });
    if (existing) return existing;
  }

  // Verify institution is active
  const institution = await prisma.institutionProfile.findUnique({
    where: { id: params.institutionId },
  });
  if (!institution || institution.status !== 'ACTIVE') {
    throw new AppError(400, 'INSTITUTION_NOT_ACTIVE', 'Institution is not active for donations');
  }

  // Get donor profile
  const donor = await prisma.donorProfile.findUnique({ where: { userId: params.donorUserId } });
  if (!donor) throw new AppError(404, 'DONOR_NOT_FOUND', 'Donor profile not found');
  if (donor.kycStatus === 'BLOCKED' || donor.kycStatus === 'FLAGGED') {
    throw new AppError(403, 'DONOR_BLOCKED', 'Donor account is restricted');
  }

  // Fetch indicative gold quote
  const quote = await goldVendor.getQuote();

  // Create donation record
  const donation = await prisma.donation.create({
    data: {
      donorId: donor.id,
      institutionId: params.institutionId,
      campaignId: params.campaignId,
      amountPaise: params.amountPaise,
      goldPricePerGramPaise: quote.pricePerGramPaise,
      idempotencyKey: params.idempotencyKey,
      notes: params.notes,
      status: 'INITIATED',
    },
  });

  // Create payment order
  const order = await paymentGW.createOrder(params.amountPaise, donation.donationRef);

  await prisma.paymentTransaction.create({
    data: {
      donationId: donation.id,
      provider: (process.env.PAYMENT_PROVIDER || 'MOCK') as any,
      providerOrderId: order.providerOrderId,
      amountPaise: params.amountPaise,
      status: 'CREATED',
    },
  });

  // Update donation status
  await prisma.donation.update({ where: { id: donation.id }, data: { status: 'PAYMENT_PENDING' } });

  await auditLog({
    userId: params.donorUserId,
    action: 'CREATE',
    entity: 'Donation',
    entityId: donation.id,
    after: { status: 'PAYMENT_PENDING' },
  });

  return {
    donationId: donation.id,
    donationRef: donation.donationRef,
    paymentOrderId: order.providerOrderId,
    amountPaise: params.amountPaise,
    indicativeGoldPricePerGram: quote.pricePerGramPaise,
  };
}

// ── Step 2: Handle payment confirmation (called from webhook or client verify) ──
export async function confirmPayment(
  donationId: string,
  providerPaymentId: string,
  actorUserId?: string
) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { payment: true, institution: true, donor: true },
  });
  if (!donation) throw new AppError(404, 'NOT_FOUND', 'Donation not found');
  if (actorUserId && donation.donor.userId !== actorUserId) {
    throw new AppError(403, 'FORBIDDEN', 'This donation does not belong to you');
  }
  if (donation.status !== 'PAYMENT_PENDING') {
    if (
      [
        'PAYMENT_CONFIRMED',
        'UNDER_REVIEW',
        'VENDOR_ORDER_PLACED',
        'GOLD_ALLOCATED',
        'COMPLETED',
        'BATCHED',
        'ANCHORED',
      ].includes(donation.status)
    ) {
      return donation;
    }
    throw new AppError(
      400,
      'INVALID_STATE',
      `Cannot confirm payment from status ${donation.status}`
    );
  }

  await prisma.paymentTransaction.update({
    where: { donationId },
    data: { providerPaymentId, status: 'CAPTURED' },
  });
  await prisma.paymentEvent.create({
    data: {
      transactionId: donation.payment!.id,
      eventType: actorUserId ? 'DONOR_UPI_CONFIRMATION' : 'SYSTEM_CONFIRMATION',
      payload: {
        providerPaymentId,
        actorUserId: actorUserId || null,
      } as object,
      processedAt: new Date(),
    },
  });

  if (donation.institution.status !== 'ACTIVE') {
    await prisma.donation.update({
      where: { id: donationId },
      data: { status: 'UNDER_REVIEW' },
    });
    await auditLog({
      action: 'COMPLIANCE_HOLD',
      entity: 'Donation',
      entityId: donationId,
      after: {
        status: 'UNDER_REVIEW',
        reason: 'institution_not_active',
        institutionStatus: donation.institution.status,
      },
    });
    return prisma.donation.findUnique({
      where: { id: donationId },
      include: { payment: true, institution: true },
    });
  }

  await prisma.donation.update({
    where: { id: donationId },
    data: { status: 'PAYMENT_CONFIRMED' },
  });

  await auditLog({
    action: 'STATUS_CHANGE',
    entity: 'Donation',
    entityId: donationId,
    after: { status: 'PAYMENT_CONFIRMED' },
  });

  return allocateGold(donationId);
}

export async function queuePaymentConfirmation(
  donationId: string,
  providerPaymentId: string,
  actorUserId?: string
) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { donor: true },
  });
  if (!donation) throw new AppError(404, 'NOT_FOUND', 'Donation not found');
  if (actorUserId && donation.donor.userId !== actorUserId) {
    throw new AppError(403, 'FORBIDDEN', 'This donation does not belong to you');
  }
  if (donation.status !== 'PAYMENT_PENDING') {
    if (
      [
        'PAYMENT_CONFIRMED',
        'UNDER_REVIEW',
        'VENDOR_ORDER_PLACED',
        'GOLD_ALLOCATED',
        'COMPLETED',
        'BATCHED',
        'ANCHORED',
      ].includes(donation.status)
    ) {
      return { accepted: true, alreadyProcessed: true, donationId };
    }
    throw new AppError(400, 'INVALID_STATE', `Cannot confirm payment from status ${donation.status}`);
  }

  await writeOutboxEvent(prisma, {
    eventType: 'payment.confirmed',
    aggregateId: donationId,
    aggregateType: 'Donation',
    payload: {
      donationId,
      providerPaymentId,
      actorUserId: actorUserId || null,
      source: actorUserId ? 'donor_confirm_route' : 'system',
    },
  });

  return { accepted: true, alreadyProcessed: false, donationId };
}

export async function queuePaymentFailure(
  donationId: string,
  actorUserId?: string
) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { donor: true },
  });
  if (!donation) throw new AppError(404, 'NOT_FOUND', 'Donation not found');
  if (actorUserId && donation.donor.userId !== actorUserId) {
    throw new AppError(403, 'FORBIDDEN', 'This donation does not belong to you');
  }

  await writeOutboxEvent(prisma, {
    eventType: 'payment.failed',
    aggregateId: donationId,
    aggregateType: 'Donation',
    payload: {
      donationId,
      actorUserId: actorUserId || null,
      source: actorUserId ? 'donor_confirm_route' : 'system',
    },
  });

  return { accepted: true, donationId };
}

// ── Step 3: Allocate gold via vendor ──
export async function allocateGold(donationId: string) {
  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation) throw new AppError(404, 'NOT_FOUND', 'Donation not found');

  await prisma.donation.update({
    where: { id: donationId },
    data: { status: 'VENDOR_ORDER_PLACED' },
  });

  try {
    const allocation = await goldVendor.buyGold(donation.amountPaise, donation.donationRef);

    const vo = await prisma.vendorOrder.create({
      data: {
        donationId,
        vendor: (process.env.GOLD_VENDOR || 'MOCK') as any,
        vendorOrderRef: allocation.vendorOrderRef,
        goldQuantityMg: new Decimal(allocation.goldQuantityMg),
        pricePerGramPaise: allocation.pricePerGramPaise,
        status: 'ALLOCATED',
        vendorData: allocation.vendorData as any,
      },
    });
    await prisma.vendorEvent.create({
      data: {
        vendorOrderId: vo.id,
        eventType: 'ALLOCATION_CONFIRMED',
        payload: { allocation, referenceId: donation.donationRef } as object,
      },
    });

    // Update donation with gold quantity
    const goldQty = new Decimal(allocation.goldQuantityMg);
    await prisma.donation.update({
      where: { id: donationId },
      data: {
        goldQuantityMg: goldQty,
        goldPricePerGramPaise: allocation.pricePerGramPaise,
        status: 'COMPLETED',
      },
    });

    await prisma.$transaction([
      writeOutboxEvent(prisma, {
        eventType: 'receipt.generate',
        aggregateId: donationId,
        aggregateType: 'Donation',
        payload: {
          donationId,
          certificateType: 'DONATION_RECEIPT',
        },
      }),
      writeOutboxEvent(prisma, {
        eventType: 'donor.confirmation',
        aggregateId: donation.donorId,
        aggregateType: 'Donor',
        payload: {
          donationId,
          donorId: donation.donorId,
          amountPaise: donation.amountPaise,
          status: 'COMPLETED',
        },
      }),
      writeOutboxEvent(prisma, {
        eventType: 'institution.notification',
        aggregateId: donation.institutionId,
        aggregateType: 'Institution',
        payload: {
          donationId,
          institutionId: donation.institutionId,
          amountPaise: donation.amountPaise,
          status: 'COMPLETED',
        },
      }),
      writeOutboxEvent(prisma, {
        eventType: 'webhook.dispatch',
        aggregateId: donationId,
        aggregateType: 'Webhook',
        payload: {
          donationId,
          donationRef: donation.donationRef,
          providerPaymentStatus: 'CAPTURED',
        },
      }),
    ]);

    // Credit institution ledger
    await creditInstitutionLedger(donation.institutionId, donationId, goldQty);

    await auditLog({
      action: 'STATUS_CHANGE',
      entity: 'Donation',
      entityId: donationId,
      after: { status: 'COMPLETED', goldQuantityMg: allocation.goldQuantityMg },
    });

    return prisma.donation.findUnique({ where: { id: donationId } });
  } catch (err) {
    await prisma.donation.update({ where: { id: donationId }, data: { status: 'VENDOR_FAILED' } });
    const failedVo = await prisma.vendorOrder.create({
      data: { donationId, vendor: (process.env.GOLD_VENDOR || 'MOCK') as any, status: 'FAILED' },
    });
    await prisma.vendorEvent.create({
      data: {
        vendorOrderId: failedVo.id,
        eventType: 'ALLOCATION_FAILED',
        payload: { error: String(err) } as object,
      },
    });
    await auditLog({
      action: 'STATUS_CHANGE',
      entity: 'Donation',
      entityId: donationId,
      after: { status: 'VENDOR_FAILED', error: String(err) },
    });
    throw new AppError(502, 'VENDOR_FAILED', 'Gold allocation failed');
  }
}

// ── Credit institution gold ledger ──
async function creditInstitutionLedger(
  institutionId: string,
  donationId: string,
  goldQuantityMg: Decimal
) {
  // Get current balance
  const lastEntry = await prisma.goldLedgerEntry.findFirst({
    where: { institutionId },
    orderBy: { createdAt: 'desc' },
  });
  const currentBalance = lastEntry?.balanceAfterMg || new Decimal(0);
  const newBalance = currentBalance.add(goldQuantityMg);

  await prisma.goldLedgerEntry.create({
    data: {
      institutionId,
      donationId,
      entryType: 'CREDIT',
      goldQuantityMg,
      balanceAfterMg: newBalance,
      description: `Donation ${donationId} credited`,
    },
  });
}
