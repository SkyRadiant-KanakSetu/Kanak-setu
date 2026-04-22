'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { institutions } from '@/lib/api';

/**
 * Short donate link per institution: /give/{publicPageSlug}
 * Redirects to /donate?institution=…&name=… so unauthenticated users still hit the same auth+returnTo flow.
 */
export default function GiveBySlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setError('Invalid link');
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await institutions.bySlug(slug);
      if (cancelled) return;
      if (!res.success || !res.data) {
        setError(res.error?.message || 'Institution not found');
        return;
      }
      const { id, publicName, upiId } = res.data as { id: string; publicName: string; upiId?: string | null };
      const q = new URLSearchParams({
        institution: id,
        name: publicName,
      });
      if (upiId) q.set('upi', upiId);
      router.replace(`/donate?${q.toString()}`);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>
        <button
          type="button"
          onClick={() => router.push('/institutions')}
          className="mt-6 text-sm font-medium text-gold-700 underline"
        >
          Browse institutions
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 text-center text-gray-500">
      <p>Opening donation page…</p>
    </div>
  );
}
