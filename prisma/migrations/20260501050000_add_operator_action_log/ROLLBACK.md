# Rollback Plan — add_operator_action_log

If this migration must be rolled back manually:

```sql
DROP TABLE IF EXISTS "OperatorActionLog";
```

Notes:
- Run only after confirming no dependent runtime code still references this table.
- Prefer rollback in a maintenance window with backup taken first.
