'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  institutionId: string;
  publicName: string;
  publicPageSlug: string | null;
  upiId?: string | null;
  status: string;
};

function donorSiteBase(): string {
  const env = process.env.NEXT_PUBLIC_DONOR_SITE_URL?.trim().replace(/\/$/, '');
  if (env) return env;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.startsWith('institution.')) {
      return `${window.location.protocol}//${host.replace(/^institution\./, '')}`;
    }
    return window.location.origin;
  }
  return 'https://kanaksetu.com';
}

export function DonationQr({ institutionId, publicName, publicPageSlug, upiId, status }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);

  const donateUrl = useMemo(() => {
    const base = donorSiteBase();
    const upiParam = upiId?.trim();
    if (publicPageSlug && status === 'ACTIVE') {
      const q = new URLSearchParams();
      if (upiParam) q.set('upi', upiParam);
      const suffix = q.toString();
      return `${base}/give/${encodeURIComponent(publicPageSlug)}${suffix ? `?${suffix}` : ''}`;
    }
    const q = new URLSearchParams({
      institution: institutionId,
      name: publicName,
    });
    if (upiParam) q.set('upi', upiParam);
    return `${base}/donate?${q.toString()}`;
  }, [institutionId, publicName, publicPageSlug, status, upiId]);

  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then((QR) => QR.toDataURL(donateUrl, { width: 240, margin: 2, errorCorrectionLevel: 'M' }))
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [donateUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(donateUrl);
      setCopyOk(true);
      window.setTimeout(() => setCopyOk(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="font-serif text-lg font-semibold text-gray-900">Donation QR code</h2>
      <p className="mt-2 text-sm text-gray-600">
        Donors who scan this code open your donation page on Kanak Setu, sign in with phone OTP if needed, then
        donate. Each institution has a unique link (and QR).
      </p>
      {!publicPageSlug && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          Ask your platform admin to set a <strong>public page slug</strong> for a shorter QR. Until then, the link
          below uses your institution ID (still unique).
        </p>
      )}
      <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:items-start">
        {dataUrl ? (
          <img src={dataUrl} alt="Donation QR code" className="h-48 w-48 rounded-lg border bg-white p-2" />
        ) : (
          <div className="flex h-48 w-48 items-center justify-center rounded-lg border border-dashed text-xs text-gray-400">
            Generating QR…
          </div>
        )}
        <div className="min-w-0 flex-1 text-sm">
          <p className="break-all font-mono text-xs text-gray-700">{donateUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-lg border border-amber-800 bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800"
            >
              {copyOk ? 'Copied' : 'Copy link'}
            </button>
            {dataUrl && (
              <a
                href={dataUrl}
                download={`kanak-setu-donate-qr.png`}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Download QR (PNG)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
