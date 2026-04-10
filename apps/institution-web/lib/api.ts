'use client';

const API = '/api/v1';

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
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  return res.json();
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
  dashboard: () => api('/institutions/portal/dashboard'),
  ledger: (page = 1) => api(`/institutions/portal/ledger?page=${page}`),
  addBank: (data: any) =>
    api('/institutions/portal/bank', { method: 'POST', body: JSON.stringify(data) }),
  requestRedemption: (data: any) =>
    api('/institutions/portal/redemptions', { method: 'POST', body: JSON.stringify(data) }),
};
