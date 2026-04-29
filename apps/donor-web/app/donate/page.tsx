'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { donations, institutions } from '@/lib/api';
import { DonationStepIndicator } from '@/components/DonorComponents';

function DonateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const institutionId = searchParams.get('institution') || '';
  const institutionName = searchParams.get('name') || 'Institution';
  const institutionUpiId = searchParams.get('upi')?.trim() || '';

  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<
    'amount' | 'payment' | 'processing' | 'awaiting_confirmation' | 'error'
  >('amount');
  const [activeDonationId, setActiveDonationId] = useState('');
  const [upiReference, setUpiReference] = useState('');
  const [error, setError] = useState('');
  const [goldPrice, setGoldPrice] = useState(0);
  const [quoteSource, setQuoteSource] = useState<string | undefined>();
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string | null>(null);
  const [resolvedInstitutionName, setResolvedInstitutionName] = useState('');
  const [resolvedUpiId, setResolvedUpiId] = useState('');

  useEffect(() => {
    donations.quote().then((res) => {
      if (res.success) {
        setGoldPrice(res.data.pricePerGramPaise);
        setQuoteSource((res.data as { source?: string }).source);
      }
    });
  }, []);

  useEffect(() => {
    if (!institutionId) return;
    let cancelled = false;
    institutions.byId(institutionId).then((res) => {
      if (cancelled || !res.success || !res.data) return;
      const data = res.data as { publicName?: string; upiId?: string | null };
      if (data.publicName) setResolvedInstitutionName(data.publicName);
      if (data.upiId) setResolvedUpiId(data.upiId);
    });
    return () => {
      cancelled = true;
    };
  }, [institutionId]);

  useEffect(() => {
    if (loading || user) return;
    const returnTo = `/donate${window.location.search}`;
    router.replace(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
  }, [loading, user, router]);

  const amountPaise = Math.round(parseFloat(amount || '0') * 100);
  const goldEstimateMg = goldPrice > 0 ? ((amountPaise / goldPrice) * 1000).toFixed(2) : '0';
  const upiAmount = amountPaise > 0 ? (amountPaise / 100).toFixed(2) : '';
  const effectiveInstitutionName = resolvedInstitutionName || institutionName;
  const effectiveUpiId = institutionUpiId || resolvedUpiId;
  const upiLink = useMemo(() => {
    const receiver =
      effectiveUpiId || process.env.NEXT_PUBLIC_DONATION_UPI_ID?.trim() || 'kanaksetu@upi';
    const params = new URLSearchParams({
      pa: receiver,
      pn: effectiveInstitutionName,
      cu: 'INR',
      tn: `Donation to ${effectiveInstitutionName} via Kanak Setu`,
    });
    if (upiAmount) params.set('am', upiAmount);
    return `upi://pay?${params.toString()}`;
  }, [effectiveInstitutionName, effectiveUpiId, upiAmount]);

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
    if (amountPaise < 10000) {
      setError('Minimum donation is ₹100');
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

      setActiveDonationId(res.data.donationId);
      setStep('awaiting_confirmation');
    } catch (err: any) {
      setError(err.message);
      setStep('error');
    }
  };

  const goToPaymentStep = () => {
    if (amountPaise < 10000) {
      setError('Minimum donation is ₹100');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePaymentConfirmed = async () => {
    if (!activeDonationId) return;
    if (!upiReference.trim()) {
      setError('Enter UPI reference/UTR');
      return;
    }
    setStep('processing');
    setError('');
    const res = await donations.confirmPayment(activeDonationId, upiReference.trim());
    if (!res.success) {
      setError(res.error?.message || 'Could not confirm payment');
      setStep('awaiting_confirmation');
      return;
    }
    router.push(`/receipt/${activeDonationId}`);
  };

  if (step === 'awaiting_confirmation') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <DonationStepIndicator step={3} />
        <h1 className="mt-2 font-display text-2xl font-bold text-gray-900">Complete UPI Payment</h1>
        <p className="mt-2 text-gray-600">
          Pay via UPI for <strong>{effectiveInstitutionName}</strong>, then enter your UPI reference/UTR to generate
          receipt.
        </p>
        <div className="mt-6 rounded-xl border border-gold-200 bg-white p-4 text-left">
          <p className="text-sm text-gray-700">
            <strong>Amount:</strong> ₹{(amountPaise / 100).toFixed(2)}
          </p>
          <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {upiQrDataUrl ? (
              <img src={upiQrDataUrl} alt="UPI payment QR code" className="h-40 w-40 rounded-lg border p-2" />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed text-xs text-gray-400">
                Generating QR...
              </div>
            )}
            <div>
              <a href={upiLink} className="inline-block text-sm font-medium text-gold-700 hover:underline">
                Open in UPI app
              </a>
              <p className="mt-2 text-xs text-gray-500">
                After payment, copy UTR/reference number from your UPI app and submit below.
              </p>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 text-left">
          <label className="block text-sm font-medium text-gray-700">UPI Reference / UTR</label>
          <input
            type="text"
            value={upiReference}
            onChange={(e) => setUpiReference(e.target.value)}
            placeholder="e.g. 431245678901"
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handlePaymentConfirmed}
            className="rounded-lg bg-gold-500 px-6 py-2 text-white hover:bg-gold-600"
          >
            Confirm Payment & View Receipt
          </button>
          <button
            onClick={() => {
              setStep('amount');
              setAmount('');
              setActiveDonationId('');
              setUpiReference('');
              setError('');
            }}
            className="rounded-lg border border-gold-300 px-6 py-2 text-gold-700 hover:bg-gold-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return <div className="py-16 text-center text-gray-400">Redirecting to sign in...</div>;
  }

  if (step === 'processing') {
    return <div className="py-16 text-center text-gray-500">Processing payment update...</div>;
  }

  if (step === 'payment') {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <DonationStepIndicator step={2} />
        <h1 className="font-display text-2xl font-bold text-gray-900">Pay using UPI QR</h1>
        <p className="mt-1 text-gray-600">
          Institution: <strong className="text-gold-700">{effectiveInstitutionName}</strong>
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Amount: <strong>₹{(amountPaise / 100).toFixed(2)}</strong>
        </p>

        <div className="mt-6 rounded-xl border border-gold-200 bg-white p-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {upiQrDataUrl ? (
              <img src={upiQrDataUrl} alt="UPI payment QR code" className="h-40 w-40 rounded-lg border p-2" />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed text-xs text-gray-400">
                Generating QR...
              </div>
            )}
            <div className="text-sm text-gray-600">
              <a href={upiLink} className="inline-block text-sm font-medium text-gold-700 hover:underline">
                Open in UPI app
              </a>
              <p className="mt-2 text-xs text-gray-500">
                After payment, click below to continue and submit UTR/reference.
              </p>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleDonate}
            className="rounded-lg bg-gold-600 px-6 py-2 text-white hover:bg-gold-700"
          >
            I Have Paid
          </button>
          <button
            onClick={() => setStep('amount')}
            className="rounded-lg border border-gold-300 px-6 py-2 text-gold-700 hover:bg-gold-50"
          >
            Change Amount
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <DonationStepIndicator step={1} />
      <h1 className="font-display text-2xl font-bold text-gray-900">Donate Gold</h1>
      <p className="mt-1 text-gray-500">
        To: <strong className="text-gold-700">{effectiveInstitutionName}</strong>
      </p>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mt-8 space-y-6 rounded-2xl border border-gold-100 bg-white p-5 shadow-sm">
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

        <button
          onClick={goToPaymentStep}
          disabled={amountPaise < 10000}
          className="w-full rounded-xl bg-gold-600 py-3.5 text-lg font-semibold text-white shadow-lg transition hover:bg-gold-700 disabled:opacity-50"
        >
          Continue to UPI QR
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
