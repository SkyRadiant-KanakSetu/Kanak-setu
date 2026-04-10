// ============================================================
// GOLD VENDOR ADAPTER — Provider-agnostic interface
// ============================================================

export interface GoldQuote {
  pricePerGramPaise: number;
  validUntil: Date;
  vendorRef?: string;
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
    case 'MOCK':
    default:
      return new MockGoldVendor();
  }
}
