import { useState } from "react";
import { callAi } from "../lib/api";

const topics = [
  "Amazon Bestsellers",
  "Seller Forums",
  "Market Trends 2026",
  "White Label Sourcing",
  "Competitor Gaps",
  "Zero-Return + Repeat Buyers"
];

export default function Research({ onSendToAdvisor, live }) {
  const [results, setResults] = useState([]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const runResearch = async (topic) => {
    setLoading(true);
    try {
      const prompt = `Generate India-specific research intelligence for Sky Radiant India on: ${topic}.
Live signal: Orders/hour ${live.pulse.ordersPerHour}, ROAS ${live.pulse.roas}x, Return Rate ${live.pulse.returnRate}%, Repeat Rate ${live.pulse.repeatRate}%.
Output format:
1) What changed in last 30 days
2) Opportunity pockets (with rough margin bands)
3) Risk flags and return-rate prevention
4) 7-day action sprint.
Keep it practical and decision-ready.`;
      const response = await callAi([{ role: "user", content: prompt }]);
      setResults((prev) => [{ title: topic, content: response.content }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Research Engine</h3>
      <p className="text-xs text-muted">
        AI blends market research with live command signals for faster, higher-confidence decisions.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {topics.map((topic) => (
          <button
            type="button"
            key={topic}
            onClick={() => runResearch(topic)}
            className="rounded-lg border border-white/10 bg-surface p-3 text-left hover:border-accent"
          >
            <p className="font-medium">{topic}</p>
            <p className="text-xs text-muted">Click to generate AI insight.</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="flex-1 rounded-lg border border-white/20 bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          placeholder="Custom research question..."
        />
        <button
          type="button"
          onClick={() => runResearch(custom)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
        >
          Research
        </button>
      </div>

      {loading && <p className="text-sm text-muted">Running research...</p>}

      <div className="space-y-3">
        {results.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-lg bg-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold">{item.title}</h4>
              <button
                type="button"
                onClick={() => onSendToAdvisor(`Expand this research: ${item.title}\n\n${item.content}`)}
                className="text-xs text-accent"
              >
                Send to AI Advisor
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-200">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
