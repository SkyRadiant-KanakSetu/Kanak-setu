# Web Lint/Type Warning Policy (Staged Rollout)

This policy prevents warning debt from growing while allowing gradual cleanup.

## Stage Model

- `budget` (default now)
  - CI fails if any web app exceeds its warning budget.
  - CI also fails on any ESLint error.
  - Type/build checks still must pass.
- `strict` (target state)
  - CI fails on any warning (`0` warnings required).
  - CI fails on any ESLint error.
  - Type/build checks still must pass.

The stage is controlled by CI variable:

- `WEB_WARNING_POLICY_STAGE=budget|strict`

## Budget File

Warning budgets are stored in `web-warning-budgets.json`:

- `apps/admin-web`
- `apps/donor-web`
- `apps/institution-web`

In `budget` stage, warning counts must be less than or equal to these values.

## CI Gate

Workflow: `.github/workflows/web-quality-gate.yml`

Script: `scripts/security/web-quality-gate.sh`

What it does:

1. Runs ESLint on web apps and aggregates warnings/errors by app.
2. Enforces selected stage (`budget` or `strict`).
3. Runs web builds with `--no-lint` to verify compile/type stability separately.

## Operational Rollout

1. Start with `budget` stage (already enabled).
2. Reduce each app budget after every warning cleanup PR.
3. When all budgets reach `0`, switch CI variable to `strict`.
4. Keep strict permanently to block warning regressions.
