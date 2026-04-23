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

export default function Research({ onSendToAdvisor }) {
  const [results, setResults] = useState([]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const runResearch = async (topic) => {
    setLoading(true);
    try {
      const prompt = `Generate India-specific research insights for Sky Radiant India on: ${topic}. Focus on low return risk and high repeat purchase opportunities.`;
      const response = await callAi([{ role: "user", content: prompt }]);
      setResults((prev) => [{ title: topic, content: response.content }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Research Engine</h3>
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
