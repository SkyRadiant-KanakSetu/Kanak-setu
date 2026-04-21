'use client';
import { useState, useEffect } from 'react';
import { authApi, admin, merkleApi, setTokens, clearTokens } from '@/lib/api';

type Tab = 'dashboard' | 'institutions' | 'donations' | 'merkle' | 'webhooks' | 'audit';
const EXPLORER_TX_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_TX_BASE_URL || 'https://amoy.polygonscan.com/tx';

export default function AdminPage() {
  const showDevHints = process.env.NODE_ENV !== 'production';
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) setLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await authApi.login(email, password);
    if (!res.success) {
      setError(res.error?.message || 'Failed');
      return;
    }
    setTokens(res.data.accessToken, res.data.refreshToken);
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow">
          <h1 className="text-xl font-bold">Admin Login</h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <button className="w-full rounded bg-zinc-900 py-2 text-sm text-white hover:bg-zinc-800">
              Login
            </button>
          </form>
          {showDevHints && (
            <p className="mt-3 text-xs text-gray-400">admin@kanaksetu.in / password123</p>
          )}
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'institutions', label: '🏛 Institutions' },
    { key: 'donations', label: '💰 Donations' },
    { key: 'merkle', label: '⛓ Blockchain' },
    { key: 'webhooks', label: '🔔 Webhooks' },
    { key: 'audit', label: '📋 Audit Log' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-white p-4">
        <div className="font-bold text-zinc-800 mb-6">🛡 Admin Panel</div>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm mb-1 ${tab === t.key ? 'bg-zinc-100 font-medium' : 'hover:bg-zinc-50 text-gray-600'}`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => {
            clearTokens();
            setLoggedIn(false);
          }}
          className="mt-8 text-xs text-gray-400 hover:text-red-500"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'institutions' && <InstitutionsTab />}
        {tab === 'donations' && <DonationsTab />}
        {tab === 'merkle' && <MerkleTab />}
        {tab === 'webhooks' && <WebhooksTab />}
        {tab === 'audit' && <AuditTab />}
      </main>
    </div>
  );
}

// ── Dashboard ──
function DashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setLoadError('');
    admin.dashboard().then((r) => {
      setLoading(false);
      if (r.success) {
        setData(r.data);
        return;
      }
      setLoadError(r.error?.message || 'Failed to load dashboard');
    });
  }, []);
  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (loadError) {
    return (
      <div>
        <h2 className="text-lg font-bold">Dashboard</h2>
        <p className="mt-4 text-sm text-red-600">{loadError}</p>
        <p className="mt-2 text-xs text-gray-500">
          If you just logged in, confirm you are using a platform admin account (for example admin@kanaksetu.in),
          not an institution or donor login.
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <h2 className="text-lg font-bold">Dashboard</h2>
        <p className="mt-4 text-sm text-gray-500">No dashboard data.</p>
      </div>
    );
  }

  const cards = [
    { label: 'Total Donors', value: data.donors },
    { label: 'Active Institutions', value: data.institutions },
    { label: 'Completed Donations', value: data.donations },
    { label: 'Pending Approvals', value: data.pendingInstitutions, alert: true },
    { label: 'Failed/Disputed', value: data.failedDonations, alert: true },
  ];
  const donorCards = [
    { label: 'New Donors (30d)', value: data.newDonors30d ?? 0 },
    { label: 'Active Donors (30d)', value: data.activeDonors30d ?? 0 },
    { label: 'Repeat Donors (30d)', value: data.repeatDonors30d ?? 0 },
    {
      label: 'Avg Ticket (30d)',
      value: `₹${(((data.avgDonationTicketPaise30d ?? 0) as number) / 100).toFixed(0)}`,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold">Dashboard</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border p-4 ${c.alert && c.value > 0 ? 'border-red-200 bg-red-50' : 'bg-white'}`}
          >
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
      <h3 className="mt-8 text-sm font-semibold text-gray-700">Donor Analytics</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {donorCards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Institutions ──
function InstitutionsTab() {
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createOk, setCreateOk] = useState('');
  const [newInstitution, setNewInstitution] = useState({
    legalName: '',
    publicName: '',
    type: 'TRUST',
    email: '',
    password: '',
    city: '',
    state: '',
    pincode: '',
    has80G: false,
    pan: '',
    registrationNo: '',
    publicPageSlug: '',
    status: 'ACTIVE',
  });
  const load = () =>
    admin.institutions(1, filter || undefined).then((r) => r.success && setList(r.data || []));
  useEffect(() => {
    load();
  }, [filter]);

  const createInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateOk('');
    setCreating(true);
    const res = await admin.onboardInstitution({
      ...newInstitution,
      city: newInstitution.city || undefined,
      state: newInstitution.state || undefined,
      pincode: newInstitution.pincode || undefined,
      pan: newInstitution.pan || undefined,
      registrationNo: newInstitution.registrationNo || undefined,
      publicPageSlug: newInstitution.publicPageSlug || undefined,
    });
    setCreating(false);

    if (!res.success) {
      setCreateError(res.error?.message || 'Failed to onboard institution');
      return;
    }

    setCreateOk(`Institution onboarded: ${res.data?.email} (${res.data?.status})`);
    setNewInstitution({
      legalName: '',
      publicName: '',
      type: 'TRUST',
      email: '',
      password: '',
      city: '',
      state: '',
      pincode: '',
      has80G: false,
      pan: '',
      registrationNo: '',
      publicPageSlug: '',
      status: 'ACTIVE',
    });
    load();
  };

  const changeStatus = async (id: string, status: string) => {
    const notes = prompt('Admin notes (optional):');
    await admin.changeInstitutionStatus(id, status, notes || undefined);
    load();
  };

  const filters = ['', 'SUBMITTED', 'UNDER_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED'];

  return (
    <div>
      <h2 className="text-lg font-bold">Institutions</h2>
      <form onSubmit={createInstitution} className="mt-4 rounded-xl border bg-white p-4">
        <p className="text-sm font-semibold">Onboard institution</p>
        {createError && <p className="mt-2 text-xs text-red-600">{createError}</p>}
        {createOk && <p className="mt-2 text-xs text-green-700">{createOk}</p>}
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <input
            value={newInstitution.legalName}
            onChange={(e) => setNewInstitution((f) => ({ ...f, legalName: e.target.value }))}
            placeholder="Legal name *"
            className="rounded border px-2 py-1.5 text-sm"
            required
          />
          <input
            value={newInstitution.publicName}
            onChange={(e) => setNewInstitution((f) => ({ ...f, publicName: e.target.value }))}
            placeholder="Public name *"
            className="rounded border px-2 py-1.5 text-sm"
            required
          />
          <select
            value={newInstitution.type}
            onChange={(e) => setNewInstitution((f) => ({ ...f, type: e.target.value }))}
            className="rounded border px-2 py-1.5 text-sm"
          >
            {['TRUST', 'NGO', 'RELIGIOUS', 'FOUNDATION', 'CORPORATE_CSR'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="email"
            value={newInstitution.email}
            onChange={(e) => setNewInstitution((f) => ({ ...f, email: e.target.value }))}
            placeholder="Institution admin email *"
            className="rounded border px-2 py-1.5 text-sm"
            required
          />
          <input
            type="password"
            value={newInstitution.password}
            onChange={(e) => setNewInstitution((f) => ({ ...f, password: e.target.value }))}
            placeholder="Temporary password *"
            className="rounded border px-2 py-1.5 text-sm"
            minLength={8}
            required
          />
          <select
            value={newInstitution.status}
            onChange={(e) => setNewInstitution((f) => ({ ...f, status: e.target.value }))}
            className="rounded border px-2 py-1.5 text-sm"
          >
            {['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACTIVE', 'SUSPENDED'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            value={newInstitution.city}
            onChange={(e) => setNewInstitution((f) => ({ ...f, city: e.target.value }))}
            placeholder="City"
            className="rounded border px-2 py-1.5 text-sm"
          />
          <input
            value={newInstitution.state}
            onChange={(e) => setNewInstitution((f) => ({ ...f, state: e.target.value }))}
            placeholder="State"
            className="rounded border px-2 py-1.5 text-sm"
          />
          <input
            value={newInstitution.pincode}
            onChange={(e) => setNewInstitution((f) => ({ ...f, pincode: e.target.value }))}
            placeholder="Pincode"
            className="rounded border px-2 py-1.5 text-sm"
          />
          <input
            value={newInstitution.pan}
            onChange={(e) => setNewInstitution((f) => ({ ...f, pan: e.target.value }))}
            placeholder="PAN"
            className="rounded border px-2 py-1.5 text-sm"
          />
          <input
            value={newInstitution.registrationNo}
            onChange={(e) => setNewInstitution((f) => ({ ...f, registrationNo: e.target.value }))}
            placeholder="Registration number"
            className="rounded border px-2 py-1.5 text-sm"
          />
          <input
            value={newInstitution.publicPageSlug}
            onChange={(e) => setNewInstitution((f) => ({ ...f, publicPageSlug: e.target.value }))}
            placeholder="Public slug (optional)"
            className="rounded border px-2 py-1.5 text-sm"
          />
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={newInstitution.has80G}
            onChange={(e) => setNewInstitution((f) => ({ ...f, has80G: e.target.checked }))}
          />
          80G enabled
        </label>
        <div>
          <button
            disabled={creating}
            className="mt-3 rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create institution'}
          </button>
        </div>
      </form>
      <div className="mt-3 flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1 text-xs ${filter === f ? 'bg-zinc-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.map((inst: any) => (
          <div key={inst.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{inst.legalName}</h3>
                <p className="text-xs text-gray-500">
                  {inst.publicName} · {inst.type} · {inst.city}
                </p>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${inst.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : inst.status === 'SUBMITTED' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100'}`}
              >
                {inst.status}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              {inst.status === 'SUBMITTED' && (
                <button
                  onClick={() => changeStatus(inst.id, 'UNDER_REVIEW')}
                  className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                >
                  Start Review
                </button>
              )}
              {inst.status === 'UNDER_REVIEW' && (
                <button
                  onClick={() => changeStatus(inst.id, 'ACTIVE')}
                  className="rounded bg-green-50 px-2 py-1 text-xs text-green-700"
                >
                  Approve
                </button>
              )}
              {inst.status === 'UNDER_REVIEW' && (
                <button
                  onClick={() => changeStatus(inst.id, 'REJECTED')}
                  className="rounded bg-red-50 px-2 py-1 text-xs text-red-700"
                >
                  Reject
                </button>
              )}
              {inst.status === 'ACTIVE' && (
                <button
                  onClick={() => changeStatus(inst.id, 'SUSPENDED')}
                  className="rounded bg-orange-50 px-2 py-1 text-xs text-orange-700"
                >
                  Suspend
                </button>
              )}
              {inst.status === 'SUSPENDED' && (
                <button
                  onClick={() => changeStatus(inst.id, 'ACTIVE')}
                  className="rounded bg-green-50 px-2 py-1 text-xs text-green-700"
                >
                  Reinstate
                </button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-gray-400">No institutions found</p>}
      </div>
    </div>
  );
}

// ── Donations ──
function DonationsTab() {
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const load = () =>
    admin.donations(1, filter || undefined).then((r) => r.success && setList(r.data || []));
  useEffect(() => {
    load();
  }, [filter]);

  const filters = ['', 'COMPLETED', 'PAYMENT_FAILED', 'VENDOR_FAILED', 'DISPUTED', 'ANCHORED'];

  return (
    <div>
      <h2 className="text-lg font-bold">Donations</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1 text-xs ${filter === f ? 'bg-zinc-900 text-white' : 'bg-gray-100'}`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2">Donor</th>
              <th className="px-3 py-2">Institution</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Gold</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d: any) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">
                  {d.donor?.firstName} {d.donor?.lastName}
                </td>
                <td className="px-3 py-2 text-xs">{d.institution?.publicName}</td>
                <td className="px-3 py-2">₹{(d.amountPaise / 100).toFixed(0)}</td>
                <td className="px-3 py-2">
                  {d.goldQuantityMg ? `${parseFloat(d.goldQuantityMg).toFixed(1)} mg` : '-'}
                </td>
                <td className="px-3 py-2">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{d.status}</span>
                </td>
                <td className="px-3 py-2">
                  {d.status === 'VENDOR_FAILED' && (
                    <button
                      onClick={async () => {
                        await admin.retryVendor(d.id);
                        load();
                      }}
                      className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                    >
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Merkle / Blockchain ──
function MerkleTab() {
  const [batches, setBatches] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const load = () => merkleApi.batches().then((r) => r.success && setBatches(r.data || []));
  useEffect(() => {
    load();
  }, []);

  const seal = async () => {
    setMsg('Sealing...');
    const r = await merkleApi.seal();
    setMsg(JSON.stringify(r.data));
    load();
  };
  const anchorAll = async () => {
    setMsg('Anchoring...');
    const r = await merkleApi.anchorAll();
    setMsg(JSON.stringify(r.data));
    load();
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Blockchain Anchoring</h2>
      <div className="mt-4 flex gap-3">
        <button
          onClick={seal}
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          Seal Batch
        </button>
        <button
          onClick={anchorAll}
          className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          Anchor All Sealed
        </button>
      </div>
      {msg && (
        <pre className="mt-3 rounded bg-gray-100 p-3 text-xs overflow-auto max-h-40">{msg}</pre>
      )}
      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Leaves</th>
              <th className="px-3 py-2">Root</th>
              <th className="px-3 py-2">Tx Hash</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b: any) => (
              <tr key={b.id} className="border-t">
                <td className="px-3 py-2">{b.batchNumber}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs ${b.status === 'ANCHORED' ? 'bg-green-50 text-green-700' : b.status === 'SEALED' ? 'bg-yellow-50 text-yellow-700' : b.status === 'ANCHOR_FAILED' ? 'bg-red-50 text-red-700' : 'bg-gray-100'}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-3 py-2">{b.leafCount}</td>
                <td className="px-3 py-2 font-mono text-xs">{b.merkleRoot?.slice(0, 16)}...</td>
                <td className="px-3 py-2 text-xs">
                  {b.anchor?.txHash ? (
                    <a
                      href={`${EXPLORER_TX_BASE_URL}/${b.anchor.txHash}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {b.anchor.txHash.slice(0, 16)}...
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-2">
                  {b.status === 'SEALED' && (
                    <button
                      onClick={async () => {
                        await merkleApi.anchor(b.id);
                        load();
                      }}
                      className="rounded bg-green-50 px-2 py-1 text-xs text-green-700"
                    >
                      Anchor
                    </button>
                  )}
                  {b.status === 'ANCHOR_FAILED' && (
                    <button
                      onClick={async () => {
                        await merkleApi.anchor(b.id);
                        load();
                      }}
                      className="rounded bg-red-50 px-2 py-1 text-xs text-red-700"
                    >
                      Retry Anchor
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Webhook deliveries (idempotency ledger) ──
function WebhooksTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const load = () =>
    admin.webhookDeliveries(1).then((r) => {
      if (r.success) setRows(r.data || []);
      else setMsg(r.error?.message || 'Failed to load');
    });
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Webhook ingest ledger</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={async () => {
              setMsg('');
              const r = await admin.runReconciliation();
              setMsg(
                r.success
                  ? `Reconciliation run #${(r.data as any)?.runRecordId?.slice(0, 8)}…`
                  : r.error?.message || 'Failed'
              );
            }}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm text-white hover:bg-amber-700"
          >
            Run reconciliation
          </button>
        </div>
      </div>
      {msg && <p className="mt-2 text-sm text-zinc-600">{msg}</p>}
      <p className="mt-1 text-xs text-zinc-500">
        Razorpay/PayU hits <code className="rounded bg-zinc-100 px-1">/api/v1/webhooks/…</code> are
        deduped here before payment state changes.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Idempotency key</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w: any) => (
              <tr key={w.id} className="border-t">
                <td className="px-3 py-2 text-gray-400">
                  {new Date(w.createdAt).toLocaleString('en-IN')}
                </td>
                <td className="px-3 py-2">{w.provider}</td>
                <td className="px-3 py-2">
                  <span className="rounded bg-gray-100 px-1 py-0.5">{w.status}</span>
                </td>
                <td className="px-3 py-2 font-mono text-[10px]">{w.idempotencyKey?.slice(0, 40)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Audit Log ──
function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    admin.auditLogs().then((r) => r.success && setLogs(r.data || []));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold">Audit Log</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Entity</th>
              <th className="px-3 py-2">Entity ID</th>
              <th className="px-3 py-2">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: any) => (
              <tr key={l.id} className="border-t">
                <td className="px-3 py-2 text-gray-400">
                  {new Date(l.createdAt).toLocaleString('en-IN')}
                </td>
                <td className="px-3 py-2">{l.user?.email || '-'}</td>
                <td className="px-3 py-2">
                  <span className="rounded bg-gray-100 px-1 py-0.5">{l.action}</span>
                </td>
                <td className="px-3 py-2">{l.entity}</td>
                <td className="px-3 py-2 font-mono">{l.entityId?.slice(0, 12)}</td>
                <td className="px-3 py-2 text-gray-400">{l.ipAddress || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
