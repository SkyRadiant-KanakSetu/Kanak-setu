'use client';

type Props = {
  geoData: any;
};

export function GeoReachPanel({ geoData }: Props) {
  if (!geoData) return <p className="mt-6 text-sm text-gray-500">Loading geo distribution...</p>;
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-white p-4">
        <p className="text-sm font-semibold text-gray-900">Top States</p>
        <div className="mt-3 space-y-2">
          {(geoData.states || []).slice(0, 8).map((s: any) => (
            <div key={s.state} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
              <span>{s.state}</span>
              <span className="font-semibold">{s.donations}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <p className="text-sm font-semibold text-gray-900">Top Cities</p>
        <div className="mt-3 space-y-2">
          {(geoData.cities || []).slice(0, 8).map((c: any) => (
            <div key={`${c.state}-${c.city}`} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
              <span>
                {c.city}, {c.state}
              </span>
              <span className="font-semibold">{c.donations}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
