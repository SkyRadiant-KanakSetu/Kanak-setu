import { ethers } from 'ethers';

/**
 * Canonical donation leaf for Merkle inclusion (v1).
 * Order and field types fixed for tamper-evident hashing across services.
 * Serialize deterministically before hashing.
 */
export type DonationLeafV1 = {
  version: 1;
  donationId: string;
  institutionId: string;
  amountPaise: string;
  goldMg: string;
  createdAtIso: string;
};

export function donationLeafToCanonicalString(leaf: DonationLeafV1): string {
  return [
    `v=${leaf.version}`,
    `donationId=${leaf.donationId}`,
    `institutionId=${leaf.institutionId}`,
    `amountPaise=${leaf.amountPaise}`,
    `goldMg=${leaf.goldMg}`,
    `createdAt=${leaf.createdAtIso}`,
  ].join('|');
}

export function hashDonationLeaf(leaf: DonationLeafV1): string {
  const s = donationLeafToCanonicalString(leaf);
  return ethers.keccak256(ethers.toUtf8Bytes(s));
}

/** 32-byte leaf as lowercase hex without `0x` (DB / Merkle layer storage). */
export function donationLeafHashHex(leaf: DonationLeafV1): string {
  return hashDonationLeaf(leaf).replace(/^0x/i, '').toLowerCase();
}

/** Keccak-256 of sorted pair (32-byte hex each, no `0x`), Ethereum-style Merkle parent. */
export function merkleParentHash(aHex: string, bHex: string): string {
  const norm = (h: string) => (h.startsWith('0x') ? h.slice(2) : h).toLowerCase();
  let x = norm(aHex);
  let y = norm(bHex);
  if (x.length !== 64 || y.length !== 64) {
    throw new Error('merkleParentHash: expected 64 hex chars per node');
  }
  if (x > y) [x, y] = [y, x];
  const combined = ethers.concat([ethers.getBytes('0x' + x), ethers.getBytes('0x' + y)]);
  return ethers.keccak256(combined).replace(/^0x/i, '').toLowerCase();
}
