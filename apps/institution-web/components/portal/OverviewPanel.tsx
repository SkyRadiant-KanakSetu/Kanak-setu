'use client';

type Props = {
  dashboard: any;
  rangeDays: 7 | 30 | 90;
  setRangeDays: (v: 7 | 30 | 90) => void;
};

export function OverviewPanel({ dashboard, rangeDays, setRangeDays }: Props) {
  if (!dashboard) return null;
  const cards = [
    { label: 'Total Donations', value: dashboard.totalDonations },
    { label: 'Total Gold (mg)', value: Number(dashboard.totalGoldMg || 0).toFixed(2), amber: true },
    { label: 'Total Gold (grams)', value: (Number(dashboard.totalGoldMg || 0) / 1000).toFixed(4), amber: true },
    { label: 'Unique Donors', value: dashboard.uniqueDonors ?? 0 },
    { label: 'Repeat Donors', value: dashboard.repeatDonors ?? 0 },
    { label: `Active Donors (${dashboard.rangeDays ?? 30}d)`, value: dashboard.activeDonorsInRange ?? 0 },
  ];
  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.amber ? 'text-amber-700' : ''}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setRangeDays(d as 7 | 30 | 90)}
            className={`rounded px-3 py-1 text-xs ${rangeDays === d ? 'bg-amber-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {d}d
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border bg-white p-4">
        <p className="text-xs text-gray-500">Donor trend ({dashboard.rangeDays}d)</p>
        <div className="mt-2 text-sm text-gray-600">
          Use this panel to monitor daily donation and active-donor momentum for your spiritual outreach.
        </div>
      </div>
    </>
  );
}
