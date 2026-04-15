import { ethers } from 'ethers';
import { prisma } from '../../config/prisma';
import { auditLog } from '../../utils/auditLog';
import { AppError } from '../../middleware/errorHandler';

const ANCHOR_ABI = [
  'function anchor(uint256 batchId, bytes32 merkleRoot) external',
  'function getAnchor(uint256 batchId) external view returns (bytes32 merkleRoot, uint256 timestamp)',
  'event Anchored(uint256 indexed batchId, bytes32 merkleRoot, uint256 timestamp)',
];

const MAX_ANCHOR_ATTEMPTS = 10;

function getProvider() {
  return new ethers.JsonRpcProvider(
    process.env.BHARATCHAIN_RPC_URL ||
      process.env.BLOCKCHAIN_RPC_URL ||
      process.env.POLYGON_RPC_URL ||
      'https://rpc.bharatchain.org'
  );
}

function getSigner() {
  const key = process.env.ANCHOR_PRIVATE_KEY;
  if (!key) throw new AppError(500, 'CONFIG', 'ANCHOR_PRIVATE_KEY not configured');
  return new ethers.Wallet(key, getProvider());
}

function getContract() {
  const addr = process.env.ANCHOR_CONTRACT_ADDRESS;
  if (!addr) throw new AppError(500, 'CONFIG', 'ANCHOR_CONTRACT_ADDRESS not configured');
  return new ethers.Contract(addr, ANCHOR_ABI, getSigner());
}

function rootToBytes32(merkleRoot: string): string {
  const mr = merkleRoot.replace(/^0x/i, '');
  if (mr.length !== 64) {
    throw new AppError(500, 'INVALID_ROOT', 'Merkle root must be 32-byte hex (64 chars)');
  }
  return '0x' + mr.toLowerCase();
}

export async function anchorBatch(batchId: string) {
  let batch = await prisma.merkleBatch.findUnique({
    where: { id: batchId },
    include: { anchor: true },
  });
  if (!batch) throw new AppError(404, 'NOT_FOUND', 'Batch not found');

  if (batch.status === 'ANCHOR_FAILED') {
    const attempts = batch.anchor?.attempts ?? 0;
    if (attempts >= MAX_ANCHOR_ATTEMPTS) {
      throw new AppError(400, 'MAX_ANCHOR_ATTEMPTS', 'Anchor retries exhausted for this batch');
    }
    await prisma.merkleBatch.update({ where: { id: batchId }, data: { status: 'SEALED' } });
    batch = await prisma.merkleBatch.findUnique({
      where: { id: batchId },
      include: { anchor: true },
    });
  }

  if (!batch || batch.status !== 'SEALED') {
    throw new AppError(400, 'INVALID_STATE', `Batch ${batchId} is not SEALED`);
  }
  if (!batch.merkleRoot) throw new AppError(400, 'INVALID_STATE', 'Batch has no merkle root');

  let anchor = await prisma.blockchainAnchor.findUnique({ where: { batchId } });
  if (!anchor) {
    anchor = await prisma.blockchainAnchor.create({
      data: {
        batchId,
        network: process.env.CHAIN_NETWORK || 'bharatchain_mainnet',
        merkleRoot: batch.merkleRoot,
        status: 'PENDING',
      },
    });
  }

  await prisma.merkleBatch.update({ where: { id: batchId }, data: { status: 'ANCHORING' } });

  const rootBytes = rootToBytes32(batch.merkleRoot);

  try {
    const contract = getContract();
    const tx = await contract.anchor(batch.batchNumber, rootBytes);
    const receipt = await tx.wait();

    await prisma.blockchainAnchor.update({
      where: { batchId },
      data: {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        contractAddr: process.env.ANCHOR_CONTRACT_ADDRESS,
        status: 'CONFIRMED',
        attempts: { increment: 1 },
      },
    });

    await prisma.merkleBatch.update({
      where: { id: batchId },
      data: { status: 'ANCHORED', anchoredAt: new Date() },
    });

    const leaves = await prisma.merkleLeaf.findMany({ where: { batchId } });
    await prisma.donation.updateMany({
      where: { id: { in: leaves.map((l) => l.donationId) } },
      data: { status: 'ANCHORED' },
    });

    await auditLog({
      action: 'STATUS_CHANGE',
      entity: 'MerkleBatch',
      entityId: batchId,
      after: { status: 'ANCHORED', txHash: receipt.hash, blockNumber: receipt.blockNumber },
    });

    return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
  } catch (err) {
    await prisma.blockchainAnchor.update({
      where: { batchId },
      data: { status: 'FAILED', attempts: { increment: 1 } },
    });
    await prisma.merkleBatch.update({ where: { id: batchId }, data: { status: 'ANCHOR_FAILED' } });

    await auditLog({
      action: 'STATUS_CHANGE',
      entity: 'MerkleBatch',
      entityId: batchId,
      after: { status: 'ANCHOR_FAILED', error: String(err) },
    });

    throw err;
  }
}

export async function anchorAllSealed() {
  const failed = await prisma.merkleBatch.findMany({
    where: { status: 'ANCHOR_FAILED' },
    include: { anchor: true },
  });
  for (const b of failed) {
    if ((b.anchor?.attempts ?? 0) < MAX_ANCHOR_ATTEMPTS) {
      await prisma.merkleBatch.update({ where: { id: b.id }, data: { status: 'SEALED' } });
    }
  }

  const sealed = await prisma.merkleBatch.findMany({ where: { status: 'SEALED' } });
  const results: { batchId: string; txHash?: string; blockNumber?: number; error?: string }[] = [];
  for (const batch of sealed) {
    try {
      const r = await anchorBatch(batch.id);
      results.push({ batchId: batch.id, ...r });
    } catch (err) {
      results.push({ batchId: batch.id, error: String(err) });
    }
  }
  return results;
}
