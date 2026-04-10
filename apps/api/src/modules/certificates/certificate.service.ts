import { prisma } from '../../config/prisma';
import { CertificateType } from '@prisma/client';
import { v4 as uuid } from 'uuid';

// ── Serial number format: KS-{TYPE_PREFIX}-{YYYYMMDD}-{SEQ} ──
function generateSerial(type: CertificateType): string {
  const prefix = type === 'DONATION_RECEIPT' ? 'DR' : type === 'BLOCKCHAIN_PROOF' ? 'BP' : '80G';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KS-${prefix}-${date}-${seq}`;
}

// ── Create certificate record ──
export async function createCertificate(donationId: string, type: CertificateType) {
  // Check if one already exists
  const existing = await prisma.certificate.findFirst({ where: { donationId, type } });
  if (existing && existing.status !== 'GENERATION_FAILED') return existing;

  const cert = await prisma.certificate.create({
    data: {
      donationId,
      type,
      serialNumber: generateSerial(type),
      verificationRef: uuid(),
      status: 'PENDING',
    },
  });

  // In a real system, trigger async PDF generation here
  // For MVP, we mark as GENERATED immediately
  try {
    const fileUrl = await generateCertificatePdf(cert.id);
    const qrData = `${process.env.DONOR_WEB_URL || 'http://localhost:3000'}/verify?ref=${cert.verificationRef}`;
    return prisma.certificate.update({
      where: { id: cert.id },
      data: { status: 'ISSUED', fileUrl, qrData, issuedAt: new Date() },
    });
  } catch {
    return prisma.certificate.update({
      where: { id: cert.id },
      data: { status: 'GENERATION_FAILED' },
    });
  }
}

// ── PDF generation stub ──
// In production, use Puppeteer to render HTML template to PDF
async function generateCertificatePdf(certId: string): Promise<string> {
  const cert = await prisma.certificate.findUnique({
    where: { id: certId },
    include: {
      donation: {
        include: {
          donor: { select: { firstName: true, lastName: true } },
          institution: { select: { publicName: true } },
          merkleLeaf: {
            include: {
              batch: { select: { merkleRoot: true } },
            },
          },
        },
      },
    },
  });
  if (!cert) throw new Error('Certificate not found');

  // For MVP: return a placeholder URL. Real implementation would:
  // 1. Render HTML template with cert data
  // 2. Use Puppeteer to convert to PDF
  // 3. Store file and return URL
  const filename = `certificates/${cert.serialNumber}.pdf`;
  const proofRef = cert.donation.merkleLeaf?.leafHash
    ? `leaf=${cert.donation.merkleLeaf.leafHash}&root=${cert.donation.merkleLeaf.batch?.merkleRoot || ''}`
    : '';
  return `/storage/${filename}${proofRef ? `?${proofRef}` : ''}`;
}

// ── Auto-generate receipt after donation completion ──
export async function generateDonationReceipt(donationId: string) {
  return createCertificate(donationId, 'DONATION_RECEIPT');
}

// ── Generate blockchain proof certificate after anchoring ──
export async function generateProofCertificate(donationId: string) {
  return createCertificate(donationId, 'BLOCKCHAIN_PROOF');
}
