'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-gold-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Kanak Setu" width={34} height={34} className="h-8 w-8 rounded-full" />
          <span className="font-display text-xl font-bold text-gold-700">Kanak Setu</span>
        </Link>
        <div className="flex items-center gap-2 text-sm md:gap-5">
          <Link
            href="/institutions"
            className="rounded-md px-2 py-1 text-gray-700 transition hover:bg-gold-50 hover:text-gold-700"
          >
            Institutions
          </Link>
          {user ? (
            <>
              <Link
                href="/history"
                className="rounded-md px-2 py-1 text-gray-700 transition hover:bg-gold-50 hover:text-gold-700"
              >
                My Donations
              </Link>
              <Link
                href="/profile"
                className="rounded-md px-2 py-1 text-gray-700 transition hover:bg-gold-50 hover:text-gold-700"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-gold-200 bg-gold-50 px-3 py-1.5 text-gold-800 transition hover:bg-gold-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-gold-600 px-4 py-1.5 font-medium text-white transition hover:bg-gold-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
