'use client';

function resolveApiBase() {
  const envBase =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL?.trim() : '';
  if (envBase) return envBase.replace(/\/$/, '');
  if (typeof window === 'undefined') return '/api/v1';
  const host = window.location.hostname;
  if (
    host === 'admin.kanaksetu.com' ||
    host === 'institution.kanaksetu.com' ||
    host === 'kanaksetu.com' ||
    host === 'www.kanaksetu.com'
  ) {
    return 'https://api.kanaksetu.com/api/v1';
  }
  return '/api/v1';
}

const API_BASE = resolveApiBase();
export type ApiError = { code?: string; message?: string; correlationId?: string };
export type ApiMeta = Record<string, unknown>;
export type ApiResponse<T> = { success: boolean; data?: T; error?: ApiError; meta?: ApiMeta };

export type AuthLoginData = {
  accessToken: string;
  refreshToken: string;
};

export type DashboardTrendPoint = {
  donations: number;
  activeDonors: number;
};

export type AdminDashboard = {
  donors: number;
  institutions: number;
  donations: number;
  pendingInstitutions: number;
  failedDonations: number;
  rangeDays: number;
  newDonorsInRange?: number;
  activeDonorsInRange?: number;
  repeatDonorsInRange?: number;
  avgDonationTicketPaiseInRange?: number;
  donorTrend?: DashboardTrendPoint[];
};

export type InstitutionRow = {
  id: string;
  legalName: string;
  publicName: string;
  type: string;
  city?: string;
  upiId?: string;
  status: string;
  publicPageSlug?: string | null;
};

export type OnboardInstitutionResponse = {
  email?: string;
  status?: string;
};

export type DonationRow = {
  id: string;
  donationRef?: string;
  amountPaise: number;
  goldQuantityMg?: string | null;
  status: string;
  donor?: { firstName?: string; lastName?: string };
  institution?: { publicName?: string };
  payment?: {
    providerPaymentId?: string;
    providerOrderId?: string;
    events?: Array<{ eventType?: string }>;
  };
};

export type MerkleBatch = {
  id: string;
  batchNumber: number;
  status: string;
  leafCount: number;
  merkleRoot?: string;
  anchor?: {
    status?: string;
    attempts?: number;
    txHash?: string;
  } | null;
};

export type WalletBalance = {
  balanceMatic?: string | number;
  address?: string;
  network?: string;
  chainId?: string | number;
};

export type AnchorResultItem = {
  txHash?: string;
  error?: string;
};

export type WebhookDeliveryRow = {
  id: string;
  createdAt: string;
  provider?: string;
  status?: string;
  idempotencyKey?: string;
};

export type WebhookEventRow = {
  id: string;
  provider?: string;
  createdAt: string;
  status?: string;
  eventType?: string;
  payloadSummary?: string;
};

export type FailedTransactionRow = {
  donationId: string;
  donationRef?: string;
  donationStatus: string;
  amountPaise: number;
  updatedAt: string;
  donorName?: string;
  institutionName?: string;
  payment?: {
    id: string;
    status?: string;
    provider?: string;
    providerOrderId?: string;
    providerPaymentId?: string;
    updatedAt?: string;
  } | null;
  review?: {
    reviewedAt: string;
    reviewedBy?: string;
    note?: string;
  } | null;
};

export type ReconciliationRunResult = {
  runRecordId?: string;
};

export type AuditLogRow = {
  id: string;
  createdAt: string;
  action?: string;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  user?: { email?: string };
};

export type AssistantAnswer = {
  answer?: string;
};

export type LedgerAdjustPayload = {
  institutionId: string;
  adjustmentType: 'CREDIT' | 'DEBIT';
  goldQuantityMg: string;
  description?: string;
};

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
}
export function setTokens(a: string, r: string) {
  localStorage.setItem('accessToken', a);
  localStorage.setItem('refreshToken', r);
}
export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
function handleHttpStatus(status: number) {
  if (typeof window === 'undefined') return;
  if (status === 401) {
    localStorage.clear();
    window.location.replace('/');
    return;
  }
  if (status >= 500) window.alert('Server error. Please try again in a moment.');
}

async function api<T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string> | undefined) || {}),
  };
  const t = token();
  if (t) headers['Authorization'] = `Bearer ${t}`;
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { ...opts, headers });
    handleHttpStatus(res.status);
    const text = await res.text();
    if (!text) {
      return {
        success: false,
        error: {
          code: 'EMPTY_RESPONSE',
          message: `Empty API response (HTTP ${res.status}). Check API and NEXT_PUBLIC_API_BASE_URL.`,
        },
      };
    }
    try {
      return JSON.parse(text);
    } catch {
      return {
        success: false,
        error: {
          code: 'NON_JSON',
          message: `API returned non-JSON (HTTP ${res.status}). Is the API up and CORS allowing this origin?`,
        },
      };
    }
  } catch (e: unknown) {
    const raw = e instanceof Error ? e.message : String(e || '');
    const isBrowserNetwork =
      /failed to fetch|load failed|networkerror when attempting to fetch resource/i.test(raw);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: isBrowserNetwork
          ? 'The API is unreachable. If you are the host, check that kanak-api is running (pm2), Caddy proxies to port 4000, and the database is up.'
          : raw ||
            'Could not reach the API. Set NEXT_PUBLIC_API_BASE_URL to https://api.<your-domain>/api/v1 and rebuild.',
      },
    };
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthLoginData>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const admin = {
  dashboard: (rangeDays = 30) => api<AdminDashboard>(`/admin/dashboard?rangeDays=${rangeDays}`),
  institutions: (page = 1, status?: string) =>
    api<InstitutionRow[]>(`/admin/institutions?page=${page}${status ? `&status=${status}` : ''}`),
  onboardInstitution: (data: {
    email: string;
    password: string;
    legalName: string;
    publicName: string;
    type: string;
    city?: string;
    state?: string;
    pincode?: string;
    has80G?: boolean;
    pan?: string;
    registrationNo?: string;
    publicPageSlug?: string;
    upiId?: string;
    status?: string;
    notes?: string;
  }) => api<OnboardInstitutionResponse>('/admin/institutions/onboard', { method: 'POST', body: JSON.stringify(data) }),
  updateInstitutionUpi: (id: string, upiId: string) =>
    api<{ upiId?: string }>(`/admin/institutions/${id}/upi`, {
      method: 'PATCH',
      body: JSON.stringify({ upiId }),
    }),
  changeInstitutionStatus: (id: string, status: string, notes?: string) =>
    api<{ status?: string }>(`/admin/institutions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  donations: (page = 1, status?: string) =>
    api<DonationRow[]>(`/admin/donations?page=${page}${status ? `&status=${status}` : ''}`),
  retryVendor: (id: string) => api<{ ok?: boolean }>(`/admin/donations/${id}/retry-vendor`, { method: 'POST' }),
  auditLogs: (page = 1, entity?: string) =>
    api<AuditLogRow[]>(`/admin/audit-logs?page=${page}${entity ? `&entity=${entity}` : ''}`),
  reconciliation: (page = 1) => api<Record<string, unknown>>(`/admin/reconciliation?page=${page}`),
  runReconciliation: () => api<ReconciliationRunResult>('/admin/reconciliation/run', { method: 'POST' }),
  webhookDeliveries: (page = 1, provider?: string) =>
    api<WebhookDeliveryRow[]>(
      `/admin/webhooks/deliveries?page=${page}${provider ? `&provider=${encodeURIComponent(provider)}` : ''}`
    ),
  webhookEvents: (limit = 20) => api<WebhookEventRow[]>(`/admin/webhooks/events?limit=${limit}`),
  failedTransactions: (hours = 24) => api<FailedTransactionRow[]>(`/admin/transactions/failure-queue?hours=${hours}`),
  markTransactionReviewed: (paymentId: string, note?: string) =>
    api<{ paymentId: string; reviewed: boolean; reviewedAt: string }>(`/admin/transactions/${paymentId}/review`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  assistantQuery: (query: string) =>
    api<AssistantAnswer>('/admin/assistant/query', { method: 'POST', body: JSON.stringify({ query }) }),
  ledgerAdjust: (data: LedgerAdjustPayload) =>
    api('/admin/ledger/adjust', { method: 'POST', body: JSON.stringify(data) }),
};

export const merkleApi = {
  batches: (page = 1) => api<MerkleBatch[]>(`/merkle/batches?page=${page}`),
  walletBalance: () => api<WalletBalance>('/merkle/wallet-balance'),
  seal: () => api<{ ok?: boolean }>('/merkle/seal', { method: 'POST' }),
  anchor: (batchId: string) => api<AnchorResultItem>(`/merkle/anchor/${batchId}`, { method: 'POST' }),
  anchorAll: (force = false) => api<AnchorResultItem[]>(`/merkle/anchor-all${force ? '?force=1' : ''}`, { method: 'POST' }),
};
