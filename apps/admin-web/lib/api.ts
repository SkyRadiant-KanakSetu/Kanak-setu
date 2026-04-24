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

async function api<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: any; meta?: any }> {
  const headers: any = { 'Content-Type': 'application/json', ...((opts.headers as any) || {}) };
  const t = token();
  if (t) headers['Authorization'] = `Bearer ${t}`;
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { ...opts, headers });
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
  } catch (e: any) {
    const raw = String(e?.message || '');
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
    api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const admin = {
  dashboard: (rangeDays = 30) => api(`/admin/dashboard?rangeDays=${rangeDays}`),
  institutions: (page = 1, status?: string) =>
    api(`/admin/institutions?page=${page}${status ? `&status=${status}` : ''}`),
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
  }) => api('/admin/institutions/onboard', { method: 'POST', body: JSON.stringify(data) }),
  updateInstitutionUpi: (id: string, upiId: string) =>
    api(`/admin/institutions/${id}/upi`, {
      method: 'PATCH',
      body: JSON.stringify({ upiId }),
    }),
  changeInstitutionStatus: (id: string, status: string, notes?: string) =>
    api(`/admin/institutions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  donations: (page = 1, status?: string) =>
    api(`/admin/donations?page=${page}${status ? `&status=${status}` : ''}`),
  retryVendor: (id: string) => api(`/admin/donations/${id}/retry-vendor`, { method: 'POST' }),
  auditLogs: (page = 1, entity?: string) =>
    api(`/admin/audit-logs?page=${page}${entity ? `&entity=${entity}` : ''}`),
  reconciliation: (page = 1) => api(`/admin/reconciliation?page=${page}`),
  runReconciliation: () => api('/admin/reconciliation/run', { method: 'POST' }),
  webhookDeliveries: (page = 1, provider?: string) =>
    api(
      `/admin/webhooks/deliveries?page=${page}${provider ? `&provider=${encodeURIComponent(provider)}` : ''}`
    ),
  ledgerAdjust: (data: any) =>
    api('/admin/ledger/adjust', { method: 'POST', body: JSON.stringify(data) }),
};

export const merkleApi = {
  batches: (page = 1) => api(`/merkle/batches?page=${page}`),
  seal: () => api('/merkle/seal', { method: 'POST' }),
  anchor: (batchId: string) => api(`/merkle/anchor/${batchId}`, { method: 'POST' }),
  anchorAll: (force = false) => api(`/merkle/anchor-all${force ? '?force=1' : ''}`, { method: 'POST' }),
};
