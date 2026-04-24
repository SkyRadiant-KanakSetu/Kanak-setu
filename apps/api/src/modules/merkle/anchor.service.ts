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
const ANCHOR_RETRY_BASE_MS = Math.max(1000, parseInt(process.env.ANCHOR_RETRY_BASE_MS || '60000', 10));
const MIN_LEAVES_TO_ANCHOR = Math.max(1, parseInt(process.env.MERKLE_MIN_LEAVES_TO_ANCHOR || '1', 10));
const EXPECTED_CHAIN_ID = 80002;

function logAnchor(event: string, metadata: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify({
      module: 'anchor',
      event,
      at: new Date().toISOString(),
      ...metadata,
    })
  );
}

function getProvider() {
  return new ethers.JsonRpcProvider(
    process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'
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

export async function assertAnchorRuntimeReady() {
  if (process.env.ENABLE_BLOCKCHAIN_ANCHORING === '0') return;
  if (!process.env.POLYGON_RPC_URL) {
    throw new AppError(500, 'CONFIG', 'POLYGON_RPC_URL not configured');
  }
  if (!process.env.ANCHOR_PRIVATE_KEY) {
    throw new AppError(500, 'CONFIG', 'ANCHOR_PRIVATE_KEY not configured');
  }
  if (!process.env.ANCHOR_CONTRACT_ADDRESS) {
    throw new AppError(500, 'CONFIG', 'ANCHOR_CONTRACT_ADDRESS not configured');
  }
  const configuredChainId = parseInt(process.env.CHAIN_ID || '0', 10);
  if (configuredChainId !== EXPECTED_CHAIN_ID) {
    throw new AppError(500, 'CHAIN_ID_MISMATCH', `CHAIN_ID must be ${EXPECTED_CHAIN_ID} for Amoy`);
  }

  const provider = getProvider();
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== EXPECTED_CHAIN_ID) {
    throw new AppError(
      500,
      'RPC_CHAIN_MISMATCH',
      `RPC is chain ${network.chainId.toString()}, expected ${EXPECTED_CHAIN_ID}`
    );
  }
}

function nextRetryDelayMs(attempts: number) {
  const exponent = Math.max(0, attempts - 1);
  return ANCHOR_RETRY_BASE_MS * Math.pow(2, Math.min(exponent, 5));
}

function rootToBytes32(merkleRoot: string): string {
  const mr = merkleRoot.replace(/^0x/i, '');
  if (mr.length !== 64) {
    throw new AppError(500, 'INVALID_ROOT', 'Merkle root must be 32-byte hex (64 chars)');
  }
  return '0x' + mr.toLowerCase();
}

export async function anchorBatch(batchId: string) {
  if (process.env.ENABLE_BLOCKCHAIN_ANCHORING === '0') {
    throw new AppError(400, 'ANCHOR_DISABLED', 'Blockchain anchoring is disabled by configuration');
  }
  await assertAnchorRuntimeReady();

  let batch = await prisma.merkleBatch.findUnique({
    where: { id: batchId },
    include: { anchor: true },
  });
  if (!batch) throw new AppError(404, 'NOT_FOUND', 'Batch not found');

  if (batch.status === 'ANCHORED') {
    return { txHash: batch.anchor?.txHash || null, blockNumber: batch.anchor?.blockNumber || null };
  }

  if (batch.status === 'ANCHORING') {
    throw new AppError(409, 'ANCHOR_IN_PROGRESS', `Batch ${batchId} is already anchoring`);
  }

  if (!['SEALED', 'ANCHOR_FAILED'].includes(batch.status)) {
    throw new AppError(400, 'INVALID_STATE', `Batch ${batchId} is not eligible for anchor`);
  }
  if (!batch.merkleRoot) throw new AppError(400, 'INVALID_STATE', 'Batch has no merkle root');
  if ((batch.leafCount || 0) < MIN_LEAVES_TO_ANCHOR) {
    throw new AppError(
      400,
      'ANCHOR_MIN_LEAVES',
      `Batch ${batchId} has ${batch.leafCount} leaves, minimum ${MIN_LEAVES_TO_ANCHOR} required`
    );
  }

  let anchor = await prisma.blockchainAnchor.findUnique({ where: { batchId } });
  if (!anchor) {
    anchor = await prisma.blockchainAnchor.create({
      data: {
        batchId,
        network: process.env.CHAIN_ID === '137' ? 'polygon_mainnet' : 'polygon_amoy',
        merkleRoot: batch.merkleRoot,
        status: 'PENDING',
      },
    });
  }

  const attempts = anchor.attempts ?? 0;
  if (attempts >= MAX_ANCHOR_ATTEMPTS) {
    throw new AppError(400, 'MAX_ANCHOR_ATTEMPTS', 'Anchor retries exhausted for this batch');
  }
  if (attempts > 0 && batch.status === 'ANCHOR_FAILED') {
    const lastAttemptAt = anchor.updatedAt?.getTime() || 0;
    const retryAt = lastAttemptAt + nextRetryDelayMs(attempts);
    if (Date.now() < retryAt) {
      throw new AppError(
        429,
        'ANCHOR_RETRY_WAIT',
        `Retry backoff active. Next retry after ${new Date(retryAt).toISOString()}`
      );
    }
  }

  const lock = await prisma.merkleBatch.updateMany({
    where: { id: batchId, status: { in: ['SEALED', 'ANCHOR_FAILED'] } },
    data: { status: 'ANCHORING' },
  });
  if (lock.count === 0) {
    throw new AppError(409, 'ANCHOR_LOCKED', 'Batch state changed; retry anchor later');
  }

  const rootBytes = rootToBytes32(batch.merkleRoot);
  logAnchor('anchor_started', { batchId, batchNumber: batch.batchNumber, attempts: attempts + 1 });

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
      after: {
        status: 'ANCHORED',
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        attempts: attempts + 1,
      },
    });
    logAnchor('anchor_confirmed', {
      batchId,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      attempts: attempts + 1,
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
      after: { status: 'ANCHOR_FAILED', error: String(err), attempts: attempts + 1 },
    });
    logAnchor('anchor_failed', { batchId, error: String(err), attempts: attempts + 1 });

    throw err;
  }
}

export async function anchorAllSealed(force = false) {
  const sealed = await prisma.merkleBatch.findMany({
    where: { status: { in: ['SEALED', 'ANCHOR_FAILED'] } },
    orderBy: { sealedAt: 'asc' },
    include: { anchor: true },
  });
  const results: { batchId: string; txHash?: string; blockNumber?: number; error?: string }[] = [];
  for (const batch of sealed) {
    if (!force && (batch.leafCount || 0) < MIN_LEAVES_TO_ANCHOR) {
      results.push({
        batchId: batch.id,
        error: `Skipped by policy: leafCount ${batch.leafCount} below minimum ${MIN_LEAVES_TO_ANCHOR}`,
      });
      continue;
    }
    try {
      const r = await anchorBatch(batch.id);
      results.push({ batchId: batch.id, ...r });
    } catch (err) {
      results.push({ batchId: batch.id, error: String(err) });
    }
  }
  return results;
}
