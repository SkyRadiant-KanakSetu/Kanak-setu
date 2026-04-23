import { useState } from "react";
import { callAi } from "../lib/api";

const products = [
  ["97", "Kitchen Degreaser Spray", "Home Care", "₹95", "₹249", "62%", "Low", "High", "91"],
  ["95", "Herbal Hair Oil 200ml", "Beauty", "₹120", "₹349", "66%", "Low", "High", "89"],
  ["94", "Toilet Rim Block 4-Pack", "Home Care", "₹70", "₹199", "65%", "Low", "High", "88"],
  ["93", "Neem Face Wash 150ml", "Beauty", "₹88", "₹249", "64%", "Low", "High", "87"],
  ["92", "Laundry Fragrance Booster", "Home Care", "₹110", "₹299", "63%", "Low", "High", "86"],
  ["91", "Dishwasher Gel 500ml", "Kitchen", "₹125", "₹329", "62%", "Low", "High", "85"],
  ["90", "Mosquito Repellent Patches", "Personal Care", "₹55", "₹179", "69%", "Low", "High", "85"],
  ["89", "Foot Crack Cream", "Personal Care", "₹60", "₹189", "68%", "Low", "High", "84"],
  ["88", "Stain Remover Pen", "Laundry", "₹45", "₹149", "70%", "Low", "High", "84"],
  ["87", "Shoe Deodorizer Spray", "Lifestyle", "₹75", "₹219", "66%", "Low", "High", "83"],
  ["86", "Beard Growth Serum", "Grooming", "₹130", "₹399", "67%", "Low", "High", "83"],
  ["85", "Anti-Dandruff Scalp Tonic", "Haircare", "₹105", "₹319", "67%", "Low", "High", "82"],
  ["84", "Baby Bottle Cleanser", "Baby Care", "₹90", "₹269", "66%", "Low", "High", "81"],
  ["83", "Stainless Steel Cleaner", "Home Care", "₹85", "₹259", "67%", "Low", "High", "81"],
  ["82", "Neem Laundry Sanitizer", "Laundry", "₹100", "₹299", "67%", "Low", "High", "80"]
];

export default function Opportunities({ onSendToAdvisor, live }) {
  const [analysis, setAnalysis] = useState("");

  const analyze = async (row) => {
    const [score, product, category, cost, sell, margin, risk, repeat, demand] = row;
    const prompt = `Analyze this white-label opportunity for Sky Radiant India:
Product: ${product}, Category: ${category}, Score: ${score}, Cost: ${cost}, Sell: ${sell}, Margin: ${margin}, Return Risk: ${risk}, Repeat Potential: ${repeat}, Demand: ${demand}.
Live pulse context: Orders/hour ${live.pulse.ordersPerHour}, Conversion ${live.pulse.conversionRate}%, Returns ${live.pulse.returnRate}%.
Give:
1) Go/No-Go verdict with confidence score /100
2) Positioning angle + pricing guardrails
3) Packaging + claims to reduce returns
4) Launch checklist for first 14 days.`;
    const result = await callAi([{ role: "user", content: prompt }]);
    setAnalysis(result.content);
  };

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Product Opportunity Explorer</h3>
      <div className="rounded-lg border border-white/10 bg-surface p-3">
        <p className="text-xs text-muted">
          Live Demand Pulse: {live.pulse.ordersPerHour} orders/hr · Conversion {live.pulse.conversionRate}% · At-risk SKUs{" "}
          {live.pulse.atRiskSkus}
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[1050px] text-sm">
          <thead className="bg-surface/80 text-left text-muted">
            <tr>
              {[
                "Score",
                "Product",
                "Category",
                "Cost Price",
                "Sell Price",
                "Margin %",
                "Return Risk",
                "Repeat Potential",
                "Demand Score",
                "Action"
              ].map((head) => (
                <th key={head} className="px-3 py-2">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((row) => (
              <tr key={row[1]} className="border-t border-white/5">
                {row.map((cell) => (
                  <td key={`${row[1]}-${cell}`} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => analyze(row)}
                    className="rounded bg-accent px-2 py-1 text-xs font-semibold text-black"
                  >
                    Analyze →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {analysis && (
        <div className="rounded-lg bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-semibold">AI Opportunity Analysis</h4>
            <button
              type="button"
              onClick={() => onSendToAdvisor(`Continue this opportunity analysis:\n\n${analysis}`)}
              className="text-xs text-accent"
            >
              Continue in AI Advisor
            </button>
          </div>
          <p className="whitespace-pre-wrap text-sm">{analysis}</p>
        </div>
      )}
    </section>
  );
}
