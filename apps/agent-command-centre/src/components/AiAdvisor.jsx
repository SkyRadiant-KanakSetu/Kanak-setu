import { useState } from "react";
import { callAi } from "../lib/api";

const chips = [
  "Find 3 low-return products under ₹400 cost",
  "Improve repeat rate for skincare category",
  "Draft a Q3 festive PPC budget plan",
  "Cut return rate below 2% for personal care"
];

export default function AiAdvisor({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content) => {
    if (!content.trim() || loading) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await callAi(nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse.content }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}. Check backend proxy and key.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-[300px] border-l border-white/10 bg-surface p-4">
      <h3 className="font-heading text-lg font-semibold">AI Advisor</h3>
      <p className="text-xs text-muted">Persistent strategy chat for Sky Radiant India.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            type="button"
            key={chip}
            onClick={() => sendMessage(chip)}
            className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-4 h-[calc(100vh-240px)] space-y-3 overflow-y-auto rounded-lg bg-black/20 p-3">
        {messages.map((msg, idx) => (
          <div
            key={`${msg.role}-${idx}`}
            className={`rounded-lg p-2 text-sm ${
              msg.role === "assistant" ? "bg-white/10" : "bg-accent/90 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-xs text-muted">Thinking...</div>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border border-white/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          placeholder="Ask AI Advisor..."
        />
        <button
          type="button"
          onClick={() => sendMessage(input)}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black"
        >
          Send
        </button>
      </div>
    </aside>
  );
}
