import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Line,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar
} from "recharts";

const data = [
  { month: "May", tierA: 14, tierB: 10, tierC: 5 },
  { month: "Jun", tierA: 15, tierB: 11, tierC: 5.5 },
  { month: "Jul", tierA: 16, tierB: 11, tierC: 6 },
  { month: "Aug", tierA: 17, tierB: 12, tierC: 6 },
  { month: "Sep", tierA: 18, tierB: 13, tierC: 6.5 },
  { month: "Oct", tierA: 22, tierB: 15, tierC: 7.5 },
  { month: "Nov", tierA: 24, tierB: 16, tierC: 7 },
  { month: "Dec", tierA: 20, tierB: 14, tierC: 6.5 },
  { month: "Jan", tierA: 19, tierB: 13, tierC: 6 },
  { month: "Feb", tierA: 18, tierB: 13, tierC: 6 },
  { month: "Mar", tierA: 21, tierB: 14, tierC: 6.5 },
  { month: "Apr", tierA: 23, tierB: 15, tierC: 7 }
];

const metrics = [
  { title: "Annual Revenue", value: "₹3.1Cr" },
  { title: "Peak Month", value: "₹47L" },
  { title: "Net Profit", value: "₹1.15Cr" },
  { title: "Net Margin", value: "37%" }
];

const levers = [
  ["Festive", "+35%"],
  ["Subscribe & Save", "+22%"],
  ["Bundles AOV", "+18%"],
  ["Multi-platform", "+40%"],
  ["A+ Content", "+14%"]
];

const channelColors = ["#FF5C00", "#4C8BF5", "#A174FF", "#34D399", "#F59E0B"];

export default function Revenue({ live }) {
  const trendData = live?.liveTrend || [];
  const channelMix = live?.channelMix || [];

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Revenue Forecast (May 2026 - Apr 2027)</h3>

      <div className="grid grid-cols-4 gap-3">
        {metrics.map((card) => (
          <div key={card.title} className="rounded-lg bg-surface p-4">
            <p className="text-xs text-muted">{card.title}</p>
            <p className="mt-1 text-xl font-bold text-accent">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="h-[350px] rounded-lg bg-surface p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#283140" />
            <XAxis dataKey="month" stroke="#A0A9B8" />
            <YAxis stroke="#A0A9B8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="tierA" stackId="a" fill="#FF5C00" name="Tier A (Star SKUs)" />
            <Bar dataKey="tierB" stackId="a" fill="#4C8BF5" name="Tier B (Growth)" />
            <Bar dataKey="tierC" stackId="a" fill="#7D8CA3" name="Tier C (Monitor)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[300px] rounded-lg bg-surface p-3">
          <h4 className="mb-2 font-semibold">Target vs Actual Revenue Pulse (₹L)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#283140" />
              <XAxis dataKey="month" stroke="#A0A9B8" />
              <YAxis stroke="#A0A9B8" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="target" fill="#FF5C00" stroke="#FF5C00" fillOpacity={0.2} />
              <Line type="monotone" dataKey="actual" stroke="#34D399" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px] rounded-lg bg-surface p-3">
          <h4 className="mb-2 font-semibold">Marketplace Revenue Mix (Live)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={channelMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
                {channelMix.map((entry, idx) => (
                  <Cell key={entry.name} fill={channelColors[idx % channelColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[280px] rounded-lg bg-surface p-3">
          <h4 className="mb-2 font-semibold">Ad Spend Efficiency Trend (₹L)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#283140" />
              <XAxis dataKey="month" stroke="#A0A9B8" />
              <YAxis stroke="#A0A9B8" />
              <Tooltip />
              <Line type="monotone" dataKey="adSpend" stroke="#A174FF" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-surface p-4">
          <h4 className="mb-3 font-semibold">Profit Levers</h4>
          <div className="space-y-2">
            {levers.map(([name, impact]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-accent">{impact}</span>
                </div>
                <div className="h-2 rounded bg-white/10">
                  <div className="h-2 rounded bg-accent" style={{ width: impact.replace("+", "") }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
