# Kanak Setu UI Upgrade Guide

## What changed

- `packages/ui/src/index.tsx` now exposes a full Temple Fintech component set.
- `tailwind.config.shared.js` provides shared typography, palette, shadows, animations, and gradients.
- All web apps now consume the shared Tailwind preset and UI package styles.
- Global API error handling now redirects on `401` and shows user-safe alert on `5xx`.

## New shared components

- Core: `KsButton`, `KsBadge`, `KsCard`, `KsStat`, `KsInput`, `KsSelect`, `KsTextarea`, `KsSearch`, `KsCheckbox`
- Layout/content: `KsTable`, `KsTabs`, `KsAlert`, `KsModal`, `KsEmpty`, `KsDivider`, `KsPageHeader`, `KsNavItem`
- Utilities: `KsSpinner`, `KsSkeleton`, `KsSkeletonCard`, `KsAvatar`, `KsCopyButton`, `KsHash`, `KsGoldAmount`
- Auth/fonts: `KsAuthGuard`, `KsFontLink`

## App-level highlights

- Admin: new sidebar shell component and guarded authenticated area.
- Institution: new sidebar shell component and conditional donor enrichment columns.
- Donor: improved institution card null-safe rendering and guided 3-step donation indicator.

## Bug fixes included

- Token expiry blank state replaced with forced sign-out redirect.
- Institution description/location null rendering fixed on donor listing.
- Onboard form browser autofill bleed reduced via form/input autocomplete-safe names.
- Donation minimum validation corrected to `₹100`.
- Profile enrichment columns hidden when all values are empty.

## Follow-up polish checklist

- Continue replacing remaining legacy per-page inline styles with `packages/ui` primitives.
- Expand route-level admin/institution navigation from tab-state to file-system pages.
- Add toast system to replace `window.alert` in API wrappers.
