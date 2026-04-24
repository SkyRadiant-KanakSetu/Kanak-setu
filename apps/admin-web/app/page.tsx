'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { authApi, admin, merkleApi, setTokens, clearTokens } from '@/lib/api';

type Tab = 'dashboard' | 'institutions' | 'donations' | 'merkle' | 'assistant' | 'webhooks' | 'audit';
const EXPLORER_TX_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_TX_BASE_URL || '';

function getExplorerTxBaseUrl(network?: string): string {
  if (network === 'polygon_mainnet') return 'https://polygonscan.com/tx';
  if (network === 'polygon_amoy') return 'https://amoy.polygonscan.com/tx';
  return EXPLORER_TX_BASE_URL || 'https://polygonscan.com/tx';
}

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
          <div className="mb-4 flex flex-col items-center justify-center">
            <Image
              src="/logo.png"
              alt="Kanak Setu"
              width={76}
              height={76}
              className="h-16 w-16 rounded-full border border-amber-300/70 p-0.5 shadow-[0_8px_22px_rgba(180,120,20,0.24)] saturate-150"
            />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Admin Console</p>
          </div>
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
    { key: 'assistant', label: '🤖 Master Agent' },
    { key: 'webhooks', label: '🔔 Webhooks' },
    { key: 'audit', label: '📋 Audit Log' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-white p-4">
        <div className="mb-6 flex items-center gap-3 font-bold text-zinc-800">
          <Image
            src="/logo.png"
            alt="Kanak Setu"
            width={42}
            height={42}
            className="h-11 w-11 rounded-full border border-amber-300/70 p-0.5 shadow-[0_6px_18px_rgba(180,120,20,0.22)] saturate-150"
          />
          <span className="leading-tight">
            <span className="block">Kanak Setu</span>
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Admin Panel
            </span>
          </span>
        </div>
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
        {tab === 'assistant' && <AssistantTab />}
        {tab === 'webhooks' && <WebhooksTab />}
        {tab === 'audit' && <AuditTab />}
      </main>
    </div>
  );
}

function AssistantTab() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ role: 'admin' | 'agent'; text: string }>>([
    {
      role: 'agent',
      text: 'I am your Kanak Setu Master Agent. Ask me about blockchain anchoring, donation flow issues, deployment checks, reconciliation, or institution operations.',
    },
  ]);

  const ask = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setHistory((prev) => [...prev, { role: 'admin', text: q }]);
    setQuery('');
    setLoading(true);
    const res = await admin.assistantQuery(q);
    if (res.success) {
      setHistory((prev) => [...prev, { role: 'agent', text: res.data?.answer || 'No response available.' }]);
    } else {
      setHistory((prev) => [
        ...prev,
        { role: 'agent', text: res.error?.message || 'Unable to process your query right now.' },
      ]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Master Admin Agent</h2>
      <p className="mt-1 text-sm text-gray-500">
        Ask operational questions and get guided next steps for the platform.
      </p>

      <div className="mt-4 h-[420px] overflow-y-auto rounded-xl border bg-white p-4">
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div
              key={`${item.role}-${idx}`}
              className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                item.role === 'admin' ? 'ml-auto bg-zinc-900 text-white' : 'bg-gray-100 text-zinc-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{item.text}</p>
            </div>
          ))}
          {loading && (
            <div className="max-w-[90%] rounded-xl bg-gray-100 px-3 py-2 text-sm text-zinc-600">
              Thinking...
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              ask();
            }
          }}
          placeholder="Ask anything about admin operations..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button
          onClick={ask}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ── Dashboard ──
function DashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(30);
  useEffect(() => {
    setLoading(true);
    setLoadError('');
    admin.dashboard(rangeDays).then((r) => {
      setLoading(false);
      if (r.success) {
        setData(r.data);
        return;
      }
      setLoadError(r.error?.message || 'Failed to load dashboard');
    });
  }, [rangeDays]);
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
    { label: `New Donors (${data.rangeDays}d)`, value: data.newDonorsInRange ?? 0 },
    { label: `Active Donors (${data.rangeDays}d)`, value: data.activeDonorsInRange ?? 0 },
    { label: `Repeat Donors (${data.rangeDays}d)`, value: data.repeatDonorsInRange ?? 0 },
    {
      label: `Avg Ticket (${data.rangeDays}d)`,
      value: `₹${(((data.avgDonationTicketPaiseInRange ?? 0) as number) / 100).toFixed(0)}`,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRangeDays(d as 7 | 30 | 90)}
              className={`rounded px-3 py-1 text-xs ${rangeDays === d ? 'bg-zinc-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
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
      <div className="mt-6 rounded-xl border bg-white p-4">
        <p className="text-xs text-gray-500">Daily donor activity trend</p>
        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniTrend title="Donations / day" values={(data.donorTrend || []).map((d: any) => d.donations)} />
          <MiniTrend
            title="Active donors / day"
            values={(data.donorTrend || []).map((d: any) => d.activeDonors)}
          />
        </div>
      </div>
    </div>
  );
}

function MiniTrend({ title, values }: { title: string; values: number[] }) {
  const max = Math.max(1, ...values);
  const sample = values.slice(-20);
  return (
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <div className="mt-2 flex h-16 items-end gap-1">
        {sample.map((v, i) => (
          <div
            key={`${title}-${i}`}
            className="w-2 rounded-sm bg-amber-600/80"
            style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
            title={String(v)}
          />
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
  const [savingUpiForId, setSavingUpiForId] = useState('');
  const [upiDraftById, setUpiDraftById] = useState<Record<string, string>>({});
  const [copiedLinkForId, setCopiedLinkForId] = useState('');
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
    upiId: '',
    status: 'ACTIVE',
  });
  const load = () =>
    admin.institutions(1, filter || undefined).then((r) => {
      if (!r.success) return;
      const items = r.data || [];
      setList(items);
      setUpiDraftById((prev) => {
        const next = { ...prev };
        for (const inst of items) {
          if (next[inst.id] === undefined) next[inst.id] = inst.upiId || '';
        }
        return next;
      });
    });
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
      upiId: newInstitution.upiId || undefined,
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
      upiId: '',
      status: 'ACTIVE',
    });
    load();
  };

  const changeStatus = async (id: string, status: string) => {
    const notes = prompt('Admin notes (optional):');
    await admin.changeInstitutionStatus(id, status, notes || undefined);
    load();
  };

  const saveUpiId = async (id: string) => {
    setSavingUpiForId(id);
    const draft = (upiDraftById[id] || '').trim();
    const res = await admin.updateInstitutionUpi(id, draft);
    if (res.success) {
      setList((prev) => prev.map((inst) => (inst.id === id ? { ...inst, upiId: res.data?.upiId || '' } : inst)));
      setUpiDraftById((prev) => ({ ...prev, [id]: res.data?.upiId || '' }));
    } else {
      alert(res.error?.message || 'Failed to save UPI ID');
    }
    setSavingUpiForId('');
  };

  const donorSiteBase = () => {
    const env = process.env.NEXT_PUBLIC_DONOR_SITE_URL?.trim().replace(/\/$/, '');
    if (env) return env;
    if (typeof window === 'undefined') return 'https://kanaksetu.com';
    const host = window.location.hostname;
    if (host.startsWith('admin.')) return `${window.location.protocol}//${host.replace(/^admin\./, '')}`;
    return window.location.origin;
  };

  const buildDonorLink = (inst: any) => {
    const base = donorSiteBase();
    if (inst.publicPageSlug) {
      return `${base}/give/${encodeURIComponent(inst.publicPageSlug)}`;
    }
    const q = new URLSearchParams({
      institution: inst.id,
      name: inst.publicName,
    });
    return `${base}/donate?${q.toString()}`;
  };

  const copyDonorLink = async (inst: any) => {
    try {
      await navigator.clipboard.writeText(buildDonorLink(inst));
      setCopiedLinkForId(inst.id);
      window.setTimeout(() => {
        setCopiedLinkForId((prev) => (prev === inst.id ? '' : prev));
      }, 1800);
    } catch {
      alert('Could not copy link. Please copy manually from browser address bar.');
    }
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
          <input
            value={newInstitution.upiId}
            onChange={(e) => setNewInstitution((f) => ({ ...f, upiId: e.target.value }))}
            placeholder="UPI ID (optional)"
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
              <button
                onClick={() => copyDonorLink(inst)}
                className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200"
              >
                {copiedLinkForId === inst.id ? 'Copied donor link' : 'Copy donor link'}
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={upiDraftById[inst.id] ?? inst.upiId ?? ''}
                onChange={(e) => setUpiDraftById((prev) => ({ ...prev, [inst.id]: e.target.value }))}
                placeholder="institution@upi"
                className="w-full rounded border px-2 py-1.5 text-xs sm:max-w-xs"
              />
              <button
                onClick={() => saveUpiId(inst.id)}
                disabled={savingUpiForId === inst.id}
                className="rounded bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {savingUpiForId === inst.id ? 'Saving...' : 'Save UPI ID'}
              </button>
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
              <th className="px-3 py-2">Donation Ref</th>
              <th className="px-3 py-2">Donor</th>
              <th className="px-3 py-2">Institution</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Gold</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Payment Ref</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d: any) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{d.donationRef?.slice(0, 10) || d.id.slice(0, 10)}</td>
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
                <td className="px-3 py-2 text-xs">
                  <p className="font-mono text-[10px]">{d.payment?.providerPaymentId || d.payment?.providerOrderId || '-'}</p>
                  {d.payment?.events?.[0]?.eventType && (
                    <p className="mt-0.5 text-[10px] text-gray-500">{d.payment.events[0].eventType}</p>
                  )}
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
  const [wallet, setWallet] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const load = () =>
    merkleApi.batches().then((r) => {
      if (!r.success) return;
      const nextBatches = r.data || [];
      setBatches(nextBatches);
      // Clear stale action errors once no batches are currently failing.
      if (!nextBatches.some((b: any) => b.status === 'ANCHOR_FAILED')) {
        setMsg('');
      }
    });
  const loadWallet = async () => {
    setLoadingWallet(true);
    const r = await merkleApi.walletBalance();
    if (r.success) {
      setWallet(r.data || null);
    } else {
      setMsg(r.error?.message || 'Failed to fetch Amoy wallet balance');
    }
    setLoadingWallet(false);
  };
  useEffect(() => {
    load();
    loadWallet();
  }, []);
  const explorerTxBaseUrl = getExplorerTxBaseUrl(wallet?.network);

  const formatAnchorResultMessage = (result: any) => {
    const items = Array.isArray(result) ? result : [result];
    const anchored = items.filter((item: any) => item?.txHash).length;
    const failed = items.filter((item: any) => item?.error).length;
    const exhausted = items.filter((item: any) =>
      String(item?.error || '').includes('Anchor retries exhausted')
    ).length;

    if (anchored || failed) {
      const parts = [`Anchored: ${anchored}`];
      if (failed) parts.push(`Failed: ${failed}`);
      if (exhausted) parts.push(`Skipped exhausted: ${exhausted}`);
      return parts.join(' | ');
    }
    return 'No sealed batches to anchor.';
  };

  const seal = async () => {
    setActionLoading(true);
    setMsg('Sealing...');
    const r = await merkleApi.seal();
    setMsg(r.success ? 'Batch seal completed.' : r.error?.message || 'Failed to seal batch.');
    await load();
    setActionLoading(false);
  };
  const anchorAll = async () => {
    setActionLoading(true);
    setMsg('Anchoring...');
    const r = await merkleApi.anchorAll();
    setMsg(r.success ? formatAnchorResultMessage(r.data) : r.error?.message || 'Failed to anchor sealed batches.');
    await load();
    setActionLoading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Blockchain Anchoring</h2>
      <div className="mt-4 rounded-xl border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Anchor Wallet Balance</p>
            <p className="mt-1 text-2xl font-bold">
              {wallet ? `${Number(wallet.balanceMatic || 0).toFixed(6)} MATIC` : '--'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {wallet?.address ? `Address: ${wallet.address}` : 'Address unavailable'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {wallet?.network ? `Network: ${wallet.network} (${wallet.chainId})` : ''}
            </p>
          </div>
          <button
            onClick={loadWallet}
            disabled={loadingWallet}
            className="rounded bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-60"
          >
            {loadingWallet ? 'Refreshing...' : 'Refresh balance'}
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={seal}
          disabled={actionLoading}
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          Seal Batch
        </button>
        <button
          onClick={anchorAll}
          disabled={actionLoading}
          className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          Anchor All Sealed
        </button>
        <button
          onClick={async () => {
            setActionLoading(true);
            setMsg('Anchoring (force mode)...');
            const r = await merkleApi.anchorAll(true);
            setMsg(
              r.success
                ? formatAnchorResultMessage(r.data)
                : r.error?.message || 'Failed to force-anchor sealed batches.'
            );
            await load();
            setActionLoading(false);
          }}
          disabled={actionLoading}
          className="rounded bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700"
        >
          Force Anchor (override min leaves)
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
              <th className="px-3 py-2">Anchor</th>
              <th className="px-3 py-2">Attempts</th>
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
                <td className="px-3 py-2">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                    {b.anchor?.status || 'PENDING'}
                  </span>
                </td>
                <td className="px-3 py-2">{b.anchor?.attempts ?? 0}</td>
                <td className="px-3 py-2">{b.leafCount}</td>
                <td className="px-3 py-2 font-mono text-xs">{b.merkleRoot?.slice(0, 16)}...</td>
                <td className="px-3 py-2 text-xs">
                  {b.anchor?.txHash ? (
                    <a
                      href={`${explorerTxBaseUrl}/${b.anchor.txHash}`}
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
