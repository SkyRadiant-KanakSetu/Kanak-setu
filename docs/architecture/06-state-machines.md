# State Machines

## Donation
- `CREATED` -> `PAYMENT_PENDING` -> (`PAYMENT_FAILED` | `PAYMENT_CONFIRMED`)
- `PAYMENT_CONFIRMED` -> `VENDOR_ORDER_PLACED` -> (`COMPLETED` | `VENDOR_FAILED`)
- Compliance branch: `PAYMENT_CONFIRMED` -> `UNDER_REVIEW` when institution is not active
- Proof branch: `COMPLETED` -> `BATCHED` -> `ANCHORED`

## Payment Transaction
- `CREATED` -> `AUTHORIZED` -> `CAPTURED`
- `CREATED` or `AUTHORIZED` -> `FAILED`
- Optional downstream state: `DISPUTED` and `REFUNDED`

## Institution
- `DRAFT` -> `SUBMITTED` -> `UNDER_REVIEW` -> `ACTIVE`
- Alternate: `REJECTED`, `SUSPENDED` with controlled transitions

## Merkle Batch
- `COLLECTING` -> `SEALED` -> `ANCHORED`
- Failure path: `SEALED` -> `ANCHOR_FAILED` -> retry to `SEALED` (bounded attempts)
