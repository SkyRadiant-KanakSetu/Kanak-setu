/**
 * Live indicative gold: INR per gram (paise) from tokenized gold spot (PAXG / XAUT on CoinGecko).
 * Each token represents one fine troy ounce; we convert oz → g using the troy ounce constant.
 */

const GRAMS_PER_TROY_OZ = 31.1034768;
const DEFAULT_TTL_MS = 90_000;
const STALE_MAX_MS = 24 * 60 * 60 * 1000;

type CacheEntry = { paise: number; fetchedAt: number };

let memoryCache: CacheEntry | null = null;

function fallbackPaise(): number {
  const raw = process.env.GOLD_INDICATIVE_FALLBACK_PAISE;
  const n = raw ? parseInt(raw, 10) : NaN;
  if (Number.isFinite(n) && n > 0) return n;
  return 720000; // ₹7200/g
}

/**
 * CoinGecko simple price: PAXG and XAUT track ~1 troy oz gold; `inr` is INR per 1 token (per oz).
 */
export async function fetchLiveInrPerGramPaise(): Promise<number> {
  const url =
    'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,tether-gold&vs_currencies=inr&precision=full';
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), 12_000);
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'KanakSetu/1.0 (indicative gold quote)',
    },
    signal: ac.signal,
  });
  clearTimeout(to);
  if (!res.ok) {
    throw new Error(`CoinGecko HTTP ${res.status}`);
  }
  const data = (await res.json()) as Record<string, { inr?: number }>;
  const inrPerOz = data['pax-gold']?.inr ?? data['tether-gold']?.inr;
  if (typeof inrPerOz !== 'number' || !Number.isFinite(inrPerOz) || inrPerOz <= 0) {
    throw new Error('CoinGecko: missing INR gold price');
  }
  const inrPerGram = inrPerOz / GRAMS_PER_TROY_OZ;
  const paise = Math.round(inrPerGram * 100);
  return Math.max(1, paise);
}

export async function getCachedLiveInrPerGramPaise(): Promise<{ paise: number; source: 'live' | 'stale' | 'fallback' }> {
  const ttl = parseInt(process.env.GOLD_QUOTE_CACHE_TTL_MS || String(DEFAULT_TTL_MS), 10) || DEFAULT_TTL_MS;
  const now = Date.now();

  if (memoryCache && now - memoryCache.fetchedAt < ttl) {
    return { paise: memoryCache.paise, source: 'live' };
  }

  try {
    const paise = await fetchLiveInrPerGramPaise();
    memoryCache = { paise, fetchedAt: now };
    return { paise, source: 'live' };
  } catch (e) {
    if (memoryCache && now - memoryCache.fetchedAt < STALE_MAX_MS) {
      return { paise: memoryCache.paise, source: 'stale' };
    }
    const fb = fallbackPaise();
    return { paise: fb, source: 'fallback' };
  }
}
