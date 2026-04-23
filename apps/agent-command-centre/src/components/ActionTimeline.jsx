function statusClass(status) {
  if (status === "EXECUTED") return "text-emerald-400";
  if (status === "FAILED") return "text-rose-400";
  if (status === "REJECTED" || status === "BLOCKED") return "text-amber-400";
  return "text-white";
}

export default function ActionTimeline({ actions }) {
  return (
    <div className="rounded-lg bg-surface p-4">
      <h4 className="mb-3 font-semibold">Action Timeline</h4>
      <div className="max-h-[420px] space-y-2 overflow-y-auto">
        {actions.length === 0 && <p className="text-sm text-muted">No actions logged yet.</p>}
        {actions.map((item) => (
          <div key={item.id} className="rounded-lg border border-white/10 bg-bg/80 p-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium">{item.type}</p>
              <span className={`text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Confidence {item.confidence || "-"} · {new Date(item.updatedAt || item.createdAt).toLocaleString("en-IN")}
            </p>
            {item.note && <p className="mt-2 text-xs text-gray-200">{item.note}</p>}
            {item.error && <p className="mt-2 text-xs text-rose-300">{item.error}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
