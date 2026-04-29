import type { PrismaClient } from '../generated/prisma';
import { prisma } from './prisma';

function titleizeFromCode(code: string) {
  const clean = String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ');
  if (!clean) return 'Commodity';
  return clean
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** Ensure commodity row exists for any uppercase code (auto-create if missing). */
export async function ensureCommodityByCode(
  codeRaw: string,
  client: PrismaClient = prisma
): Promise<{ id: string; code: string; name: string }> {
  const code = String(codeRaw || '')
    .trim()
    .toUpperCase();
  if (!code) {
    throw Object.assign(new Error('commodityCode is required'), { code: 'INVALID_INPUT' });
  }
  const name = titleizeFromCode(code);
  const row = await client.commodity.upsert({
    where: { code },
    create: {
      code,
      name,
      category: 'vegetable',
      defaultShelfLifeDays: 7,
    },
    update: {},
  });
  return { id: row.id, code: row.code, name: row.name };
}
