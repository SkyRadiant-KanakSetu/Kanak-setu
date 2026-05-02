# VPS process registry (production)

Documents PM2 processes commonly present on the Kanak Setu production VPS and port ownership. **Kanak Setu does not use port 4000** for its API when `PORT=4100` is set — that port is often used by another product on the same host.

## Kanak Setu (this repository)

| Name | Listen / role | Notes |
|------|-----------------|-------|
| `kanak-api` | `PORT` from `infra/prod/.env.production` (default **4100**) | Express API; Caddy `KANAK_API_PORT` must match |
| `kanak-donor-web` | Next.js (typically **3000** behind Caddy) | Public donor site |
| `kanak-institution-web` | Next.js (typically **3001**) | Institution portal |
| `kanak-admin-web` | Next.js (typically **3002**) | Admin UI |
| `kanak-outbox-worker` | worker process | PostgreSQL outbox consumer |

## Other stacks (not owned by Kanak Setu repo)

| Name | Port / status | Notes |
|------|-----------------|-------|
| `sky-radiant-agent` | Often **4000** | Separate product — **do not** route Kanak traffic here |
| `sky-radiant-agro-api` | Varies | Has appeared **errored** in PM2 on some hosts. Not a Kanak gate. **If the app path is gone or the product is retired:** `pm2 delete sky-radiant-agro-api && pm2 save`. **If another team owns it:** leave running or fix with that owner; document in their runbook |

## After changes

Always `pm2 save` after adding, deleting, or renaming processes so the process list survives reboot.
