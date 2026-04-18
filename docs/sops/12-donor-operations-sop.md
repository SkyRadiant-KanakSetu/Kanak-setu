# Donor Operations SOP

## Donation Journey Support
1. Confirm donor authentication: donors sign in via **phone OTP** only (no email/password on donor app or donor API). Profile access requires a valid donor session.
2. Verify donation reference and payment status.
3. Track transitions from payment to allocation to proof/certificate.

## Common Support Cases
- Payment captured but donor sees pending.
- Donation moved to `UNDER_REVIEW`.
- Certificate unavailable after completion.
- Verification link not resolving.

## Resolution Path
1. Validate webhook and payment event records.
2. Validate donation and vendor order state.
3. Trigger/retry operational actions through admin if needed.
4. Share donor-facing status and ETA.

## Communication Rules
- Use donation reference for all customer communication.
- Do not expose internal identifiers or secrets.
