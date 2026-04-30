# Database Backup Setup

## Recommended backup command

```bash
pg_dump "$DATABASE_URL" | gzip > \
  /opt/kanak-setu/backups/$(date +%Y-%m-%d-%H%M)-kanak.sql.gz
```

## Recommended cron schedule

Run daily at 02:00 server time:
```
0 2 * * * /opt/kanak-setu/scripts/prod/backup.sh >> /opt/kanak-setu/logs/backup.log 2>&1
```

## Retention policy

Keep 7 daily backups. Add this cleanup to the backup script:
```bash
find /opt/kanak-setu/backups -name "*.sql.gz" -mtime +7 -delete
```

## Verify a backup is valid

```bash
LATEST=$(ls -t /opt/kanak-setu/backups/*.sql.gz | head -1)
gunzip -t "$LATEST" && echo "Backup integrity: OK"
```

## Restore procedure

```bash
gunzip -c /opt/kanak-setu/backups/<filename>.sql.gz | psql "$DATABASE_URL"
```

Always restore to a test database first to verify data integrity before
restoring to production.
