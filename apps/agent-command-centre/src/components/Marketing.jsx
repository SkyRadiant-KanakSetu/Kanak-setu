import { useState } from "react";
import { callAi } from "../lib/api";

const strategies = [
  "Amazon PPC",
  "Keyword & SEO",
  "Social Commerce",
  "Review Strategy",
  "Deals & Promotions",
  "Multi-Platform (Flipkart/Nykaa/Meesho/JioMart)",
  "Customer Retention",
  "A+ Content",
  "Festive Season Playbook"
];

export default function Marketing({ onSendToAdvisor }) {
  const [result, setResult] = useState("");
  const [active, setActive] = useState("");

  const generateStrategy = async (topic) => {
    setActive(topic);
    const prompt = `Build a practical execution strategy for Sky Radiant India on: ${topic}. Include timeline, channel split, and KPI targets in India market context.`;
    const response = await callAi([{ role: "user", content: prompt }]);
    setResult(response.content);
  };

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Marketing Strategy Centre</h3>
      <div className="grid grid-cols-3 gap-3">
        {strategies.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => generateStrategy(item)}
            className={`rounded-lg border p-3 text-left text-sm ${
              active === item ? "border-accent bg-accent/10" : "border-white/10 bg-surface hover:border-accent"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">{active || "Strategy Output"}</h4>
          {result && (
            <button
              type="button"
              onClick={() => onSendToAdvisor(`Deepen this strategy for execution:\n\n${result}`)}
              className="text-xs text-accent"
            >
              Continue in AI Advisor
            </button>
          )}
        </div>
        <p className="whitespace-pre-wrap text-sm text-gray-200">
          {result || "Click a strategy card to generate a full plan."}
        </p>
      </div>
    </section>
  );
}
