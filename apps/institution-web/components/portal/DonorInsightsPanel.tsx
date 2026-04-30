'use client';
import type { Demographics } from '@/lib/api';

type Props = {
  demographics: Demographics | null;
};

export function DonorInsightsPanel({ demographics }: Props) {
  if (!demographics) return <p className="mt-6 text-sm text-gray-500">Loading donor insights...</p>;
  const age = demographics.ageBands || {};
  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-gray-500">Total Donations</p>
          <p className="text-2xl font-bold">{demographics.totalDonations || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-gray-500">Under 25</p>
          <p className="text-2xl font-bold">{age.under25 || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-gray-500">25-40</p>
          <p className="text-2xl font-bold">{age.from25to40 || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-gray-500">41+</p>
          <p className="text-2xl font-bold">{(age.from41to60 || 0) + (age.above60 || 0)}</p>
        </div>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <p className="text-sm font-semibold text-gray-900">Top Professions</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {(demographics.topProfessions || []).map((p) => (
            <div key={p.label} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
              <span>{p.label}</span>
              <span className="font-semibold">{p.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
