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
  upiId?: string | null;
  has80G: boolean;
}

export default function InstitutionsPage() {
  const [list, setList] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    institutions.list().then((res) => {
      if (res.success) setList(res.data || []);
      setLoading(false);
    });
  }, []);

  const typeOptions = ['ALL', ...Array.from(new Set(list.map((i) => i.type)))];
  const filtered = list.filter((inst) => {
    const matchesType = typeFilter === 'ALL' || inst.type === typeFilter;
    const haystack = `${inst.publicName} ${inst.description || ''} ${inst.city || ''} ${inst.state || ''}`
      .toLowerCase()
      .trim();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-3xl border border-gold-100 bg-gradient-to-br from-white via-gold-50 to-gold-100 p-6 md:p-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Verified Institutions</h1>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Choose where your digital gold should go. Search by name or location, and filter by institution type.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by institution, city, or state"
            className="w-full rounded-xl border border-gold-200 bg-white px-4 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gold-200 bg-white px-4 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t === 'ALL' ? 'All types' : t.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-52 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          No institutions match your filters.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((inst) => {
            const donateHref = inst.publicPageSlug
              ? `/give/${encodeURIComponent(inst.publicPageSlug)}`
              : `/donate?institution=${inst.id}&name=${encodeURIComponent(inst.publicName)}`;
            return (
            <Link
              key={inst.id}
              href={donateHref}
              className="group rounded-2xl border border-gold-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-lg"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
