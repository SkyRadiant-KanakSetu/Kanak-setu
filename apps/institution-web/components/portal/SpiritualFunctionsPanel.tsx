'use client';

import { useState } from 'react';

type Props = {
  items: any[];
  onCreate: (payload: any) => Promise<void>;
};

export function SpiritualFunctionsPanel({ items, onCreate }: Props) {
  const [name, setName] = useState('');
  const [functionType, setFunctionType] = useState('SEVA');
  const [nextDate, setNextDate] = useState('');

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">Add Spiritual Function</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Function name"
            className="rounded border px-3 py-2 text-sm"
          />
          <select
            value={functionType}
            onChange={(e) => setFunctionType(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            {['PUJA', 'SEVA', 'FESTIVAL', 'COMMUNITY_SERVICE', 'EDUCATION', 'HEALTH', 'OTHER'].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          />
          <button
            onClick={async () => {
              if (!name.trim()) return;
              await onCreate({ name: name.trim(), functionType, nextDate: nextDate || undefined });
              setName('');
              setNextDate('');
            }}
            className="rounded bg-amber-700 px-3 py-2 text-sm text-white hover:bg-amber-800"
          >
            Create
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.functionType} {item.nextDate ? `• ${new Date(item.nextDate).toLocaleDateString('en-IN')}` : ''}
                </p>
              </div>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-800">{item.status}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">No spiritual functions yet.</p>}
      </div>
    </div>
  );
}
