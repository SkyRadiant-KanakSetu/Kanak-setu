# Kanaksetu.com Go-Live (VPS + PM2 + Caddy)

This is the fastest practical path to put Kanak Setu on the internet.

## Domain Plan
- `kanaksetu.com` -> donor app
- `institution.kanaksetu.com` -> institution app
- `admin.kanaksetu.com` -> admin app
- `api.kanaksetu.com` -> API

## 1) DNS Records (at registrar)
Create A records to your VPS public IP:
- `@`
- `www`
- `institution`
- `admin`
- `api`

Wait for DNS propagation.

## 2) VPS Prerequisites (Ubuntu)
```bash
sudo apt update
sudo apt install -y curl git postgresql postgresql-contrib redis-server
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
```

Install Caddy:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

## 3) Database Setup
```bash
sudo -u postgres psql -c "CREATE ROLE kanak WITH LOGIN PASSWORD 'CHANGE_ME';"
sudo -u postgres psql -c "CREATE DATABASE kanak_setu OWNER kanak;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kanak_setu TO kanak;"
```

## 4) App setup — automated (recommended)

Push this repo to GitHub (or GitLab) first so the VPS can clone it. Then on the VPS as root:

```bash
export REPO_URL='https://github.com/YOUR_GITHUB_USER/kanak-setu.git'
export BRANCH='main'
git clone "${REPO_URL}" /opt/kanak-setu
cd /opt/kanak-setu
chmod +x scripts/prod/vps-one-shot.sh
bash scripts/prod/vps-one-shot.sh
```

This script: ensures Postgres role/database exist, generates `infra/prod/.env.production` (JWT + DB password) on first run, runs `deploy-vps.sh`, installs the Caddyfile, and restarts Caddy. Re-runs keep your existing env file unless you set `RESET_ENV=1`.

Private repo: use an SSH clone URL and install a deploy key on the server, or use a HTTPS URL with a personal access token.

## 5) App setup — manual (alternative)

```bash
sudo mkdir -p /opt/kanak-setu
sudo chown -R $USER:$USER /opt/kanak-setu
git clone <your-repo-url> /opt/kanak-setu
cd /opt/kanak-setu
cp infra/prod/.env.production.example infra/prod/.env.production
chmod +x scripts/prod/deploy-vps.sh
```

Edit `infra/prod/.env.production` and set real secrets/keys.

## 6) First deploy (manual path only)

```bash
cd /opt/kanak-setu
APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-vps.sh
```

## 7) Caddy (SSL + Reverse Proxy) — manual path only

```bash
sudo cp infra/prod/Caddyfile /etc/caddy/Caddyfile
sudo systemctl restart caddy
sudo systemctl enable caddy
```

Caddy will auto-issue TLS certificates for your domain and subdomains.

## 8) Verify Public Endpoints
```bash
curl -I https://kanaksetu.com
curl -I https://institution.kanaksetu.com
curl -I https://admin.kanaksetu.com
curl https://api.kanaksetu.com/api/v1/health
```

## 9) Rollout Command (future deploys)
```bash
cd /opt/kanak-setu
APP_DIR=/opt/kanak-setu BRANCH=main bash scripts/prod/deploy-vps.sh
```

## Operational Notes
- After deploy, inspect logs:
  - `pm2 logs kanak-api`
  - `pm2 logs kanak-donor-web`
  - `pm2 logs kanak-institution-web`
  - `pm2 logs kanak-admin-web`
- Keep firewall open for 80/443 only.
- Keep app ports (`3000/3001/3002/4000`) private on localhost.
