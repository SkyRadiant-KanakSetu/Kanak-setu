import express, { type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { requestIdMiddleware } from './middleware/requestId';
import { authRouter } from './modules/auth/auth.routes';
import { donorRouter } from './modules/donors/donor.routes';
import { institutionRouter } from './modules/institutions/institution.routes';
import { donationRouter } from './modules/donations/donation.routes';
import { paymentRouter } from './modules/payments/payment.routes';
import { adminRouter } from './modules/admin/admin.routes';
import { merkleRouter } from './modules/merkle/merkle.routes';
import { certificateRouter } from './modules/certificates/certificate.routes';
import { verifyRouter } from './modules/certificates/verify.routes';
import { webhookRouter } from './modules/webhooks/webhook.routes';
import { errorHandler } from './middleware/errorHandler';
import { getEnv } from './config/env';

const app = express();

// Caddy (or any reverse proxy): use X-Forwarded-* for req.ip, rate limiting, and secure cookies.
app.set('trust proxy', 1);

// --- GLOBAL MIDDLEWARE ---
app.use(requestIdMiddleware);
app.use(helmet());
const corsOrigins = (getEnv().CORS_ORIGINS || '')
  .split(',')
  .map((o: string) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);
app.use(morgan('short'));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: { service: 'kanak-setu-api', health: '/api/v1/health' },
  });
});

// --- HEALTH ---
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
});

// Webhooks: mounted before JSON parser and global rate limit.
// Razorpay HMAC must hash raw body bytes.
app.use(
  '/api/v1/webhooks/razorpay',
  express.raw({ type: 'application/json' }) as unknown as RequestHandler
);
app.use('/api/v1/webhooks', webhookRouter);
app.use(express.json({ limit: '2mb' }));

app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- ROUTES ---
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/donors', donorRouter);
app.use('/api/v1/institutions', institutionRouter);
app.use('/api/v1/donations', donationRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/merkle', merkleRouter);
app.use('/api/v1/certificates', certificateRouter);
app.use('/api/v1/verify', verifyRouter);

// --- ERROR HANDLER ---
app.use(errorHandler);

export { app };
