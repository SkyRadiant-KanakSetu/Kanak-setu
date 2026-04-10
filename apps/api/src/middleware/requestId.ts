import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

const HEADER = 'x-request-id';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers[HEADER] as string)?.trim() || randomUUID();
  req.requestId = id;
  res.setHeader(HEADER, id);
  next();
}
