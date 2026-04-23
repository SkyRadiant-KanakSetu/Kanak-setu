const portfolioStats = [
  { label: "Monthly Revenue", value: "₹26L" },
  { label: "Net Margin", value: "38%" },
  { label: "Return Rate", value: "2.1%" },
  { label: "Repeat Buyers", value: "72%" }
];

export default function Sidebar({ tabs, activeTab, setActiveTab }) {
  return (
    <aside className="w-[220px] border-r border-white/10 bg-surface p-4">
      <h1 className="font-heading text-lg font-bold text-accent">Sky Radiant India</h1>
      <p className="mt-1 text-xs text-muted">Amazon Seller Command Centre</p>

      <nav className="mt-6 space-y-2">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              activeTab === tab.id ? "bg-accent text-black" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 space-y-2 rounded-lg bg-white/5 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Portfolio</h3>
        {portfolioStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between text-sm">
            <span className="text-muted">{stat.label}</span>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
