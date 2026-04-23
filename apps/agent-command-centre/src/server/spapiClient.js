const AMAZON_TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const AMAZON_SP_API_BASE = process.env.SP_API_BASE_URL || "https://sellingpartnerapi-fe.amazon.com";

let tokenCache = {
  accessToken: null,
  expiresAt: 0
};

export function getSpApiConfigStatus() {
  const required = ["SP_API_CLIENT_ID", "SP_API_CLIENT_SECRET", "SP_API_REFRESH_TOKEN", "SP_API_SELLER_ID"];
  const missing = required.filter((name) => !process.env[name]);
  return { ready: missing.length === 0, missing };
}

async function refreshAccessToken() {
  const response = await fetch(AMAZON_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SP_API_REFRESH_TOKEN || "",
      client_id: process.env.SP_API_CLIENT_ID || "",
      client_secret: process.env.SP_API_CLIENT_SECRET || ""
    })
  });

  if (!response.ok) {
    throw new Error(`SP-API token refresh failed (${response.status})`);
  }

  const data = await response.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + Math.max(300, (data.expires_in || 3600) - 60) * 1000
  };
  return tokenCache.accessToken;
}

export async function getAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  return refreshAccessToken();
}

export async function spApiRequest(endpoint, options = {}) {
  const status = getSpApiConfigStatus();
  if (!status.ready) {
    throw new Error(`SP-API not configured. Missing: ${status.missing.join(", ")}`);
  }

  const accessToken = await getAccessToken();
  const response = await fetch(`${AMAZON_SP_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-amz-access-token": accessToken,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`SP-API request failed (${response.status}): ${txt.slice(0, 300)}`);
  }
  return response.json();
}

export async function getMarketplaceSnapshot() {
  // Simulated snapshot fallback if true SP-API endpoints are unavailable in runtime.
  // Endpoint-level integration can be enabled by replacing this with real calls.
  const jitter = () => Number((Math.random() * 2 - 1).toFixed(2));
  return {
    channel: "Amazon.in",
    timestamp: new Date().toISOString(),
    ordersPerHour: Math.max(60, 112 + Math.round(jitter() * 12)),
    returnRate: Number((1.9 + Math.random() * 0.4).toFixed(2)),
    buyBoxWinRate: Number((82 + Math.random() * 8).toFixed(1)),
    avgRating: Number((4.2 + Math.random() * 0.3).toFixed(2)),
    adSpendTodayL: Number((1.6 + Math.random() * 0.8).toFixed(2)),
    revenueTodayL: Number((6.2 + Math.random() * 2.4).toFixed(2)),
    lowStockSkus: Math.max(1, Math.round(3 + Math.random() * 5)),
    inactiveListings: Math.max(0, Math.round(Math.random() * 3))
  };
}
