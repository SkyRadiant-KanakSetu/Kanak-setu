import { useEffect, useState } from "react";
import { getSystemStatus, getCommandFeed, runCommandCycle, updateSystemControls } from "../lib/api";
import ActionTimeline from "./ActionTimeline";

function Kpi({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-bg/80 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-accent">{value}</p>
    </div>
  );
}

export default function MissionControl() {
  const [status, setStatus] = useState(null);
  const [feed, setFeed] = useState({ actions: [], snapshots: [], controls: {}, queueSize: 0 });
  const [busy, setBusy] = useState(false);

  const sync = async () => {
    const [sys, commands] = await Promise.all([getSystemStatus(), getCommandFeed()]);
    setStatus(sys);
    setFeed(commands);
  };

  useEffect(() => {
    sync();
    const timer = setInterval(sync, 7000);
    return () => clearInterval(timer);
  }, []);

  const runCycle = async () => {
    setBusy(true);
    try {
      await runCommandCycle();
      await sync();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (key, value) => {
    await updateSystemControls({ [key]: value });
    await sync();
  };

  const snap = status?.latestSnapshot;
  const controls = status?.controls || {};

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-semibold">Mission Control</h3>
            <p className="text-xs text-muted">Autonomous ecommerce command center connected to Seller operations.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={runCycle}
              disabled={busy}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {busy ? "Running..." : "Run Command Cycle"}
            </button>
            <button
              type="button"
              onClick={() => toggle("killSwitch", !controls.killSwitch)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                controls.killSwitch ? "bg-rose-600" : "bg-emerald-600"
              }`}
            >
              {controls.killSwitch ? "Kill Switch: ON" : "Kill Switch: OFF"}
            </button>
            <button
              type="button"
              onClick={() => toggle("autoExecution", !controls.autoExecution)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                controls.autoExecution ? "bg-blue-600" : "bg-zinc-600"
              }`}
            >
              {controls.autoExecution ? "Auto Execute: ON" : "Auto Execute: OFF"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Orders / Hour" value={snap?.ordersPerHour || "--"} />
        <Kpi label="Buy Box Win Rate" value={snap ? `${snap.buyBoxWinRate}%` : "--"} />
        <Kpi label="Return Rate" value={snap ? `${snap.returnRate}%` : "--"} />
        <Kpi label="Low Stock SKUs" value={snap?.lowStockSkus || "--"} />
        <Kpi label="Queue Depth" value={feed.queueSize ?? "--"} />
      </div>

      <ActionTimeline actions={feed.actions || []} />
    </section>
  );
}
