import { Request, Response, NextFunction } from 'express';

type Role = 'ADMIN' | 'OPS' | 'VIEWER';

function parseApiKeys(raw: string) {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [role, key] = part.split(':').map((v) => v.trim());
      return { role: (role || 'VIEWER').toUpperCase() as Role, key: key || '' };
    })
    .filter((row) => row.key);
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = String(req.header('x-api-key') || '').trim();
  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing x-api-key' } });
  }
  const configured = parseApiKeys(process.env.API_KEYS || '');
  const hit = configured.find((row) => row.key === token);
  if (!hit) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid API key' } });
  }
  (req as any).auth = { role: hit.role };
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).auth?.role as Role | undefined;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
    }
    next();
  };
}
