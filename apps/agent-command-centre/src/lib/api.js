export const SKY_RADIANT_SYSTEM_PROMPT =
  "You are the Sky Radiant India Amazon Seller Agent — expert advisor for a white-label Amazon.in seller. Sky Radiant buys products from Indian suppliers, brands them under Sky Radiant, and sells on Amazon.in and other platforms (Flipkart, Nykaa, Meesho, JioMart). Strategy: WHITE LABEL only · Under 3% return rate target · Repeat buyers priority · 35%+ net margin. Portfolio: ₹26L monthly revenue · 38% margin · 2.1% return rate · 72% repeat rate · ₹3.1Cr annual target. Be sharp, India-specific, practical. Use ₹. Max 4 paragraphs.";

export async function callAi(messages, systemPrompt = SKY_RADIANT_SYSTEM_PROMPT) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "AI call failed");
  }

  return response.json();
}

async function http(path, options = {}) {
  const ownerToken =
    typeof window !== "undefined" ? window.localStorage.getItem("ownerToken") || undefined : undefined;
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(ownerToken ? { "x-owner-token": ownerToken } : {})
    }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return response.json();
}

export function getSystemStatus() {
  return http("/api/system/status");
}

export function getCommandFeed() {
  return http("/api/commands/feed");
}

export function runCommandCycle() {
  return http("/api/commands/run-cycle", { method: "POST" });
}

export function updateSystemControls(payload) {
  return http("/api/system/controls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
