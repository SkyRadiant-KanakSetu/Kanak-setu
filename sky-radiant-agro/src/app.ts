import express from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { agroRouter } from './routes/agro.routes';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(cors());
  app.use(helmet());
  app.use(morgan('short'));
  app.use(express.json({ limit: '2mb' }));
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
      max: Number(process.env.RATE_LIMIT_MAX || 200),
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
  });

  app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public/dashboard.html'));
  });
  app.get('/dashboard', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public/dashboard.html'));
  });

  app.use('/api/v1', agroRouter);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: err?.message || 'Unexpected error' },
    });
  });

  return app;
}
