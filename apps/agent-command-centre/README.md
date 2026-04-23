# Sky Radiant India - Amazon Seller Command Centre

Standalone full-stack app for `agent.kanaksetu.com` with:
- React + Vite + Tailwind frontend
- Node + Express backend proxy
- Groq AI access via backend only (`/api/ai`)

## Key Architecture

- Frontend never calls Groq or any AI provider directly.
- All AI requests go to Express route `POST /api/ai`.
- Express server calls Groq endpoint and returns response to UI.
- In production, `server.js` serves built React app from `dist/`.

## Environment

Create `.env`:

```env
GROQ_API_KEY=your_groq_key_here
PORT=3001
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

## No Cross-Linking

This app is standalone and does not include links to other Kanak Setu pages or modules.
