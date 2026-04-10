# API Specification (Current)

Base URL: `/api/v1`

## Envelope Pattern
- Success: `{ success: true, data, requestId }`
- Error: `{ success: false, error: { code, message, details?, requestId } }`

## Authentication and Headers
- Access token: `Authorization: Bearer <jwt>`
- Request tracing: `x-request-id` (auto-generated if absent)
- JSON content type for all non-webhook API requests

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Example:
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kanaksetu.in","password":"password123"}'
```

## Donor
- `GET /donors/me`
- `GET /donors/me/donations?page=1&limit=20`
- `POST /donations`

Expected `POST /donations` payload (minimum):
- `institutionId` (string)
- `amountPaise` (integer)

## Institution
- `POST /institutions/portal/submit`
- `GET /institutions/portal/dashboard`

Submit route rule:
- Allowed only from `DRAFT` or `REJECTED`

## Admin
- `GET /admin/dashboard`
- `GET /admin/institutions?page=1&limit=20&status=UNDER_REVIEW`
- `PATCH /admin/institutions/:id/status`
- `GET /admin/webhooks/deliveries?page=1&limit=50`
- `POST /admin/reconciliation/run`

`PATCH /admin/institutions/:id/status` payload:
- `status`: one of `UNDER_REVIEW`, `ACTIVE`, `SUSPENDED`, `REJECTED`
- `notes`: optional string

## Webhooks
- `POST /webhooks/razorpay`
- `POST /webhooks/payu`

Verification:
- Razorpay: signature from `x-razorpay-signature`, validated against raw body.
- PayU: header/body hash checked using reverse hash formula with merchant key/salt.

## Merkle and Proof
- `POST /merkle/seal`
- `POST /merkle/anchor`
- `GET /merkle/proof/:donationId`
- `POST /merkle/verify`

`POST /merkle/verify` payload:
- `leafHash` (string, hex)
- `proof` ({ position: string[], hashes: string[] })
- `merkleRoot` (string, hex)

## Certificate Verification
- `GET /verify/:ref`

Response includes:
- certificate serial/type/status
- donation summary
- blockchain anchor metadata when available
