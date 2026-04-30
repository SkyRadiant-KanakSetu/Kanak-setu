export function resolveApiBase() {
  const env = process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (env) return env.replace(/\/$/, '');
  return 'https://api.kanaksetu.com/api/v1';
}

export async function fetchInternal(path: string) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    throw new Error('INTERNAL_API_SECRET is not configured');
  }
  const response = await fetch(`${resolveApiBase()}${path}`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    cache: 'no-store',
  });
  const body = await response.json();
  if (!response.ok || !body?.success) {
    throw new Error(body?.error?.message || `Internal API request failed (${response.status})`);
  }
  return body.data;
}

