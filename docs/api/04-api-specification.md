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

### Donors (phone OTP only)

Email/password auth is **not** available for the `DONOR` role. The API returns `DONOR_EMAIL_AUTH_DISABLED` if `POST /auth/register` or `POST /auth/login` is used with a donor account.

- `POST /auth/login/phone/request-otp` — body: `{ "phone": "<digits>" }` (existing donor)
- `POST /auth/login/phone/verify-otp` — body: `{ "phone": "<digits>", "otp": "<6 digits>" }`
- `POST /auth/signup/phone/request-otp` — body: `{ "phone": "<digits>" }` (new donor; phone must not already exist)
- `POST /auth/signup/phone/verify-otp` — body: `{ "phone", "otp", "firstName", "lastName" }`

Responses use the same token envelope as password login (`accessToken`, `refreshToken`, `user`).

### Staff / admin (email + password)

These routes remain for non-donor roles (e.g. admin, institution):

- `POST /auth/register` — must not use role `DONOR` (donor registration is OTP-only)
- `POST /auth/login` — rejects if the user’s role is `DONOR`
- `POST /auth/refresh`
- `POST /auth/logout`

Example (admin):
```bash
curl -X POST http://127.0.0.1:4100/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kanaksetu.in","password":"<your-password>"}'
```

## Donor
- `GET /donors/me`
- `GET /donors/me/donations?page=1&limit=20`
- `POST /donations`

Expected `POST /donations` payload (minimum):
- `institutionId` (string)
- `amountPaise` (integer)

### Payments (dev / demo)

- `POST /payments/mock/simulate` — only when `ALLOW_MOCK_PAYMENT_SIMULATION=1`. Otherwise returns `MOCK_PAYMENT_DISABLED`. Production should use real gateway + webhooks instead of mock simulation.

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
