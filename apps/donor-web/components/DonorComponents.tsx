'use client';

import { KsBadge } from '@kanak-setu/ui';

export function DonorHeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
      Trusted Digital Gold Donations
    </div>
  );
}

export function DonationStepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-2">
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              step >= idx ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-500'
            }`}
          >
            {idx}
          </div>
          {idx < 3 && <div className={`h-0.5 w-10 ${step > idx ? 'bg-amber-700' : 'bg-stone-300'}`} />}
        </div>
      ))}
      <KsBadge className="ml-2">{`Step ${step} of 3`}</KsBadge>
    </div>
  );
}
