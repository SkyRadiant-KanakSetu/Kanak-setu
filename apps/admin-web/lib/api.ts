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
  return (await fetch(`${API}${path}`, { ...opts, headers })).json();
}

export const authApi = {
  login: (email: string, password: string) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const admin = {
  dashboard: () => api('/admin/dashboard'),
  institutions: (page = 1, status?: string) =>
    api(`/admin/institutions?page=${page}${status ? `&status=${status}` : ''}`),
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
  anchorAll: () => api('/merkle/anchor-all', { method: 'POST' }),
};
