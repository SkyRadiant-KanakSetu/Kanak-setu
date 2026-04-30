'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { certificates, donors } from '@/lib/api';
import type { DonationListItem } from '@/lib/api';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<DonationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

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

  const handleDownloadCertificate = async (certId: string) => {
    try {
      setDownloadingCertId(certId);
      const res = await certificates.download(certId);
      if (!res.success || !res.data?.downloadUrl) {
        window.alert(res.error?.message || 'Certificate is not available yet');
        return;
      }
      window.open(res.data.downloadUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingCertId(null);
    }
  };

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
      <div className="rounded-3xl border border-gold-100 bg-gradient-to-r from-white via-gold-50 to-gold-100 p-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">My Donations</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track every donation, download receipts and certificates, and verify blockchain proofs.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-36 animate-pulse rounded-xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          <p>No donations yet.</p>
          <a href="/institutions" className="mt-2 inline-block font-medium text-gold-600 hover:underline">
            Browse institutions
          </a>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {donations.map((d) => (
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
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {d.certificates
                  ?.filter((c) => c.status === 'ISSUED')
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleDownloadCertificate(c.id)}
                      disabled={downloadingCertId === c.id}
                      className="rounded bg-gold-50 px-2 py-1 text-gold-700 hover:bg-gold-100 disabled:opacity-60"
                    >
                      {downloadingCertId === c.id
                        ? 'Preparing...'
                        : c.type === 'TAX_80G'
                          ? 'Download 80G Certificate'
                          : `Download ${c.type.replace('_', ' ')}`}
                    </button>
                  ))}
                {d.status === 'UNDER_REVIEW' && (
                  <p className="text-amber-700">
                    Payment received; compliance is reviewing this donation before gold is settled.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => router.push(`/receipt/${d.id}`)}
                  className="rounded bg-emerald-50 px-2 py-1 text-emerald-700 hover:bg-emerald-100"
                >
                  Download Receipt
                </button>
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
