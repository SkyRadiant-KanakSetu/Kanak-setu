import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * VPS has no repo-root `.env`; only `infra/prod/.env.production`.
 * Without this, `npm run db:seed` can run with DATABASE_URL unset or wrong → smoke login fails.
 */
function loadEnvFiles() {
  const root = path.resolve(__dirname, '..');
  const files = [path.join(root, 'infra/prod/.env.production'), path.join(root, 'infra/.env')];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i < 1) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
    break;
  }
}

loadEnvFiles();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL missing. Create infra/prod/.env.production or infra/.env');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const pwdHash = await bcrypt.hash('password123', 12);
  /** Re-sync known demo passwords on every seed (upsert update was empty before, so old hashes never changed). */
  const pwd = { passwordHash: pwdHash, emailVerified: true };

  // Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kanaksetu.in' },
    update: pwd,
    create: {
      email: 'admin@kanaksetu.in',
      passwordHash: pwdHash,
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });
  console.log('  ✅ Super admin:', admin.email);

  // Donor
  const donorUser = await prisma.user.upsert({
    where: { email: 'donor@example.com' },
    update: pwd,
    create: {
      email: 'donor@example.com',
      passwordHash: pwdHash,
      role: 'DONOR',
      emailVerified: true,
      donorProfile: { create: { firstName: 'Raj', lastName: 'Kumar', kycStatus: 'VERIFIED' } },
    },
  });
  console.log('  ✅ Donor:', donorUser.email);

  // Institution user
  const instUser = await prisma.user.upsert({
    where: { email: 'temple@example.com' },
    update: pwd,
    create: {
      email: 'temple@example.com',
      passwordHash: pwdHash,
      role: 'INSTITUTION_ADMIN',
      emailVerified: true,
      institutionProfile: {
        create: {
          legalName: 'Shri Ram Mandir Trust',
          publicName: 'Shri Ram Mandir',
          type: 'RELIGIOUS',
          status: 'ACTIVE',
          description: 'Ancient temple accepting digital gold donations',
          city: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221001',
          has80G: true,
          publicPageSlug: 'shri-ram-mandir',
          campaigns: {
            create: [
              {
                name: 'Temple Renovation Fund',
                description: 'Gold for renovation of main shrine',
                isActive: true,
              },
              {
                name: 'General Donation',
                description: 'General gold donation to the temple',
                isActive: true,
              },
            ],
          },
        },
      },
    },
  });
  console.log('  ✅ Institution:', instUser.email);

  // Second institution
  const instUser2 = await prisma.user.upsert({
    where: { email: 'ngo@example.com' },
    update: pwd,
    create: {
      email: 'ngo@example.com',
      passwordHash: pwdHash,
      role: 'INSTITUTION_ADMIN',
      emailVerified: true,
      institutionProfile: {
        create: {
          legalName: 'Golden Heritage Foundation',
          publicName: 'Golden Heritage',
          type: 'FOUNDATION',
          status: 'ACTIVE',
          description: 'Preserving cultural heritage through digital gold donations',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302001',
          has80G: true,
          publicPageSlug: 'golden-heritage',
          campaigns: {
            create: [
              {
                name: 'Heritage Preservation',
                description: 'Gold for heritage site maintenance',
                isActive: true,
              },
            ],
          },
        },
      },
    },
  });
  console.log('  ✅ Institution 2:', instUser2.email);

  // Auditor
  const auditor = await prisma.user.upsert({
    where: { email: 'auditor@kanaksetu.in' },
    update: pwd,
    create: {
      email: 'auditor@kanaksetu.in',
      passwordHash: pwdHash,
      role: 'AUDITOR',
      emailVerified: true,
    },
  });
  console.log('  ✅ Auditor:', auditor.email);

  // System config
  await prisma.systemConfig.upsert({
    where: { key: 'gold_vendor' },
    update: {},
    create: { key: 'gold_vendor', value: { active: 'MOCK', fallback: null } },
  });
  await prisma.systemConfig.upsert({
    where: { key: 'payment_provider' },
    update: {},
    create: { key: 'payment_provider', value: { active: 'MOCK' } },
  });

  // Initial collecting batch
  await prisma.merkleBatch.upsert({
    where: { batchNumber: 1 },
    update: {},
    create: { status: 'COLLECTING' },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
