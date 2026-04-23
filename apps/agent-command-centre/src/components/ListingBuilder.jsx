import { useState } from "react";
import { callAi } from "../lib/api";

const initialForm = {
  productName: "",
  category: "",
  features: "",
  targetCustomer: "",
  price: "",
  usp: "",
  certifications: ""
};

export default function ListingBuilder({ onSendToAdvisor }) {
  const [form, setForm] = useState(initialForm);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const generate = async () => {
    setLoading(true);
    try {
      const prompt = `Create Amazon listing assets for Sky Radiant India.
Product Name: ${form.productName}
Category: ${form.category}
Features: ${form.features}
Target Customer: ${form.targetCustomer}
Price: ${form.price}
USP: ${form.usp}
Certifications: ${form.certifications}

Return:
1) Amazon Title (150-180 chars, SEO)
2) 5 Bullet Points
3) Product Description
4) Backend Search Terms
5) Return Risk Reduction Tips
6) A+ Content Outline`;

      const result = await callAi([{ role: "user", content: prompt }]);
      setOutput(result.content);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-lg bg-surface p-4">
        <h3 className="font-heading text-lg font-semibold">AI Listing Builder</h3>
        <div className="mt-3 space-y-2">
          {Object.keys(initialForm).map((key) => (
            <input
              key={key}
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder={key.replace(/([A-Z])/g, " $1")}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={generate}
          className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
        >
          {loading ? "Generating..." : "Generate Listing"}
        </button>
      </div>

      <div className="rounded-lg bg-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Generated Output</h4>
          <div className="space-x-3">
            <button type="button" onClick={copy} className="text-xs text-accent">
              Copy to clipboard
            </button>
            <button
              type="button"
              onClick={() => onSendToAdvisor(`Refine this listing:\n\n${output}`)}
              className="text-xs text-accent"
            >
              Send to AI Advisor
            </button>
          </div>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-gray-200">
          {output || "Listing output will appear here after generation."}
        </pre>
      </div>
    </section>
  );
}
