function Delta({ value, positive = true }) {
  return (
    <span className={`text-xs font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
      {positive ? "▲" : "▼"} {value}
    </span>
  );
}

export default function LiveCommandDeck({ live }) {
  const { pulse } = live;
  const cards = [
    { label: "Orders / Hour", value: pulse.ordersPerHour, delta: "4.2%" },
    { label: "Live ROAS", value: `${pulse.roas}x`, delta: "2.1%" },
    { label: "Conversion", value: `${pulse.conversionRate}%`, delta: "1.4%" },
    { label: "Return Rate", value: `${pulse.returnRate}%`, delta: "0.3%", positive: false },
    { label: "Repeat Buyers", value: `${pulse.repeatRate}%`, delta: "1.1%" },
    { label: "At-Risk SKUs", value: pulse.atRiskSkus, delta: "0.8%", positive: false }
  ];

  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-surface/90 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold">Live Commerce Command Deck</h3>
        <p className="text-xs text-muted">
          Real-time sync: {new Date(pulse.updatedAt).toLocaleTimeString("en-IN")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-white/10 bg-bg/80 p-3">
            <p className="text-xs text-muted">{card.label}</p>
            <p className="mt-1 text-xl font-bold text-accent">{card.value}</p>
            <Delta value={card.delta} positive={card.positive !== false} />
          </div>
        ))}
      </div>
    </section>
  );
}
