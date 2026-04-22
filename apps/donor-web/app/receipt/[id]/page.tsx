'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { donations } from '@/lib/api';

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const donationId = typeof params?.id === 'string' ? params.id : '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donation, setDonation] = useState<any>(null);

  useEffect(() => {
    if (!donationId) {
      setError('Invalid receipt link');
      setLoading(false);
      return;
    }
    donations.get(donationId).then((res) => {
      if (!res.success || !res.data) {
        setError(res.error?.message || 'Receipt not found');
        setLoading(false);
        return;
      }
      setDonation(res.data);
      setLoading(false);
    });
  }, [donationId]);

  if (loading) return <div className="py-16 text-center text-gray-400">Loading receipt...</div>;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>
        <button
          type="button"
          onClick={() => router.push('/history')}
          className="mt-6 rounded-lg bg-gold-500 px-4 py-2 text-white hover:bg-gold-600"
        >
          Go to history
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-gray-900">Payment Receipt</h1>
      <p className="mt-1 text-gray-500">Donation successfully recorded on Kanak Setu.</p>
      <div className="mt-6 rounded-xl border bg-white p-5 text-sm">
        <p>
          <strong>Institution:</strong> {donation?.institution?.publicName || 'Institution'}
        </p>
        <p className="mt-2">
          <strong>Amount:</strong> ₹{((donation?.amountPaise || 0) / 100).toFixed(2)}
        </p>
        <p className="mt-2">
          <strong>Status:</strong> {donation?.status || 'PAYMENT_CONFIRMED'}
        </p>
        <p className="mt-2">
          <strong>Donation Ref:</strong> {donation?.donationRef || donation?.id}
        </p>
        {donation?.goldQuantityMg && (
          <p className="mt-2">
            <strong>Gold Allocated:</strong> {parseFloat(donation.goldQuantityMg).toFixed(2)} mg
          </p>
        )}
        <p className="mt-2">
          <strong>Date:</strong>{' '}
          {new Date(donation?.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/history')}
          className="rounded-lg bg-gold-500 px-4 py-2 text-white hover:bg-gold-600"
        >
          View donation history
        </button>
        <button
          type="button"
          onClick={() => router.push('/institutions')}
          className="rounded-lg border border-gold-300 px-4 py-2 text-gold-700 hover:bg-gold-50"
        >
          Donate again
        </button>
      </div>
    </div>
  );
}
