import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const commodities = [
    { code: 'TOMATO', name: 'Tomato', category: 'vegetable', defaultShelfLifeDays: 4 },
    { code: 'ONION', name: 'Onion', category: 'vegetable', defaultShelfLifeDays: 45 },
    { code: 'POTATO', name: 'Potato', category: 'vegetable', defaultShelfLifeDays: 30 },
    { code: 'MANGO', name: 'Mango', category: 'fruit', defaultShelfLifeDays: 10 },
  ];

  for (const item of commodities) {
    await prisma.commodity.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    });
  }

  const markets = [
    { name: 'Azadpur', region: 'Delhi', type: 'MANDI' as const },
    { name: 'Ghaziabad Mandi', region: 'Uttar Pradesh', type: 'MANDI' as const },
    { name: 'Ludhiana Hub', region: 'Punjab', type: 'WHOLESALE' as const },
  ];

  for (const market of markets) {
    const exists = await prisma.market.findFirst({ where: { name: market.name, region: market.region } });
    if (!exists) await prisma.market.create({ data: market });
  }

  console.log('Sky Radiant Agro seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
