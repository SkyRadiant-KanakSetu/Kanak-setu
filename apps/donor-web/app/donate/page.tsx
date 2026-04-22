'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { donations, mockPayment } from '@/lib/api';

function DonateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const institutionId = searchParams.get('institution') || '';
  const institutionName = searchParams.get('name') || 'Institution';
  const institutionUpiId = searchParams.get('upi')?.trim() || '';

  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'amount' | 'processing' | 'success' | 'error'>('amount');
  const [donationResult, setDonationResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [goldPrice, setGoldPrice] = useState(0);
  const [quoteSource, setQuoteSource] = useState<string | undefined>();
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    donations.quote().then((res) => {
      if (res.success) {
        setGoldPrice(res.data.pricePerGramPaise);
        setQuoteSource((res.data as { source?: string }).source);
      }
    });
  }, []);

  useEffect(() => {
    if (loading || user) return;
    const returnTo = `/donate${window.location.search}`;
    router.replace(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
  }, [loading, user, router]);

  const amountPaise = Math.round(parseFloat(amount || '0') * 100);
  const goldEstimateMg = goldPrice > 0 ? ((amountPaise / goldPrice) * 1000).toFixed(2) : '0';
  const upiAmount = amountPaise > 0 ? (amountPaise / 100).toFixed(2) : '';
  const upiLink = useMemo(() => {
    const receiver =
      institutionUpiId || process.env.NEXT_PUBLIC_DONATION_UPI_ID?.trim() || 'kanaksetu@upi';
    const params = new URLSearchParams({
      pa: receiver,
      pn: institutionName,
      cu: 'INR',
      tn: `Donation to ${institutionName} via Kanak Setu`,
    });
    if (upiAmount) params.set('am', upiAmount);
    return `upi://pay?${params.toString()}`;
  }, [institutionName, institutionUpiId, upiAmount]);

  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then((QR) => QR.toDataURL(upiLink, { width: 220, margin: 2, errorCorrectionLevel: 'M' }))
      .then((url) => {
        if (!cancelled) setUpiQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setUpiQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [upiLink]);

  const handleDonate = async () => {
    if (!user) {
      const returnTo = `/donate${window.location.search}`;
      router.push(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    if (amountPaise < 100) {
      setError('Minimum ₹1');
      return;
    }

    setStep('processing');
    setError('');
    try {
      const res = await donations.create({
        institutionId,
        amountPaise,
        idempotencyKey: `${user.id}-${institutionId}-${Date.now()}`,
      });
      if (!res.success) throw new Error(res.error?.message || 'Failed to create donation');

      // Simulate payment (in production, open Razorpay checkout here)
      const simRes = await mockPayment.simulate(res.data.donationId, 'CAPTURED');
      if (!simRes.success) {
        if (simRes.error?.code === 'MOCK_PAYMENT_DISABLED') {
          throw new Error(
            'Mock payments are off on the server. For demos, set ALLOW_MOCK_PAYMENT_SIMULATION=1 on the API and redeploy; otherwise use a real payment integration.'
          );
        }
        throw new Error(simRes.error?.message || 'Payment simulation failed');
      }

      setDonationResult(simRes.data);
      setStep('success');
    } catch (err: any) {
      setError(err.message);
      setStep('error');
    }
  };

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">Donation Complete!</h1>
        <p className="mt-2 text-gray-500">
          Your digital gold donation to {institutionName} has been processed.
        </p>
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">
          <p>
            <strong>Amount:</strong> ₹{(amountPaise / 100).toFixed(2)}
          </p>
          <p>
            <strong>Gold Allocated:</strong> ~{donationResult?.goldQuantityMg || goldEstimateMg} mg
          </p>
          <p>
            <strong>Status:</strong> {donationResult?.status || 'COMPLETED'}
          </p>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => router.push('/history')}
            className="rounded-lg bg-gold-500 px-6 py-2 text-white hover:bg-gold-600"
          >
            View Donations
          </button>
          <button
            onClick={() => {
              setStep('amount');
              setAmount('');
            }}
            className="rounded-lg border border-gold-300 px-6 py-2 text-gold-700 hover:bg-gold-50"
          >
            Donate Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return <div className="py-16 text-center text-gray-400">Redirecting to sign in...</div>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-gray-900">Donate Gold</h1>
      <p className="mt-1 text-gray-500">
        To: <strong className="text-gold-700">{institutionName}</strong>
      </p>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mt-8 space-y-6">
        {/* Quick amounts */}
        <div className="flex flex-wrap gap-3">
          {[500, 1000, 2500, 5000, 10000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${amount === String(v) ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 hover:border-gold-300'}`}
            >
              ₹{v.toLocaleString()}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="1"
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-lg focus:border-gold-400 focus:outline-none"
            placeholder="Enter amount"
          />
        </div>

        {goldPrice > 0 && parseFloat(amount) > 0 && (
          <div className="rounded-xl bg-gold-50 p-4">
            <p className="text-sm text-gold-800">
              <strong>Estimated gold:</strong> ~{goldEstimateMg} mg
              <span className="ml-2 text-xs text-gold-500">
                (@ ₹{(goldPrice / 100).toFixed(0)}/g, indicative)
              </span>
            </p>
            <p className="mt-1 text-xs text-gold-600/90">
              {quoteSource === 'live_spot' && 'Rate: live spot (INR, refreshed about every minute).'}
              {quoteSource === 'stale_cache' && 'Rate: last successful live quote (feed slow; retrying).'}
              {quoteSource === 'fallback_static' && 'Rate: fallback — live feed unavailable; check API logs.'}
              {quoteSource === 'mock' && 'Rate: demo fixed price (set GOLD_VENDOR=LIVE_SPOT on API for live).'}
              {!quoteSource && 'Rate: indicative only.'}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-gold-200 bg-white p-4">
          <h2 className="text-base font-semibold text-gray-900">Pay using UPI QR</h2>
          <p className="mt-1 text-sm text-gray-600">
            Scan this QR to pay for <strong>{institutionName}</strong> through any UPI app.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {upiQrDataUrl ? (
              <img src={upiQrDataUrl} alt="UPI payment QR code" className="h-40 w-40 rounded-lg border p-2" />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed text-xs text-gray-400">
                Generating QR...
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>
                Amount: <strong>₹{amount || '0'}</strong>
              </p>
              <a href={upiLink} className="mt-2 inline-block text-sm font-medium text-gold-700 hover:underline">
                Open in UPI app
              </a>
              <p className="mt-2 text-xs text-gray-500">
                If amount is entered above, it is auto-filled in the UPI request.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDonate}
          disabled={step === 'processing' || !amount}
          className="w-full rounded-xl bg-gold-500 py-3.5 text-lg font-semibold text-white shadow-lg hover:bg-gold-600 disabled:opacity-50 transition"
        >
          {step === 'processing' ? 'Processing...' : `Donate ₹${amount || '0'} as Gold`}
        </button>

        <p className="text-center text-xs text-gray-400">
          Payment processed securely. Gold allocated via verified vendor. Blockchain-anchored proof
          generated.
        </p>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading...</div>}>
      <DonateForm />
    </Suspense>
  );
}
