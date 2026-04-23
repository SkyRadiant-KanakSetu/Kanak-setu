# Sky Radiant India - Amazon Seller Command Centre

Standalone full-stack app for `agent.kanaksetu.com` with:
- React + Vite + Tailwind frontend
- Node + Express backend proxy
- Groq AI access via backend only (`/api/ai`)
- Amazon command orchestration layer (SP-API ready)

## Key Architecture

- Frontend never calls Groq or any AI provider directly.
- All AI requests go to Express route `POST /api/ai`.
- Express server calls Groq endpoint and returns response to UI.
- In production, `server.js` serves built React app from `dist/`.
- Mission Control backend routes:
  - `GET /api/system/status`
  - `POST /api/system/controls`
  - `GET /api/commands/feed`
  - `POST /api/commands/run-cycle`

## Command Engine

- Modules are in `src/server/`:
  - `spapiClient.js`: Amazon SP-API token flow + request helper + marketplace snapshot bridge
  - `commandEngine.js`: command generation + execution adapter
  - `policyEngine.js`: strict risk guardrails (price delta, margin floor, budget delta caps)
  - `actionQueue.js`: execution queue
  - `auditStore.js`: persistent runtime ledger (`.runtime/action-ledger.json`)
- Autonomous worker cycle runs every `COMMAND_CYCLE_MS` (default 30000 ms).
- Safety controls:
  - Kill switch
  - Circuit breaker after repeated failures
  - Owner token protection for mutating routes

## Environment

Create `.env`:

```env
GROQ_API_KEY=your_groq_key_here
PORT=3001
COMMAND_CYCLE_MS=30000

# Optional: protect mutating command routes
COMMAND_CENTRE_OWNER_TOKEN=set_a_long_random_token

# SP-API config (required for live Amazon integration)
SP_API_CLIENT_ID=amzn-client-id
SP_API_CLIENT_SECRET=amzn-client-secret
SP_API_REFRESH_TOKEN=amzn-refresh-token
SP_API_SELLER_ID=your-seller-id
SP_API_BASE_URL=https://sellingpartnerapi-fe.amazon.com

# Risk controls
MAX_DAILY_PRICE_DELTA_PERCENT=8
MIN_MARGIN_PERCENT=35
MAX_BUDGET_DELTA_PERCENT=20
```

## Scripts

- `npm run dev` -> runs Vite + Node server concurrently
- `npm run build` -> builds frontend into `dist`
- `npm run start` -> starts `server.js` (API + static frontend)

## Deployment Instructions

1. Upload all files to server
2. Run: `npm install`
3. Run: `npm run build`
4. Set `GROQ_API_KEY` in `.env`
5. Run: `node server.js` or `pm2 start server.js`
6. Point `agent.kanaksetu.com` to port `3001`

### PM2 (recommended)

```bash
pm2 start server.js --name sky-radiant-agent
pm2 save
pm2 startup
```

## No Cross-Linking

This app is standalone and does not include links to other Kanak Setu pages or modules.
