'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { admin } from '@/lib/api';

type DeployRow = {
  timestamp: string;
  deployType: string;
  installSkipped: string;
  durationSeconds: number;
};

type DeploySummary = {
  total: number;
  skipRate: number;
  avgDurationWithSkip: number | null;
  avgDurationWithInstall: number | null;
  savingsSeconds: number;
};

type Pm2Row = {
  name: string;
  status: string;
  uptimeMs: number;
  memoryRssBytes: number;
  restartCount: number;
};

type VerifyResult = {
  found?: boolean;
  overall?: string;
  timestamp?: string;
  startedAt?: string;
  finishedAt?: string;
  success?: number;
  localHealthMs?: number;
  dbHealthOk?: number;
  pm2MemoryCheckOk?: number;
  backup_status?: string;
  backup_latest?: string;
  backup_age_hours?: number;
  message?: string;
};

type OperatorActivity = {
  window_days: number;
  total_actions: number;
  by_type: Record<string, number>;
  unique_operators: number;
  last_action_at: string | null;
};

function fmtDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '-';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function backupIndicator(ageHours: number | undefined) {
  if (ageHours === undefined || ageHours < 0) {
    return { tone: 'red' as const, text: 'No recent backup found' };
  }
  if (ageHours <= 24) {
    return { tone: 'green' as const, text: `Last backup ${ageHours}h ago` };
  }
  if (ageHours <= 48) {
    return { tone: 'amber' as const, text: `Backup is ${ageHours}h old — check cron` };
  }
  return { tone: 'red' as const, text: 'No recent backup found' };
}

export default function ReliabilityDashboardPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [deployRows, setDeployRows] = useState<DeployRow[]>([]);
  const [deploySummary, setDeploySummary] = useState<DeploySummary | null>(null);
  const [pm2Rows, setPm2Rows] = useState<Pm2Row[]>([]);
  const [verifyData, setVerifyData] = useState<VerifyResult | null>(null);
  const [operatorActivity, setOperatorActivity] = useState<OperatorActivity | null>(null);
  const [dismissedOperatorNotice, setDismissedOperatorNotice] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setAuthError('Session expired. Please log in again.');
      setAuthChecked(true);
      return;
    }

    admin.dashboard(7).then((res) => {
      if (!res.success) {
        setAuthError(res.error?.message || 'You do not have access to this page.');
      }
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!authChecked || authError) return;
    setLoadError('');
    Promise.all([
      fetch('/api/reliability/deploy-telemetry?take=10').then((r) => r.json()),
      fetch('/api/reliability/pm2-status').then((r) => r.json()),
      fetch('/api/reliability/last-verify').then((r) => r.json()),
      fetch('/api/reliability/operator-activity?days=14').then((r) => r.json()),
    ])
      .then(([deploy, pm2, verify, ops]) => {
        if (!deploy.success || !pm2.success || !verify.success || !ops.success) {
          throw new Error(
            deploy.error?.message ||
              pm2.error?.message ||
              verify.error?.message ||
              ops.error?.message ||
              'Could not load reliability data'
          );
        }
        const d = deploy.data as { entries?: DeployRow[]; summary?: DeploySummary } | DeployRow[];
        if (Array.isArray(d)) {
          setDeployRows(d);
          setDeploySummary(null);
        } else {
          setDeployRows(Array.isArray(d.entries) ? d.entries : []);
          setDeploySummary(d.summary ?? null);
        }
        setPm2Rows(Array.isArray(pm2.data) ? pm2.data : []);
        setVerifyData(verify.data || null);
        setOperatorActivity(ops.data || null);
      })
      .catch((e: unknown) => {
        setLoadError(e instanceof Error ? e.message : 'Failed to fetch reliability data');
      });
  }, [authChecked, authError]);

  const warningBaseline = useMemo(
    () => [
      { app: 'admin-web', warnings: 0, updatedAt: '2026-05-01' },
      { app: 'donor-web', warnings: 0, updatedAt: '2026-05-01' },
      { app: 'institution-web', warnings: 0, updatedAt: '2026-05-01' },
    ],
    []
  );

  const backupUi = backupIndicator(verifyData?.backup_age_hours);
  const totalDeploys = deploySummary?.total ?? deployRows.length;
  const hasBothSkipTypes =
    deployRows.some((r) => String(r.installSkipped).toLowerCase() === 'yes') &&
    deployRows.some((r) => String(r.installSkipped).toLowerCase() === 'no');
  const showSavings =
    deploySummary && deploySummary.savingsSeconds > 0 && hasBothSkipTypes;
  const showChurnWarn =
    deploySummary && deploySummary.skipRate === 0 && deploySummary.total >= 5;

  if (!authChecked) {
    return <div className="p-8 text-sm text-gray-500">Checking access…</div>;
  }

  if (authError) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-xl font-semibold">Reliability dashboard</h1>
        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {authError}
        </div>
        <div className="mt-4 flex gap-3">
          <Link href="/" className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">
            Go to login
          </Link>
          <button
            className="rounded border px-4 py-2 text-sm"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reliability Dashboard</h1>
        <Link href="/" className="text-sm text-amber-700 hover:underline">
          Back to admin
        </Link>
      </div>

      {loadError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{loadError}</div>
      )}

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Service Health (PM2)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500">
              <tr>
                <th className="pb-2">Service</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Uptime</th>
                <th className="pb-2">Memory RSS</th>
                <th className="pb-2">Restarts</th>
              </tr>
            </thead>
            <tbody>
              {pm2Rows.map((row) => (
                <tr key={row.name} className="border-t">
                  <td className="py-2">{row.name}</td>
                  <td className="py-2">{row.status}</td>
                  <td className="py-2">{fmtDuration(Math.floor((row.uptimeMs || 0) / 1000))}</td>
                  <td className="py-2">{((row.memoryRssBytes || 0) / (1024 * 1024)).toFixed(1)} MB</td>
                  <td className="py-2">{row.restartCount || 0}</td>
                </tr>
              ))}
              {!pm2Rows.length && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={5}>
                    No PM2 status rows returned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Deploy Performance</h2>
        {totalDeploys < 2 ? (
          <p className="mt-2 text-sm text-gray-500">Not enough data yet (need at least 2 deploy entries).</p>
        ) : (
          <>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500">
                  <tr>
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Install skipped</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {deployRows.map((row, idx) => (
                    <tr key={`${row.timestamp}-${idx}`} className="border-t">
                      <td className="py-2">
                        {row.timestamp ? new Date(row.timestamp).toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="py-2">{row.deployType || '-'}</td>
                      <td className="py-2">
                        {String(row.installSkipped).toLowerCase() === 'yes'
                          ? 'Yes'
                          : String(row.installSkipped).toLowerCase() === 'no'
                            ? 'No'
                            : row.installSkipped || '-'}
                      </td>
                      <td className="py-2">{fmtDuration(row.durationSeconds)}</td>
                    </tr>
                  ))}
                  {!deployRows.length && (
                    <tr>
                      <td className="py-3 text-gray-500" colSpan={4}>
                        No deploy telemetry found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {hasBothSkipTypes && deploySummary && (
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <p>
                  <span className="text-gray-500">Avg with lockfile skip:</span>{' '}
                  <span className="font-semibold">
                    {deploySummary.avgDurationWithSkip != null ? `${deploySummary.avgDurationWithSkip}s` : '—'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Avg without lockfile skip:</span>{' '}
                  <span className="font-semibold">
                    {deploySummary.avgDurationWithInstall != null
                      ? `${deploySummary.avgDurationWithInstall}s`
                      : '—'}
                  </span>
                </p>
              </div>
            )}
            {showSavings && (
              <p className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                deploy-fast saving ~{deploySummary!.savingsSeconds}s on average
              </p>
            )}
            {showChurnWarn && (
              <p className="mt-2 inline-block rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                Lockfile may be changing every deploy — check package.json churn
              </p>
            )}
          </>
        )}
      </section>

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Backup Status</h2>
        <div
          className={`mt-3 rounded border p-4 text-sm ${
            backupUi.tone === 'green'
              ? 'border-green-200 bg-green-50 text-green-900'
              : backupUi.tone === 'amber'
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : 'border-red-200 bg-red-50 text-red-900'
          }`}
        >
          <p className="font-medium">{backupUi.text}</p>
          {verifyData?.backup_latest && verifyData.backup_status === 'PASS' && (
            <p className="mt-1 break-all text-xs opacity-90">{verifyData.backup_latest}</p>
          )}
        </div>
      </section>

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Operator Activity</h2>
        {!dismissedOperatorNotice && (operatorActivity?.total_actions ?? 0) === 0 && (
          <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <div className="flex items-start justify-between gap-3">
              <p>
                The failed transaction review queue is active. Review any stale transactions weekly to keep this dashboard healthy.
              </p>
              <button
                type="button"
                onClick={() => setDismissedOperatorNotice(true)}
                className="rounded border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">Total actions (14d)</p>
            <p className="text-lg font-semibold">{operatorActivity?.total_actions ?? 0}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">Unique operators</p>
            <p className="text-lg font-semibold">{operatorActivity?.unique_operators ?? 0}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">Last action</p>
            <p className="text-sm font-semibold">
              {operatorActivity?.last_action_at
                ? new Date(operatorActivity.last_action_at).toLocaleString('en-IN')
                : '-'}
            </p>
          </div>
        </div>
        {(operatorActivity?.total_actions ?? 0) === 0 &&
          verifyData?.finishedAt &&
          Date.now() - new Date(verifyData.finishedAt).getTime() > 3 * 24 * 60 * 60 * 1000 && (
            <p className="mt-2 inline-block rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              No activity yet
            </p>
          )}
      </section>

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Warning Debt Tracker</h2>
        <p className="mt-1 text-xs text-gray-500">Static baseline; wire to lint-count API in next iteration.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {warningBaseline.map((item) => (
            <div key={item.app} className="rounded border p-3">
              <p className="text-sm font-medium">{item.app}</p>
              <p className="text-lg font-semibold">{item.warnings} warnings</p>
              <p className="text-xs text-gray-500">Updated: {item.updatedAt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Last Verification Run</h2>
        {verifyData?.found === false ? (
          <p className="mt-2 text-sm text-gray-500">{verifyData.message || 'No verify snapshot present.'}</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Overall</p>
              <p className="text-sm font-semibold">{verifyData?.overall ?? (verifyData?.success ? 'PASS' : '—')}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Success</p>
              <p className="text-sm font-semibold">{verifyData?.success ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Local /health</p>
              <p className="text-sm font-semibold">{verifyData?.localHealthMs ?? '-'} ms</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">DB connectivity</p>
              <p className="text-sm font-semibold">{verifyData?.dbHealthOk ? 'OK' : 'Fail'}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">PM2 memory check</p>
              <p className="text-sm font-semibold">{verifyData?.pm2MemoryCheckOk ? 'OK' : 'Fail'}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
