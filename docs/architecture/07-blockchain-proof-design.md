# Blockchain Proof Design

## Canonical Leaf
- Format: `DonationLeafV1`
- Fields: `version`, `donationId`, `institutionId`, `amountPaise`, `goldMg`, `createdAtIso`
- Hashing: keccak256 over canonical serialization.

## Merkle Tree
- Parent hash uses sorted-pair keccak.
- Empty set yields no root.
- Sealing stores root, leaf index, and proof path for each leaf.

## Anchoring
- Network: Polygon Amoy (current target).
- Contract stores Merkle root and emits anchor event.
- Failed anchors move batch to `ANCHOR_FAILED`; retries are bounded by max attempts.

## Verification
- Public proof endpoint returns leaf hash, root, proof, and on-chain tx metadata.
- Verification endpoint reconstructs proof and checks root equality.
