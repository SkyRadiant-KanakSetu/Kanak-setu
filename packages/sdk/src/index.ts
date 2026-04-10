export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
};

export class KanakSetuApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: ApiErrorBody
  ) {
    super(message);
    this.name = 'KanakSetuApiError';
  }
}

export type SdkOptions = {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
};

/** Standard API envelope (apps should parse `data` / `error`). */
export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; requestId?: string; details?: unknown };
  meta?: { page: number; limit: number; total: number; pages: number };
};

/**
 * Path helpers — use with Next.js rewrites (`baseUrl` empty string) or direct API host.
 * Prefix matches mounted routes in `apps/api`.
 */
export const apiPaths = {
  health: '/api/v1/health',
  donorProfile: '/api/v1/donors/me',
  donorDonations: (page = 1) => `/api/v1/donors/me/donations?page=${page}`,
  merkleProof: (donationId: string) => `/api/v1/merkle/proof/${donationId}`,
  verifyCertificate: (ref: string) => `/api/v1/verify/${ref}`,
} as const;

/**
 * Minimal typed fetch wrapper for browser and server. Apps configure baseUrl + token.
 */
export function createKanakSetuClient(opts: SdkOptions) {
  const { baseUrl, getAccessToken } = opts;

  async function request<T>(
    method: HttpMethod,
    path: string,
    init?: { json?: unknown; headers?: Record<string, string> }
  ): Promise<T> {
    const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      ...(init?.json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    };
    const token = getAccessToken ? await getAccessToken() : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers,
      body: init?.json !== undefined ? JSON.stringify(init.json) : undefined,
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? (JSON.parse(text) as unknown) : undefined;
    } catch {
      throw new KanakSetuApiError('Invalid JSON response', res.status);
    }

    if (!res.ok) {
      const body = data as ApiErrorBody | undefined;
      throw new KanakSetuApiError(body?.error?.message ?? res.statusText, res.status, body);
    }

    return data as T;
  }

  return { request };
}
