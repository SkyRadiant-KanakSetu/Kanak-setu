#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
STAGE="${WEB_WARNING_POLICY_STAGE:-budget}"
BUDGET_FILE="${WEB_WARNING_BUDGET_FILE:-${ROOT_DIR}/web-warning-budgets.json}"
REPORT_FILE="${ROOT_DIR}/.eslint-web-report.json"

echo "[web-quality] stage=${STAGE}"
echo "[web-quality] running eslint on web apps"

set +e
npx eslint \
  apps/admin-web/app apps/admin-web/components apps/admin-web/lib \
  apps/donor-web/app apps/donor-web/components apps/donor-web/lib \
  apps/institution-web/app apps/institution-web/components apps/institution-web/lib \
  --ext .ts,.tsx \
  --format json \
  --output-file "${REPORT_FILE}"
ESLINT_EXIT=$?
set -e

node - "${REPORT_FILE}" "${STAGE}" "${BUDGET_FILE}" "${ESLINT_EXIT}" <<'NODE'
const fs = require('fs');

const reportPath = process.argv[2];
const stage = process.argv[3];
const budgetPath = process.argv[4];
const eslintExit = Number(process.argv[5] || 0);

const apps = ['apps/admin-web', 'apps/donor-web', 'apps/institution-web'];
const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const budgets = fs.existsSync(budgetPath)
  ? JSON.parse(fs.readFileSync(budgetPath, 'utf8'))
  : {};

const summary = Object.fromEntries(apps.map((app) => [app, { warnings: 0, errors: 0 }]));

for (const file of results) {
  const app = apps.find((name) => file.filePath.replace(/\\/g, '/').includes(`/${name}/`));
  if (!app) continue;
  summary[app].warnings += Number(file.warningCount || 0);
  summary[app].errors += Number(file.errorCount || 0);
}

console.log('[web-quality] eslint summary');
for (const app of apps) {
  console.log(`  ${app}: warnings=${summary[app].warnings} errors=${summary[app].errors}`);
}

const hasErrors = apps.some((app) => summary[app].errors > 0);
if (hasErrors || eslintExit !== 0) {
  console.error('[web-quality] FAIL: eslint errors detected.');
  process.exit(2);
}

if (stage === 'strict') {
  const hasWarnings = apps.some((app) => summary[app].warnings > 0);
  if (hasWarnings) {
    console.error('[web-quality] FAIL: strict stage requires zero warnings.');
    process.exit(3);
  }
  console.log('[web-quality] strict stage passed (zero warnings).');
  process.exit(0);
}

if (stage !== 'budget') {
  console.error(`[web-quality] FAIL: unsupported stage "${stage}" (use "budget" or "strict").`);
  process.exit(4);
}

let overBudget = false;
for (const app of apps) {
  const budget = Number(budgets[app]);
  if (!Number.isFinite(budget) || budget < 0) {
    console.error(`[web-quality] FAIL: missing/invalid budget for ${app} in ${budgetPath}.`);
    process.exit(5);
  }
  if (summary[app].warnings > budget) {
    overBudget = true;
    console.error(
      `[web-quality] FAIL: ${app} warnings=${summary[app].warnings} exceeds budget=${budget}.`
    );
  }
}

if (overBudget) process.exit(6);
console.log('[web-quality] budget stage passed (no warning regression).');
NODE

echo "[web-quality] running web builds (type + compile)"
echo "[web-quality] building shared packages required by web apps"
npm run build:packages
npm run build -w @kanak-setu/admin-web
npm run build -w @kanak-setu/donor-web
npm run build -w @kanak-setu/institution-web

echo "[web-quality] PASS"
