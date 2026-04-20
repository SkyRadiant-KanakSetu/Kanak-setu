'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { institutions } from '@/lib/api';

interface Institution {
  id: string;
  publicName: string;
  type: string;
  description: string;
  city: string;
  state: string;
  publicPageSlug: string | null;
  has80G: boolean;
}

export default function InstitutionsPage() {
  const [list, setList] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    institutions.list().then((res) => {
      if (res.success) setList(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-gray-900">Institutions</h1>
      <p className="mt-2 text-gray-500">
        Browse verified temples and institutions accepting digital gold donations
      </p>

      {loading ? (
        <div className="mt-12 text-center text-gray-400">Loading...</div>
      ) : list.length === 0 ? (
        <div className="mt-12 text-center text-gray-400">No active institutions yet</div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((inst) => (
            <Link
              key={inst.id}
              href={
                inst.publicPageSlug
                  ? `/give/${encodeURIComponent(inst.publicPageSlug)}`
                  : `/donate?institution=${inst.id}&name=${encodeURIComponent(inst.publicName)}`
              }
              className="group rounded-2xl border border-gold-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gold-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gold-700">
                    {inst.publicName}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold-600">
                    {inst.type.replace('_', ' ')}
                  </p>
                </div>
                {inst.has80G && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    80G
                  </span>
                )}
              </div>
              {inst.description && (
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">{inst.description}</p>
              )}
              <p className="mt-3 text-xs text-gray-400">
                {inst.city}, {inst.state}
              </p>
              <div className="mt-4 text-sm font-medium text-gold-600 group-hover:text-gold-800">
                Donate Gold →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
