export default function TopBar({ live }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-bg/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">Seller Command Centre</h2>
          <p className="text-sm text-muted">
            White-label growth operating system for Amazon.in, Flipkart, Nykaa, Meesho, and JioMart.
          </p>
        </div>
        <div className="hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 md:block">
          <p className="text-xs text-emerald-300">Live Signal: Healthy</p>
          <p className="text-xs text-muted">ROAS {live.pulse.roas}x · Returns {live.pulse.returnRate}%</p>
        </div>
      </div>
    </header>
  );
}
