// ============================================================
// GOLD VENDOR ADAPTER — Provider-agnostic interface
// ============================================================

import { getCachedLiveInrPerGramPaise } from './goldSpotPrice';

export interface GoldQuote {
  pricePerGramPaise: number;
  validUntil: Date;
  vendorRef?: string;
  /** How the indicative ₹/g was obtained (UI may show a small label). */
  source?: 'mock' | 'live_spot' | 'stale_cache' | 'fallback_static';
}

export interface GoldAllocation {
  vendorOrderRef: string;
  goldQuantityMg: number; // milligrams
  pricePerGramPaise: number;
  status: 'ALLOCATED' | 'FAILED' | 'PENDING';
  vendorData?: Record<string, unknown>;
}

export interface GoldVendorAdapter {
  getQuote(): Promise<GoldQuote>;
  buyGold(amountPaise: number, referenceId: string): Promise<GoldAllocation>;
  getOrderStatus(vendorOrderRef: string): Promise<GoldAllocation>;
}

// ── MOCK VENDOR (for MVP dev) ──
export class MockGoldVendor implements GoldVendorAdapter {
  private mockPrice = 720000; // ₹7200/gram in paise

  async getQuote(): Promise<GoldQuote> {
    return {
      pricePerGramPaise: this.mockPrice,
      validUntil: new Date(Date.now() + 5 * 60 * 1000),
      source: 'mock',
    };
  }

  async buyGold(amountPaise: number, referenceId: string): Promise<GoldAllocation> {
    const goldMg = Math.round((amountPaise / this.mockPrice) * 1000 * 10000) / 10000; // mg with 4 decimals
    return {
      vendorOrderRef: `mock_gold_${referenceId}_${Date.now()}`,
      goldQuantityMg: goldMg,
      pricePerGramPaise: this.mockPrice,
      status: 'ALLOCATED',
    };
  }

  async getOrderStatus(vendorOrderRef: string): Promise<GoldAllocation> {
    return {
      vendorOrderRef,
      goldQuantityMg: 0,
      pricePerGramPaise: this.mockPrice,
      status: 'ALLOCATED',
    };
  }
}

// ── LIVE SPOT (CoinGecko PAXG/XAUT → INR/gram, cached) ──

export class LiveSpotGoldVendor implements GoldVendorAdapter {
  async getQuote(): Promise<GoldQuote> {
    const { paise, source } = await getCachedLiveInrPerGramPaise();
    const src: GoldQuote['source'] =
      source === 'live' ? 'live_spot' : source === 'stale' ? 'stale_cache' : 'fallback_static';
    return {
      pricePerGramPaise: paise,
      validUntil: new Date(Date.now() + 2 * 60 * 1000),
      source: src,
    };
  }

  async buyGold(amountPaise: number, referenceId: string): Promise<GoldAllocation> {
    const { paise } = await getCachedLiveInrPerGramPaise();
    const goldMg = Math.round((amountPaise / paise) * 1000 * 10000) / 10000;
    return {
      vendorOrderRef: `live_spot_${referenceId}_${Date.now()}`,
      goldQuantityMg: goldMg,
      pricePerGramPaise: paise,
      status: 'ALLOCATED',
      vendorData: { mode: 'live_spot_indicative' },
    };
  }

  async getOrderStatus(vendorOrderRef: string): Promise<GoldAllocation> {
    const { paise } = await getCachedLiveInrPerGramPaise();
    return {
      vendorOrderRef,
      goldQuantityMg: 0,
      pricePerGramPaise: paise,
      status: 'ALLOCATED',
    };
  }
}

// ── MMTC-PAMP STUB ──
export class MmtcPampAdapter implements GoldVendorAdapter {
  async getQuote(): Promise<GoldQuote> {
    throw new Error('MMTC-PAMP adapter not yet implemented');
  }
  async buyGold(_a: number, _r: string): Promise<GoldAllocation> {
    throw new Error('Not implemented');
  }
  async getOrderStatus(_ref: string): Promise<GoldAllocation> {
    throw new Error('Not implemented');
  }
}

// ── FACTORY ──
export function getGoldVendorAdapter(): GoldVendorAdapter {
  const vendor = process.env.GOLD_VENDOR || 'MOCK';
  switch (vendor) {
    case 'MMTC_PAMP':
      return new MmtcPampAdapter();
    case 'LIVE_SPOT':
      return new LiveSpotGoldVendor();
    case 'MOCK':
    default:
      return new MockGoldVendor();
  }
}
