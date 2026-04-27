# Sky Radiant Agro Platform (Standalone Project)

This is a separate project scaffold for Sky Radiant Agro, independent from Kanak Setu modules.

## Stack

- Node.js + TypeScript
- Express API
- Prisma + PostgreSQL

## Quick Start

1. Install dependencies:
   - `npm install`
2. Copy env:
   - `cp .env.example .env`
3. Generate Prisma client:
   - `npm run db:generate`
4. Push schema:
   - `npm run db:push`
5. Run dev server:
   - `npm run dev`

Server starts at `http://localhost:4100`
Dashboard UI: `http://localhost:4100/dashboard`

All `/api/v1/*` routes require header:

- `x-api-key: <your-key>`

## Initial APIs

- `GET /health`
- `GET /api/v1/commodities`
- `POST /api/v1/commodities`
- `GET /api/v1/markets`
- `POST /api/v1/markets`
- `POST /api/v1/ingest/mandi-prices`
- `POST /api/v1/ingest/weather`
- `GET /api/v1/intelligence/storage-plan?commodityCode=TOMATO`
- `POST /api/v1/quality-specs`
- `POST /api/v1/storage-profiles`
- `POST /api/v1/recommendations/generate`
- `GET /api/v1/recommendations`
- `POST /api/v1/recommendations/:id/outcome`
- `POST /api/v1/seo/jobs`
- `GET /api/v1/seo/jobs`

## Project Structure

- `src/server.ts` - app bootstrap
- `src/routes/agro.routes.ts` - agro intelligence endpoints
- `src/lib/prisma.ts` - Prisma client
- `prisma/schema.prisma` - standalone agro schema
- `docs/` - copied strategy and operating documentation

## Production

- Docker: `docker compose up -d`
- PM2: `pm2 start ecosystem.config.cjs && pm2 save`

## API Spec and Testing

- OpenAPI: `openapi.yaml`
- Postman: `postman_collection.json`
- Tests: `npm run test`
- CI: `.github/workflows/sky-radiant-agro-ci.yml`
