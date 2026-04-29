'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { KsAvatar, KsAuthGuard, KsButton, KsNavItem } from '@kanak-setu/ui';

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} />
  </svg>
);

export function AdminLayout({
  children,
  email,
  onSignOut,
}: {
  children: ReactNode;
  email?: string;
  onSignOut?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard', href: '/', icon: icon('M3 12h8V3H3zM13 21h8v-8h-8zM13 3h8v6h-8zM3 21h8v-6H3z') },
      { key: 'institutions', label: 'Institutions', href: '/#institutions', icon: icon('M4 20h16M6 20V9l6-4 6 4v11M9 12h6') },
      { key: 'donations', label: 'Donations', href: '/#donations', icon: icon('M12 2v20M17 5H9a3 3 0 0 0 0 6h6a3 3 0 1 1 0 6H7') },
      { key: 'blockchain', label: 'Blockchain', href: '/#merkle', icon: icon('M12 3 4 7v10l8 4 8-4V7z') },
      { key: 'assistant', label: 'Master Agent', href: '/#assistant', icon: icon('M12 3a4 4 0 0 0-4 4v1H7a2 2 0 0 0-2 2v5h14v-5a2 2 0 0 0-2-2h-1V7a4 4 0 0 0-4-4z') },
      { key: 'webhooks', label: 'Webhooks', href: '/#webhooks', icon: icon('M4 12a4 4 0 0 1 4-4h2M20 12a4 4 0 0 0-4-4h-2M9 12h6M4 12a4 4 0 0 0 4 4h2M20 12a4 4 0 0 1-4 4h-2') },
      { key: 'audit', label: 'Audit Log', href: '/#audit', icon: icon('M7 3h10v18l-5-3-5 3z') },
    ],
    []
  );

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center gap-3 border-b border-stone-200 p-4">
        <div className="h-9 w-9 rounded-lg bg-gold-gradient shadow-ks-sm" />
        <div>
          <p className="font-display text-lg font-semibold text-stone-900">Kanak Setu</p>
          <p className="text-[11px] uppercase tracking-wide text-stone-500">Admin Console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <KsNavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === '/' && item.key === 'dashboard'}
            onClick={() => setOpen(false)}
          />
        ))}
      </nav>
      <div className="border-t border-stone-200 p-3">
        <div className="mb-3 flex items-center gap-2">
          <KsAvatar name={email || 'Admin'} />
          <p className="truncate text-xs text-stone-600">{email || 'admin@kanaksetu.in'}</p>
        </div>
        <KsButton variant="outline" size="sm" fullWidth onClick={onSignOut}>
          Sign out
        </KsButton>
      </div>
    </aside>
  );

  return (
    <KsAuthGuard storageKey="accessToken" loginPath="/">
      <div className="min-h-screen bg-[#fdf8f0]">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-[#fdf8f0]/95 px-4 py-3 backdrop-blur md:hidden">
          <KsButton variant="ghost" size="sm" onClick={() => setOpen((s) => !s)}>
            Menu
          </KsButton>
          <p className="text-sm font-medium text-stone-700">Admin</p>
        </header>
        <div className="flex min-h-screen">
          <div className="hidden md:block">{sidebar}</div>
          {open && (
            <div className="fixed inset-0 z-30 md:hidden">
              <button className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
              <div className="relative h-full">{sidebar}</div>
            </div>
          )}
          <main className="flex-1 p-5 md:p-6">{children}</main>
        </div>
      </div>
    </KsAuthGuard>
  );
}
