import { prisma } from './prisma';

type RecordRow = Record<string, unknown>;

function num(row: RecordRow, keys: string[]) {
  for (const k of keys) {
    const v = row[k];
    if (v == null) continue;
    const n = Number(String(v).replace(/,/g, ''));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function str(row: RecordRow, keys: string[]) {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
}

function parseObservedAt(row: RecordRow) {
  const s = str(row, ['arrival_date', 'Arrival_Date', 'price_date', 'date', 'order_date']);
  if (!s) return new Date();
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t);
  const m = s.match(/(\d{1,2})-(\d{1,2})-(\d{2,4})/);
  if (m) {
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    const c = parseInt(m[3], 10) < 100 ? 2000 + parseInt(m[3], 10) : parseInt(m[3], 10);
    if (a > 12) return new Date(c, a - 1, b);
    return new Date(c, b - 1, a);
  }
  return new Date();
}

function norm(s: string) {
  return String(s || '')
    .trim()
    .toLowerCase();
}

function commMatches(commodityCell: string, nameNeedle: string) {
  const a = norm(commodityCell);
  const b = norm(nameNeedle);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a) || a.split(/[\s(]/)[0] === b;
}

function regionFuzzyMatch(regionFromRow: string, userHint: string) {
  const a = norm(regionFromRow);
  const b = norm(userHint);
  if (!a || !b) return true;
  return a.includes(b) || b.includes(a) || a.split(/\s+/).some((w) => w.length > 2 && b.includes(w));
}

/**
 * Fetches the latest OGD (data.gov.in) agmark style rows, filters to commodity, inserts MandiPrice rows.
 * Set DATA_GOV_IN_API_KEY and DATA_GOV_IN_RESOURCE_ID from the dataset page on data.gov.in (free key).
 */
export async function tryIngestOgdMandiForCommodity(params: {
  commodityId: string;
  commodityDisplayName: string;
  sourceRegion: string;
  targetRegion: string;
}): Promise<{ inserted: number; label: string }> {
  const key = process.env.DATA_GOV_IN_API_KEY?.trim();
  const resource = process.env.DATA_GOV_IN_RESOURCE_ID?.trim();
  if (!key || !resource) {
    return { inserted: 0, label: 'ogd-not-configured' };
  }

  const url = new URL(`https://api.data.gov.in/resource/${resource}.json`);
  url.searchParams.set('api-key', key);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '800');

  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), 20000);
  let records: RecordRow[] = [];
  try {
    const res = await fetch(url, { signal: ac.signal, headers: { accept: 'application/json' } });
    if (!res.ok) {
      return { inserted: 0, label: `ogd-http-${res.status}` };
    }
    const body = (await res.json()) as { records?: RecordRow[] };
    if (!Array.isArray(body?.records)) {
      return { inserted: 0, label: 'ogd-no-records' };
    }
    records = body.records;
  } catch {
    return { inserted: 0, label: 'ogd-fetch-failed' };
  } finally {
    clearTimeout(to);
  }

  const needle = params.commodityDisplayName;
  const want = [params.sourceRegion, params.targetRegion];

  const toInsert: Array<{
    commodityId: string;
    marketId: string;
    priceMin: number;
    priceMax: number;
    priceModal: number;
    observedAt: Date;
    source: string;
  }> = [];

  for (const rec of records) {
    if (toInsert.length >= 50) break;
    const cname = str(rec, ['commodity', 'Commodity', 'comm_name', 'Cmmodity']);
    if (!commMatches(cname, needle)) continue;

    const state = str(rec, ['state_name', 'State_Name', 'state', 'State']);
    const district = str(rec, ['district', 'District']);
    const mkt = str(rec, ['market', 'Market', 'market_name', 'apmc_name', 'MktName']);
    const region = state || district;
    if (!region) continue;

    const inRegion = want.some((h) => regionFuzzyMatch(region, h) || (district && regionFuzzyMatch(district, h)) || (mkt && regionFuzzyMatch(mkt, h)));
    if (!inRegion) continue;

    const min = num(rec, ['min_price', 'Min_Price', 'min', 'Min']);
    const max = num(rec, ['max_price', 'Max_Price', 'max', 'Max']);
    const modal = num(rec, ['modal_price', 'Modal_Price', 'price', 'modal', 'MPrice']);
    const m = modal ?? (min != null && max != null ? (min + max) / 2 : null);
    if (m == null) continue;
    const lo = min != null && Number.isFinite(min) ? min : m * 0.92;
    const hi = max != null && Number.isFinite(max) ? max : m * 1.08;

    const mName = mkt || `${district || region} Mandi`;
    const mRegion = state || region;

    const existing = await prisma.market.findFirst({
      where: { name: mName, region: mRegion },
    });
    const market =
      existing ||
      (await prisma.market.create({ data: { name: mName, region: mRegion, type: 'MANDI' } }));

    toInsert.push({
      commodityId: params.commodityId,
      marketId: market.id,
      priceMin: Number(Number(lo).toFixed(2)),
      priceMax: Number(Number(hi).toFixed(2)),
      priceModal: Number(Number(m).toFixed(2)),
      observedAt: parseObservedAt(rec),
      source: 'data.gov.in:agmark',
    });
  }

  if (toInsert.length) {
    await prisma.mandiPrice.createMany({ data: toInsert });
  }
  return { inserted: toInsert.length, label: toInsert.length ? 'data.gov.in' : 'ogd-no-matching-rows' };
}
