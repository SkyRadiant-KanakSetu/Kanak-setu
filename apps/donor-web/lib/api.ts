'use client';

const API_BASE = '/api/v1';

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

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  return res.json();
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
