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

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page: number; limit: number; total: number; pages: number };
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
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

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

async function refreshAccessToken(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.success) {
      setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function api<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as any) || {}),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    let res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    handleHttpStatus(res.status);

    // Auto-refresh on 401
    if (res.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${getToken()}`;
        res = await fetch(`${API_BASE}${path}`, { ...options, headers });
        handleHttpStatus(res.status);
      }
    }

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
          message: `API returned non-JSON (HTTP ${res.status}). Is the API up?`,
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
          ? 'The sign-in service is unreachable. It may be restarting—try again shortly, or ask your host to check the API and database (e.g. pm2 logs for kanak-api, Caddy upstream, DATABASE_URL).'
          : raw ||
            'Could not reach the API. Set NEXT_PUBLIC_API_BASE_URL if the API is on another host.',
      },
    };
  }
}

// ── Auth ──
export const auth = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => api('/auth/register', { method: 'POST', body: JSON.stringify({ ...data, role: 'DONOR' }) }),
  login: (email: string, password: string) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  requestPhoneOtp: (phone: string) =>
    api('/auth/login/phone/request-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyPhoneOtp: (phone: string, otp: string) =>
    api('/auth/login/phone/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  requestSignupPhoneOtp: (phone: string) =>
    api('/auth/signup/phone/request-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifySignupPhoneOtp: (phone: string, otp: string, firstName: string, lastName: string) =>
    api('/auth/signup/phone/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, firstName, lastName }),
    }),
  logout: () =>
    api('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    }),
};

// ── Donors ──
export const donors = {
  me: () => api('/donors/me'),
  update: (data: any) => api('/donors/me', { method: 'PUT', body: JSON.stringify(data) }),
  donations: (page = 1) => api(`/donors/me/donations?page=${page}`),
};

// ── Institutions (public) ──
export const institutions = {
  list: (page = 1) => api(`/institutions?page=${page}`),
  bySlug: (slug: string) => api(`/institutions/slug/${slug}`),
  byId: (id: string) => api(`/institutions/id/${id}`),
};

// ── Donations ──
export const donations = {
  create: (data: {
    institutionId: string;
    campaignId?: string;
    amountPaise: number;
    idempotencyKey?: string;
  }) => api('/donations', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => api(`/donations/${id}`),
  confirmPayment: (id: string, providerPaymentId: string) =>
    api(`/donations/${id}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ providerPaymentId }),
    }),
  quote: () => api('/donations/quote/current'),
};

// ── Certificates ──
export const certificates = {
  forDonation: (donationId: string) => api(`/certificates/donation/${donationId}`),
  download: (id: string) => api(`/certificates/${id}/download`),
};

// ── Merkle (public proof) ──
export const merkle = {
  proof: (donationId: string) => api(`/merkle/proof/${donationId}`),
};

// ── Verify (public) ──
export const verify = {
  certificate: (ref: string) => api(`/verify/${ref}`),
};

// ── Mock payment simulation (dev) ──
export const mockPayment = {
  simulate: (donationId: string, status: 'CAPTURED' | 'FAILED') =>
    api('/payments/mock/simulate', {
      method: 'POST',
      body: JSON.stringify({ donationId, status }),
    }),
};
