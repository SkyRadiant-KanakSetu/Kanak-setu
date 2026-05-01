#!/usr/bin/env bash
# Kanak Setu — database backup script
# Designed to run from cron. Writes to APP_DIR/backups/.
# Retains 7 days of backups.

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/kanak-setu}"
BACKUP_DIR="$APP_DIR/backups"
LOG_FILE="$APP_DIR/logs/backup.log"
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
OUTPUT="$BACKUP_DIR/${TIMESTAMP}-kanak.sql.gz"

mkdir -p "$BACKUP_DIR" "$APP_DIR/logs"

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting backup..." >> "$LOG_FILE"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] ERROR: DATABASE_URL not set" >> "$LOG_FILE"
  exit 1
fi

pg_dump "$DATABASE_URL" | gzip > "$OUTPUT"

# Verify the backup is readable
gunzip -t "$OUTPUT"

# Retain only the last 7 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup complete: $OUTPUT ($SIZE)" >> "$LOG_FILE"
