import { z } from 'zod';

/** ISO 4217 — MVP targets INR donations (amount in paise as positive integer). */
export const moneyPaiseSchema = z.number().int().positive();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
