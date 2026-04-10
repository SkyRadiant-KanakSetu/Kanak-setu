'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-gold-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl font-bold text-gold-700">
          🪙 Kanak Setu
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/institutions" className="text-gray-600 hover:text-gold-700">
            Institutions
          </Link>
          {user ? (
            <>
              <Link href="/history" className="text-gray-600 hover:text-gold-700">
                My Donations
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gold-700">
                Profile
              </Link>
              <button
                onClick={logout}
                className="rounded-lg bg-gold-100 px-3 py-1.5 text-gold-800 hover:bg-gold-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-gold-500 px-4 py-1.5 text-white hover:bg-gold-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
