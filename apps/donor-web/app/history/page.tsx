'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { donors } from '@/lib/api';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth');
      return;
    }
    donors.donations().then((res) => {
      if (res.success) setDonations(res.data || []);
      setLoading(false);
    });
  }, [user, authLoading, router]);

  const statusColor: Record<string, string> = {
    COMPLETED: 'bg-green-50 text-green-700',
    ANCHORED: 'bg-blue-50 text-blue-700',
    BATCHED: 'bg-indigo-50 text-indigo-700',
    PAYMENT_PENDING: 'bg-yellow-50 text-yellow-700',
    PAYMENT_CONFIRMED: 'bg-amber-50 text-amber-800',
    UNDER_REVIEW: 'bg-orange-50 text-orange-800',
    VENDOR_ORDER_PLACED: 'bg-sky-50 text-sky-800',
    PAYMENT_FAILED: 'bg-red-50 text-red-700',
    VENDOR_FAILED: 'bg-red-50 text-red-700',
    DISPUTED: 'bg-red-50 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-gray-900">My Donations</h1>

      {loading ? (
        <p className="mt-8 text-gray-400">Loading...</p>
      ) : donations.length === 0 ? (
        <p className="mt-8 text-gray-400">
          No donations yet.{' '}
          <a href="/institutions" className="text-gold-600 hover:underline">
            Browse institutions
          </a>
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {donations.map((d: any) => (
            <div key={d.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {d.institution?.publicName || 'Institution'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[d.status] || 'bg-gray-50 text-gray-600'}`}
                >
                  {d.status}
                </span>
              </div>
              <div className="mt-3 flex gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Amount:</span>{' '}
                  <strong>₹{(d.amountPaise / 100).toFixed(2)}</strong>
                </div>
                {d.goldQuantityMg && (
                  <div>
                    <span className="text-gray-400">Gold:</span>{' '}
                    <strong>{parseFloat(d.goldQuantityMg).toFixed(2)} mg</strong>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-3 text-xs">
                {d.certificates
                  ?.filter((c: any) => c.status === 'ISSUED')
                  .map((c: any) => (
                    <span key={c.id} className="rounded bg-gold-50 px-2 py-1 text-gold-700">
                      {c.type.replace('_', ' ')}
                    </span>
                  ))}
                {d.status === 'UNDER_REVIEW' && (
                  <p className="text-amber-700">
                    Payment received; compliance is reviewing this donation before gold is settled.
                  </p>
                )}
                {['COMPLETED', 'BATCHED', 'ANCHORED'].includes(d.status) && (
                  <button
                    type="button"
                    onClick={() => router.push(`/verify?donation=${d.id}`)}
                    className="rounded bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-100"
                  >
                    View Proof
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
