# Dependency Deferral Register
Last updated: 2026-05-01

This document records all intentionally deferred dependency advisories,
the technical rationale for deferral, and the conditions for re-evaluation.

---

## Active Deferrals

### GHSA-qx2v-qp2m-jg93 — postcss < 8.5.10

| Field            | Value |
|------------------|-------|
| Advisory ID      | GHSA-qx2v-qp2m-jg93 |
| Package          | postcss |
| Affected version | < 8.5.10 |
| Severity         | Moderate |
| Affected apps    | admin-web, donor-web, institution-web |
| Dependency path  | next → next/node_modules/postcss (internal bundle) |
| Date deferred    | 2026-05-01 |
| Next review      | 2026-05-15 or next Next.js patch release |
| Decision owner   | Engineering lead |

**Why this is not a runtime risk:**
The vulnerable `postcss` copy is bundled inside Next.js's internal build
toolchain at `next/node_modules/postcss`. It is not exposed to user input,
network traffic, or any runtime code path. The vulnerability only exists in
the build process context.

**Why the auto-fix was rejected:**
`npm audit fix --force` proposes downgrading Next.js to `9.3.3`. This version
predates the App Router architecture that Kanak Setu's web apps are built on.
Applying this fix would break all three web applications in production.
Force-fixing was explicitly rejected on 2026-05-01.

**Resolution path:**
1. Monitor the Next.js changelog and GitHub advisory database for a patch
   that resolves this without a major version change.
2. When a valid fix path exists (non-breaking Next.js patch or advisory
   retraction), execute in an isolated branch with full build matrix validation.
3. Re-run `npm audit --audit-level=moderate` after upgrade to confirm resolution.
4. Update this document with the resolution date and method.

**How to re-evaluate:**
```bash
# Check if advisory is resolved in the current Next.js version
cd apps/admin-web
npm audit --json | jq '[.vulnerabilities | to_entries[] |
  select(.value.via[]?.source == "GHSA-qx2v-qp2m-jg93")] | length'
# Returns 0 if resolved
```

**CI impact:**
The stage3-gate.sh and all CI audit checks are scoped to `--audit-level=high`.
This moderate advisory does not block CI, deploys, or Stage 3 declaration.

---

## Resolved Deferrals

_(Entries moved here after resolution with date and method recorded)_

---

## Review Schedule

| Advisory | Next Review | Trigger |
|----------|-------------|---------|
| GHSA-qx2v-qp2m-jg93 | 2026-05-15 | Next.js patch release or advisory update |
