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
function handleHttpStatus(status: number) {
  if (typeof window === 'undefined') return;
  if (status === 401) {
    localStorage.clear();
    window.location.replace('/');
    return;
  }
  if (status >= 500) window.alert('Server error. Please try again shortly.');
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

export const auth = {
  login: (email: string, password: string) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: any) =>
    api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'INSTITUTION_ADMIN' }),
    }),
};

export const portal = {
  onboard: (data: any) =>
    api('/institutions/portal/onboard', { method: 'POST', body: JSON.stringify(data) }),
  submit: () => api('/institutions/portal/submit', { method: 'POST' }),
  updateUpi: (upiId: string) =>
    api('/institutions/portal/upi', { method: 'PATCH', body: JSON.stringify({ upiId }) }),
  dashboard: (rangeDays = 30) => api(`/institutions/portal/dashboard?rangeDays=${rangeDays}`),
  ledger: (page = 1) => api(`/institutions/portal/ledger?page=${page}`),
  addBank: (data: any) =>
    api('/institutions/portal/bank', { method: 'POST', body: JSON.stringify(data) }),
  requestRedemption: (data: any) =>
    api('/institutions/portal/redemptions', { method: 'POST', body: JSON.stringify(data) }),
  faithSettings: () => api('/institutions/portal/settings-faith'),
  updateFaithSettings: (data: any) =>
    api('/institutions/portal/settings-faith', { method: 'PATCH', body: JSON.stringify(data) }),
  functions: (status?: string) =>
    api(`/institutions/portal/functions${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createFunction: (data: any) =>
    api('/institutions/portal/functions', { method: 'POST', body: JSON.stringify(data) }),
  updateFunction: (id: string, data: any) =>
    api(`/institutions/portal/functions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  demographics: () => api('/institutions/portal/demographics'),
  geoDistribution: () => api('/institutions/portal/geo-distribution'),
  tasks: (status?: string) =>
    api(`/institutions/portal/tasks${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createTask: (data: any) =>
    api('/institutions/portal/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) =>
    api(`/institutions/portal/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
