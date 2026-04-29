'use client';

import { type ReactNode } from 'react';
import { KsAuthGuard, KsBadge, KsButton, KsNavItem } from '@kanak-setu/ui';

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} />
  </svg>
);

export function InstitutionLayout({
  children,
  institutionName,
  onSignOut,
}: {
  children: ReactNode;
  institutionName?: string;
  onSignOut?: () => void;
}) {
  return (
    <KsAuthGuard storageKey="accessToken" loginPath="/">
      <div className="flex min-h-screen bg-[#fdf8f0]">
        <aside className="hidden w-60 flex-col border-r border-stone-200 bg-white p-3 md:flex">
          <div className="mb-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <p className="font-display text-lg text-stone-900">{institutionName || 'Institution'}</p>
            <KsBadge status="ACTIVE" className="mt-2" />
          </div>
          <div className="space-y-1">
            <KsNavItem icon={icon('M3 12h8V3H3zM13 21h8v-8h-8zM13 3h8v6h-8zM3 21h8v-6H3z')} label="Overview" href="/#overview" />
            <KsNavItem icon={icon('M4 6h16M4 12h16M4 18h16')} label="Recent Donations" href="/#donations" />
            <KsNavItem icon={icon('M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM3 21a7 7 0 0 1 14 0')} label="Donor Directory" href="/#donors" />
            <KsNavItem icon={icon('M4 20h16M7 16h10M9 12h6M10 8h4')} label="Gold Ledger" href="/#ledger" />
            <KsNavItem icon={icon('M12 8V4m0 16v-4m8-4h-4M8 12H4')} label="Settings" href="/#settings" />
          </div>
          <div className="mt-auto space-y-2 border-t border-stone-200 pt-3">
            <a href="/institutions" className="text-sm text-amber-600 hover:text-amber-700">
              View public donation page →
            </a>
            <KsButton variant="outline" size="sm" fullWidth onClick={onSignOut}>
              Sign out
            </KsButton>
          </div>
        </aside>
        <main className="flex-1 p-5 md:p-6">{children}</main>
      </div>
    </KsAuthGuard>
  );
}
