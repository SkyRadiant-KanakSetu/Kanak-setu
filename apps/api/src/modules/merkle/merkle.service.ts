import { prisma } from '../../config/prisma';
import { auditLog } from '../../utils/auditLog';
import { AppError } from '../../middleware/errorHandler';
import {
  donationLeafHashHex,
  merkleParentHash,
  type DonationLeafV1,
} from '@kanak-setu/blockchain';

const MERKLE_MAX_LEAVES_PER_BATCH = Math.max(
  1,
  parseInt(process.env.MERKLE_MAX_LEAVES_PER_BATCH || '1000', 10)
);
const MERKLE_MIN_LEAVES_TO_SEAL = Math.max(
  1,
  parseInt(process.env.MERKLE_MIN_LEAVES_TO_SEAL || '1', 10)
);

function leafFromDonation(d: {
  id: string;
  institutionId: string;
  amountPaise: number;
  goldQuantityMg: { toString(): string } | null;
  createdAt: Date;
}): string {
  const leaf: DonationLeafV1 = {
    version: 1,
    donationId: d.id,
    institutionId: d.institutionId,
    amountPaise: String(d.amountPaise),
    goldMg: d.goldQuantityMg?.toString() || '0',
    createdAtIso: d.createdAt.toISOString(),
  };
  return donationLeafHashHex(leaf);
}

/** @deprecated Use `leafFromDonation` + `@kanak-setu/blockchain` — kept for tests/tools calling by shape. */
export function canonicalizeLeaf(donation: {
  donationRef: string;
  donorId: string;
  institutionId: string;
  amountPaise: number;
  goldQuantityMg: string;
  createdAt: Date;
}): string {
  const leaf: DonationLeafV1 = {
    version: 1,
    donationId: donation.donationRef,
    institutionId: donation.institutionId,
    amountPaise: donation.amountPaise.toString(),
    goldMg: donation.goldQuantityMg,
    createdAtIso: donation.createdAt.toISOString(),
  };
  return donationLeafHashHex(leaf);
}

// ── BUILD MERKLE TREE (sorted-pair keccak, matches `merkleParentHash`) ──
export function buildMerkleTree(leaves: string[]): { root: string; layers: string[][] } {
  if (leaves.length === 0) return { root: '', layers: [] };

  let layer = leaves.map((h) => h.replace(/^0x/i, '').toLowerCase());
  const layers: string[][] = [layer];

  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] || left;
      next.push(merkleParentHash(left, right));
    }
    layer = next;
    layers.push(layer);
  }

  return { root: layer[0], layers };
}

// ── GENERATE PROOF (sibling hashes per level; verify with `merkleParentHash` only) ──
export function generateProof(
  leafIndex: number,
  layers: string[][]
): { position: ('left' | 'right')[]; hashes: string[] } {
  const positions: ('left' | 'right')[] = [];
  const hashes: string[] = [];
  let idx = leafIndex;

  for (let i = 0; i < layers.length - 1; i++) {
    const layer = layers[i];
    const isRight = idx % 2 === 1;
    const siblingIdx = isRight ? idx - 1 : idx + 1;
    const sibling = siblingIdx < layer.length ? layer[siblingIdx] : layer[idx];

    positions.push(isRight ? 'left' : 'right');
    hashes.push(sibling);
    idx = Math.floor(idx / 2);
  }

  return { position: positions, hashes };
}

// ── VERIFY PROOF (sorted-pair keccak) ──
export function verifyProof(
  leafHash: string,
  proof: { position: ('left' | 'right')[]; hashes: string[] },
  merkleRoot: string
): boolean {
  let hash = leafHash.replace(/^0x/i, '').toLowerCase();
  const root = merkleRoot.replace(/^0x/i, '').toLowerCase();

  for (let i = 0; i < proof.hashes.length; i++) {
    hash = merkleParentHash(hash, proof.hashes[i]);
  }

  return hash === root;
}

function logMerkle(event: string, metadata: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify({
      module: 'merkle',
      event,
      at: new Date().toISOString(),
      ...metadata,
    })
  );
}

// ── SEAL CURRENT BATCH ──
export async function sealCurrentBatch() {
  let batch = await prisma.merkleBatch.findFirst({ where: { status: 'COLLECTING' } });
  if (!batch) {
    batch = await prisma.merkleBatch.create({ data: { status: 'COLLECTING' } });
  }

  const lock = await prisma.merkleBatch.updateMany({
    where: { id: batch.id, status: 'COLLECTING' },
    data: { status: 'SEALED' }, // temporary lock state before final root update
  });
  if (lock.count === 0) {
    throw new AppError(409, 'BATCH_LOCKED', 'Another seal process is already in progress');
  }

  const donations = await prisma.donation.findMany({
    where: { status: 'COMPLETED', merkleLeaf: null },
    orderBy: { createdAt: 'asc' },
    take: MERKLE_MAX_LEAVES_PER_BATCH,
  });

  if (donations.length === 0) {
    await prisma.merkleBatch.update({
      where: { id: batch.id },
      data: { status: 'COLLECTING' },
    });
    return { message: 'No donations to batch', batchId: batch.id };
  }

  if (donations.length < MERKLE_MIN_LEAVES_TO_SEAL) {
    await prisma.merkleBatch.update({
      where: { id: batch.id },
      data: { status: 'COLLECTING' },
    });
    return {
      message: `Batch skipped: requires at least ${MERKLE_MIN_LEAVES_TO_SEAL} leaves`,
      batchId: batch.id,
      pendingLeaves: donations.length,
    };
  }

  logMerkle('seal_started', { batchId: batch.id, leaves: donations.length });

  const leafHashes: string[] = [];
  for (let i = 0; i < donations.length; i++) {
    const d = donations[i];
    const hash = leafFromDonation(d);
    leafHashes.push(hash);

    await prisma.merkleLeaf.create({
      data: { batchId: batch.id, donationId: d.id, leafIndex: i, leafHash: hash },
    });
  }

  const { root, layers } = buildMerkleTree(leafHashes);

  for (let i = 0; i < donations.length; i++) {
    const proof = generateProof(i, layers);
    await prisma.merkleLeaf.updateMany({
      where: { batchId: batch.id, donationId: donations[i].id },
      data: { proofPath: proof as object },
    });
  }

  await prisma.merkleBatch.update({
    where: { id: batch.id },
    data: { status: 'SEALED', merkleRoot: root, leafCount: donations.length, sealedAt: new Date() },
  });

  await prisma.donation.updateMany({
    where: { id: { in: donations.map((d) => d.id) } },
    data: { status: 'BATCHED' },
  });

  await prisma.merkleBatch.create({ data: { status: 'COLLECTING' } });

  await auditLog({
    action: 'STATUS_CHANGE',
    entity: 'MerkleBatch',
    entityId: batch.id,
    after: {
      status: 'SEALED',
      root,
      leafCount: donations.length,
      leafSchema: 'DonationLeafV1+keccak+sortedPair',
    },
  });

  logMerkle('seal_completed', { batchId: batch.id, merkleRoot: root, leafCount: donations.length });

  return { batchId: batch.id, merkleRoot: root, leafCount: donations.length };
}
