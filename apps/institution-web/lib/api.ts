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
export const portalFeatureFlags = {
  refinements: process.env.NEXT_PUBLIC_ENABLE_INSTITUTION_PORTAL_REFINEMENTS === '1',
  faithContext: process.env.NEXT_PUBLIC_ENABLE_FAITH_CONTEXT_SETTINGS === '1',
};

export type ApiError = { code?: string; message?: string };
export type ApiResponse<T> = { success: boolean; data?: T; error?: ApiError; meta?: Record<string, unknown> };

export type InstitutionDashboard = {
  institutionId: string;
  legalName?: string;
  publicName?: string;
  publicPageSlug?: string;
  status?: string;
  upiId?: string;
  totalDonations?: number;
  totalGoldMg?: number | string;
  uniqueDonors?: number;
  repeatDonors?: number;
  activeDonorsInRange?: number;
  rangeDays?: number;
  recentDonations?: DonationRow[];
  donorDirectory?: DonorDirectoryRow[];
};

export type DonationRow = {
  id: string;
  donationRef?: string;
  amountPaise: number;
  goldQuantityMg?: string | null;
  status?: string;
  createdAt: string;
  donor?: {
    firstName?: string;
    lastName?: string;
    profession?: string;
    city?: string;
    state?: string;
    dateOfBirth?: string | null;
    user?: { phone?: string };
  };
};

export type DonorDirectoryRow = {
  donorId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profession?: string;
  age?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latestDonationAt?: string | null;
};

export type LedgerEntry = {
  id: string;
  entryType: 'CREDIT' | 'DEBIT' | string;
  goldQuantityMg: string;
  balanceAfterMg: string;
  description?: string;
  createdAt: string;
};

export type SpiritualFunction = {
  id: string;
  name: string;
  functionType: string;
  nextDate?: string | null;
  status?: string;
};

export type OpsTask = {
  id: string;
  title: string;
  taskType: string;
  status?: string;
  spiritualFunction?: { id: string; name: string } | null;
};

export type Demographics = {
  totalDonations?: number;
  ageBands?: { under25?: number; from25to40?: number; from41to60?: number; above60?: number };
  topProfessions?: { label: string; count: number }[];
};

export type GeoDistribution = {
  states?: { state: string; donations: number }[];
  cities?: { city: string; state: string; donations: number }[];
};

export type FaithSettings = {
  faithTradition: string;
  terminologyDonationLabel: string;
  terminologyDonorLabel: string;
  sacredCalendarHighlights: Array<{ title?: string; date?: string }> | null;
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
  if (status >= 500) window.alert('Server error. Please try again shortly.');
}

async function api<T>(
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

export const auth = {
  login: (email: string, password: string) =>
    api<{ accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: Record<string, unknown>) =>
    api<{ accessToken: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'INSTITUTION_ADMIN' }),
    }),
};

export const portal = {
  onboard: (data: Record<string, unknown>) =>
    api<Record<string, unknown>>('/institutions/portal/onboard', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submit: () => api<Record<string, unknown>>('/institutions/portal/submit', { method: 'POST' }),
  updateUpi: (upiId: string) =>
    api<{ upiId: string }>('/institutions/portal/upi', { method: 'PATCH', body: JSON.stringify({ upiId }) }),
  dashboard: (rangeDays = 30, options?: { includeDemographics?: boolean; includeGeoDistribution?: boolean }) =>
    api<InstitutionDashboard>(
      `/institutions/portal/dashboard?rangeDays=${rangeDays}${options?.includeDemographics ? '&includeDemographics=1' : ''}${options?.includeGeoDistribution ? '&includeGeoDistribution=1' : ''}`
    ),
  ledger: (page = 1) => api<LedgerEntry[]>(`/institutions/portal/ledger?page=${page}`),
  addBank: (data: Record<string, unknown>) =>
    api<Record<string, unknown>>('/institutions/portal/bank', { method: 'POST', body: JSON.stringify(data) }),
  requestRedemption: (data: Record<string, unknown>) =>
    api<Record<string, unknown>>('/institutions/portal/redemptions', { method: 'POST', body: JSON.stringify(data) }),
  faithSettings: () => api<FaithSettings>('/institutions/portal/settings-faith'),
  updateFaithSettings: (data: FaithSettings) =>
    api<FaithSettings>('/institutions/portal/settings-faith', { method: 'PATCH', body: JSON.stringify(data) }),
  functions: (status?: string) =>
    api<SpiritualFunction[]>(`/institutions/portal/functions${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createFunction: (data: { name: string; functionType: string; nextDate?: string }) =>
    api<SpiritualFunction>('/institutions/portal/functions', { method: 'POST', body: JSON.stringify(data) }),
  updateFunction: (id: string, data: Record<string, unknown>) =>
    api<SpiritualFunction>(`/institutions/portal/functions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  demographics: () => api<Demographics>('/institutions/portal/demographics'),
  geoDistribution: () => api<GeoDistribution>('/institutions/portal/geo-distribution'),
  tasks: (status?: string) =>
    api<OpsTask[]>(`/institutions/portal/tasks${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createTask: (data: { title: string; taskType: string; functionId?: string; dueDate?: string }) =>
    api<OpsTask>('/institutions/portal/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: Record<string, unknown>) =>
    api<OpsTask>(`/institutions/portal/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
