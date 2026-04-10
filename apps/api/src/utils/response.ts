import { Response } from 'express';

export function success(res: Response, data: unknown, meta?: unknown, status = 200) {
  res.status(status).json({ success: true, data, meta });
}

export function paginated(
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number
) {
  res.json({ success: true, data, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
}
