'use client';
import { useState, useEffect } from 'react';
import { auth, portal, portalFeatureFlags, setTokens, clearTokens } from '@/lib/api';
import type {
  Demographics,
  DonationRow,
  DonorDirectoryRow,
  FaithSettings,
  GeoDistribution,
  InstitutionDashboard,
  LedgerEntry,
  OpsTask,
  SpiritualFunction,
} from '@/lib/api';
import { DonationQr } from '@/components/DonationQr';
import { InstitutionLayout } from '@/components/InstitutionLayout';
import { OverviewPanel } from '@/components/portal/OverviewPanel';
import { SpiritualFunctionsPanel } from '@/components/portal/SpiritualFunctionsPanel';
import { DonorInsightsPanel } from '@/components/portal/DonorInsightsPanel';
import { GeoReachPanel } from '@/components/portal/GeoReachPanel';
import { OpsTasksPanel } from '@/components/portal/OpsTasksPanel';

type InstitutionTab =
  | 'overview'
  | 'functions'
  | 'insights'
  | 'geo'
  | 'ops'
  | 'donations'
  | 'donors'
  | 'ledger'
  | 'settings';

export default function InstitutionHome() {
  const showDevHints = process.env.NODE_ENV !== 'production';
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<InstitutionDashboard | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [portalError, setPortalError] = useState('');
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(30);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiSaving, setUpiSaving] = useState(false);
  const [upiMessage, setUpiMessage] = useState('');
  const [activeTab, setActiveTab] = useState<InstitutionTab>('overview');
  const [donationSearch, setDonationSearch] = useState('');
  const [donorSearch, setDonorSearch] = useState('');
  const [functionsList, setFunctionsList] = useState<SpiritualFunction[]>([]);
  const [tasksList, setTasksList] = useState<OpsTask[]>([]);
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [geoData, setGeoData] = useState<GeoDistribution | null>(null);
  const [faithSettings, setFaithSettings] = useState<FaithSettings>({
    faithTradition: '',
    terminologyDonationLabel: '',
    terminologyDonorLabel: '',
    sacredCalendarHighlights: null,
  });
  const [faithSaving, setFaithSaving] = useState(false);
  const [faithError, setFaithError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      setLoggedIn(true);
      loadDashboard();
    }
  }, []);

  const loadDashboard = async () => {
    setPortalError('');
    const [d, l, fn, t, dm, geo, fs] = await Promise.all([
      portal.dashboard(rangeDays, {
        includeDemographics: portalFeatureFlags.refinements,
        includeGeoDistribution: portalFeatureFlags.refinements,
      }),
      portal.ledger(),
      portalFeatureFlags.refinements ? portal.functions() : Promise.resolve({ success: true, data: [] }),
      portalFeatureFlags.refinements ? portal.tasks() : Promise.resolve({ success: true, data: [] }),
      portalFeatureFlags.refinements ? portal.demographics() : Promise.resolve({ success: true, data: null }),
      portalFeatureFlags.refinements ? portal.geoDistribution() : Promise.resolve({ success: true, data: null }),
      portalFeatureFlags.faithContext
        ? portal.faithSettings()
        : Promise.resolve({
            success: true,
            data: {
              faithTradition: '',
              terminologyDonationLabel: 'Donation',
              terminologyDonorLabel: 'Donor',
              sacredCalendarHighlights: [],
            },
          }),
    ]);
    if (d.success) {
      setDashboard(d.data || null);
      setUpiIdInput(d.data?.upiId || '');
    }
    else setPortalError(d.error?.message || 'Could not load dashboard');
    if (l.success) setLedger(l.data || []);
    if (fn.success) setFunctionsList(fn.data || []);
    if (t.success) setTasksList(t.data || []);
    if (dm.success) setDemographics(dm.data || null);
    if (geo.success) setGeoData(geo.data || null);
    if (fs.success) {
      setFaithSettings({
        faithTradition: fs.data?.faithTradition || '',
        terminologyDonationLabel: fs.data?.terminologyDonationLabel || '',
        terminologyDonorLabel: fs.data?.terminologyDonorLabel || '',
        sacredCalendarHighlights: fs.data?.sacredCalendarHighlights || null,
      });
    }
  };

  useEffect(() => {
    if (!loggedIn) return;
    loadDashboard();
  }, [rangeDays]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await auth.login(email.trim(), password.trim());
    if (!res.success) {
      const code = res.error?.code;
      if (code === 'DONOR_EMAIL_AUTH_DISABLED') {
        setError(
          'That email is a donor account. Sign in on kanaksetu.com with phone OTP. Use your institution admin email and password here.'
        );
        return;
      }
      setError(res.error?.message || 'Login failed');
      return;
    }
    if (!res.data?.accessToken || !res.data?.refreshToken) {
      setError('Login response missing tokens');
      return;
    }
    setTokens(res.data.accessToken, res.data.refreshToken);
    setLoggedIn(true);
    loadDashboard();
  };

  const handleLogout = () => {
    clearTokens();
    setLoggedIn(false);
    setDashboard(null);
  };

  const handleSaveUpiId = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpiSaving(true);
    setUpiMessage('');
    const res = await portal.updateUpi(upiIdInput.trim());
    if (!res.success) {
      setUpiMessage(res.error?.message || 'Could not save UPI ID');
      setUpiSaving(false);
      return;
    }
    const savedUpiId = res.data?.upiId || '';
    setUpiIdInput(savedUpiId);
    setDashboard((prev) => (prev ? { ...prev, upiId: savedUpiId } : prev));
    setUpiMessage('UPI ID saved');
    setUpiSaving(false);
  };

  const handleCreateFunction = async (payload: { name: string; functionType: string; nextDate?: string }) => {
    const res = await portal.createFunction(payload);
    if (!res.success) return;
    const list = await portal.functions();
    if (list.success) setFunctionsList(list.data || []);
  };

  const handleCreateTask = async (payload: {
    title: string;
    taskType: string;
    functionId?: string;
    dueDate?: string;
  }) => {
    const res = await portal.createTask(payload);
    if (!res.success) return;
    const list = await portal.tasks();
    if (list.success) setTasksList(list.data || []);
  };

  const handleSaveFaithSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setFaithError('');
    setFaithSaving(true);
    const res = await portal.updateFaithSettings(faithSettings);
    if (!res.success) {
      setFaithError(res.error?.message || 'Could not save faith settings');
      setFaithSaving(false);
      return;
    }
    setFaithSaving(false);
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          <h1 className="font-serif text-2xl font-bold">Institution Login</h1>
          {error && <div className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
            <button className="w-full rounded-lg bg-amber-700 py-2.5 text-white hover:bg-amber-800">
              Sign In
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500">
            Use your institution admin email from onboarding. Donor accounts sign in on kanaksetu.com with
            phone OTP.
          </p>
          {showDevHints && (
            <p className="mt-4 text-xs text-gray-400">Dev: temple@example.com / password123</p>
          )}
        </div>
      </div>
    );
  }

  const recentDonations = dashboard?.recentDonations || [];
  const filteredRecentDonations = recentDonations.filter((d: DonationRow) => {
    const q = donationSearch.trim().toLowerCase();
    if (!q) return true;
    const donorName = [d.donor?.firstName, d.donor?.lastName].filter(Boolean).join(' ').toLowerCase();
    return (
      String(d.donationRef || '').toLowerCase().includes(q) ||
      donorName.includes(q) ||
      String(d.donor?.user?.phone || '').toLowerCase().includes(q) ||
      String(d.status || '').toLowerCase().includes(q)
    );
  });
  const donorDirectory = dashboard?.donorDirectory || [];
  const showLocationColumn = filteredRecentDonations.some((d: DonationRow) => d.donor?.city || d.donor?.state);
  const showProfessionColumn = filteredRecentDonations.some((d: DonationRow) => d.donor?.profession);
  const showAgeColumn = filteredRecentDonations.some((d: DonationRow) => calcAge(d.donor?.dateOfBirth) !== '-');
  const filteredDonors = donorDirectory.filter((d: DonorDirectoryRow) => {
    const q = donorSearch.trim().toLowerCase();
    if (!q) return true;
    return [d.firstName, d.lastName, d.email, d.phone, d.profession, d.city, d.state]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  });

  return (
    <InstitutionLayout
      institutionName={dashboard?.publicName || dashboard?.legalName || 'Institution'}
      onSignOut={handleLogout}
    >
    <div className="mx-auto max-w-6xl px-4 py-2">
      <div className="relative flex items-start justify-end">
        <div className="pointer-events-none absolute left-1/2 top-0 w-full -translate-x-1/2 text-center">
          <h1 className="font-serif text-2xl font-bold">
            {dashboard?.publicName || dashboard?.legalName || 'Institution Portal'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome, {dashboard?.publicName || dashboard?.legalName || 'Institution'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      {portalError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p>{portalError}</p>
          <button
            type="button"
            onClick={() => loadDashboard()}
            className="mt-2 text-sm font-medium text-red-900 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {dashboard && (
        <>
          {dashboard.status !== 'ACTIVE' && (
            <div
              className={`mt-4 rounded-xl border p-4 text-sm ${
                dashboard.status === 'REJECTED'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : dashboard.status === 'SUSPENDED'
                    ? 'border-orange-200 bg-orange-50 text-orange-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              {dashboard.status === 'DRAFT' && (
                <p>
                  <strong>Draft.</strong> Complete your profile and submit documents to go live for
                  donations.
                </p>
              )}
              {dashboard.status === 'SUBMITTED' && (
                <p>
                  <strong>Submitted.</strong> Our team will review your application shortly.
                </p>
              )}
              {dashboard.status === 'UNDER_REVIEW' && (
                <p>
                  <strong>Under review.</strong> You may be contacted for additional compliance
                  information.
                </p>
              )}
              {dashboard.status === 'SUSPENDED' && (
                <p>
                  <strong>Suspended.</strong> Public donations are paused until compliance clears this
                  account.
                </p>
              )}
              {dashboard.status === 'REJECTED' && (
                <p>
                  <strong>Rejected.</strong> Please contact support if you believe this is an error.
                </p>
              )}
            </div>
          )}
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${dashboard.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
            >
              {dashboard.status}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-gray-50 to-amber-50 p-2">
            {[
              { key: 'overview', label: 'Overview', count: dashboard.totalDonations || 0 },
              ...(portalFeatureFlags.refinements
                ? [
                    { key: 'functions', label: 'Spiritual Functions', count: functionsList.length || 0 },
                    { key: 'insights', label: 'Donor Insights', count: demographics?.totalDonations || 0 },
                    { key: 'geo', label: 'Geo & Reach', count: geoData?.states?.length || 0 },
                    { key: 'ops', label: 'Ops Tasks', count: tasksList.length || 0 },
                  ]
                : []),
              { key: 'donations', label: 'Recent Donations', count: recentDonations.length || 0 },
              { key: 'donors', label: 'Donor Directory', count: donorDirectory.length || 0 },
              { key: 'ledger', label: 'Gold Ledger', count: ledger.length || 0 },
              { key: 'settings', label: 'Settings', count: null },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as InstitutionTab)}
                className={`mr-2 mb-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-amber-700 text-white shadow-[0_8px_24px_rgba(180,120,20,0.28)]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                      activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <OverviewPanel dashboard={dashboard} rangeDays={rangeDays} setRangeDays={setRangeDays} />
          )}

          {activeTab === 'functions' && (
            <SpiritualFunctionsPanel items={functionsList} onCreate={handleCreateFunction} />
          )}

          {activeTab === 'insights' && <DonorInsightsPanel demographics={demographics} />}

          {activeTab === 'geo' && <GeoReachPanel geoData={geoData} />}

          {activeTab === 'ops' && (
            <OpsTasksPanel tasks={tasksList} functionsList={functionsList} onCreateTask={handleCreateTask} />
          )}

          {activeTab === 'settings' && (
            <>
              <div className="mt-4 rounded-xl border bg-white p-4">
                <h2 className="text-sm font-semibold text-gray-900">Donation UPI ID</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Set the UPI ID where donors should pay from your QR and donation links.
                </p>
                <form onSubmit={handleSaveUpiId} className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="example@upi"
                    className="w-full rounded-lg border px-3 py-2 text-sm sm:max-w-md"
                  />
                  <button
                    type="submit"
                    disabled={upiSaving}
                    className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
                  >
                    {upiSaving ? 'Saving...' : 'Save UPI'}
                  </button>
                </form>
                {upiMessage && <p className="mt-2 text-xs text-gray-600">{upiMessage}</p>}
              </div>
              {portalFeatureFlags.faithContext && (
                <div className="mt-4 rounded-xl border bg-white p-4">
                  <h2 className="text-sm font-semibold text-gray-900">Faith Context Settings</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Customize neutral, multi-faith labels and sacred calendar highlights for your institution context.
                  </p>
                  <form onSubmit={handleSaveFaithSettings} className="mt-3 grid gap-2 md:grid-cols-2">
                    <input
                      value={faithSettings.faithTradition}
                      onChange={(e) => setFaithSettings((s) => ({ ...s, faithTradition: e.target.value }))}
                      placeholder="Faith tradition (e.g., Hindu, Sikh, Islamic, Christian)"
                      className="rounded border px-3 py-2 text-sm"
                    />
                    <input
                      value={faithSettings.terminologyDonationLabel}
                      onChange={(e) =>
                        setFaithSettings((s) => ({ ...s, terminologyDonationLabel: e.target.value }))
                      }
                      placeholder="Donation label (e.g., Seva, Offering, Charity)"
                      className="rounded border px-3 py-2 text-sm"
                    />
                    <input
                      value={faithSettings.terminologyDonorLabel}
                      onChange={(e) =>
                        setFaithSettings((s) => ({ ...s, terminologyDonorLabel: e.target.value }))
                      }
                      placeholder="Donor label (e.g., Devotee, Supporter)"
                      className="rounded border px-3 py-2 text-sm"
                    />
                    <textarea
                      value={JSON.stringify(faithSettings.sacredCalendarHighlights || [], null, 0)}
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value ? JSON.parse(e.target.value) : [];
                          setFaithSettings((s) => ({ ...s, sacredCalendarHighlights: parsed }));
                        } catch {
                          // ignore invalid json while typing
                        }
                      }}
                      placeholder='Sacred calendar highlights JSON (e.g. [{"title":"Spring service week","date":"2026-10-01"}])'
                      className="min-h-24 rounded border px-3 py-2 text-sm md:col-span-2"
                    />
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        disabled={faithSaving}
                        className="rounded bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
                      >
                        {faithSaving ? 'Saving...' : 'Save Faith Settings'}
                      </button>
                    </div>
                  </form>
                  {!!(faithSettings.sacredCalendarHighlights || []).length && (
                    <div className="mt-4 rounded border border-amber-100 bg-amber-50/40 p-3">
                      <p className="text-xs font-semibold text-amber-900">Calendar Highlights Preview</p>
                      <div className="mt-2 space-y-1 text-xs text-amber-900">
                        {(faithSettings.sacredCalendarHighlights || []).slice(0, 5).map((item, idx: number) => (
                          <p key={`${item?.title || 'event'}-${idx}`}>
                            {(item?.date || 'Date TBD') as string} - {(item?.title || 'Untitled highlight') as string}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {faithError && <p className="mt-2 text-xs text-red-600">{faithError}</p>}
                </div>
              )}
              <DonationQr
                institutionId={dashboard.institutionId}
                publicName={dashboard.publicName || dashboard.legalName || 'Institution'}
                publicPageSlug={dashboard.publicPageSlug || null}
                status={dashboard.status || 'DRAFT'}
              />
            </>
          )}

          {activeTab === 'donations' && (
            <>
              <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="font-semibold text-lg">Recent Donations</h2>
                <input
                  value={donationSearch}
                  onChange={(e) => setDonationSearch(e.target.value)}
                  placeholder="Search by ref, donor, phone, status..."
                  className="w-full rounded-xl border px-3 py-2 text-sm md:w-96"
                />
              </div>
              <div className="mt-3 rounded-2xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2">Ref</th>
                      <th className="px-4 py-2">Donor</th>
                      <th className="px-4 py-2">Phone</th>
                      {showLocationColumn && <th className="px-4 py-2">Location</th>}
                      {showProfessionColumn && <th className="px-4 py-2">Profession</th>}
                      {showAgeColumn && <th className="px-4 py-2">Age</th>}
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Gold (mg)</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentDonations.map((d: DonationRow) => (
                      <tr key={d.id} className="border-t hover:bg-amber-50/30">
                        <td className="px-4 py-2 font-mono text-xs">{d.donationRef?.slice(0, 12)}</td>
                        <td className="px-4 py-2">
                          {[d.donor?.firstName, d.donor?.lastName].filter(Boolean).join(' ') || '-'}
                        </td>
                        <td className="px-4 py-2">{d.donor?.user?.phone || '-'}</td>
                        {showLocationColumn && (
                          <td className="px-4 py-2">{[d.donor?.city, d.donor?.state].filter(Boolean).join(', ') || '-'}</td>
                        )}
                        {showProfessionColumn && <td className="px-4 py-2">{d.donor?.profession || '-'}</td>}
                        {showAgeColumn && <td className="px-4 py-2">{calcAge(d.donor?.dateOfBirth)}</td>}
                        <td className="px-4 py-2">₹{(d.amountPaise / 100).toFixed(2)}</td>
                        <td className="px-4 py-2">
                          {d.goldQuantityMg ? parseFloat(d.goldQuantityMg).toFixed(2) : '-'}
                        </td>
                        <td className="px-4 py-2">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{d.status}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-400">
                          {new Date(d.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {filteredRecentDonations.length === 0 && (
                      <tr>
                        <td colSpan={7 + (showLocationColumn ? 1 : 0) + (showProfessionColumn ? 1 : 0) + (showAgeColumn ? 1 : 0)} className="px-4 py-6 text-center text-gray-400">
                          No donations match your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'donors' && (
            <>
              <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="font-semibold text-lg">Donor Directory</h2>
                <input
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  placeholder="Search donors by name, contact, profession..."
                  className="w-full rounded-xl border px-3 py-2 text-sm md:w-96"
                />
              </div>
              <div className="mt-3 rounded-2xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Profession</th>
                      <th className="px-4 py-2">Age</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Latest Donation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonors.map((d: DonorDirectoryRow) => (
                      <tr key={d.donorId} className="border-t hover:bg-indigo-50/20">
                        <td className="px-4 py-2">{[d.firstName, d.lastName].filter(Boolean).join(' ') || '-'}</td>
                        <td className="px-4 py-2">{d.email || '-'}</td>
                        <td className="px-4 py-2">{d.phone || '-'}</td>
                        <td className="px-4 py-2">{d.profession || '-'}</td>
                        <td className="px-4 py-2">{d.age ?? '-'}</td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {[d.address, d.city, d.state, d.pincode].filter(Boolean).join(', ') || '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-400">
                          {d.latestDonationAt ? new Date(d.latestDonationAt).toLocaleDateString('en-IN') : '-'}
                        </td>
                      </tr>
                    ))}
                    {filteredDonors.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                          No donor profiles match your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'ledger' && (
            <>
              <h2 className="mt-10 font-semibold text-lg">Gold Ledger</h2>
              <div className="mt-3 rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Gold (mg)</th>
                      <th className="px-4 py-2">Balance After</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((e: LedgerEntry) => (
                      <tr key={e.id} className="border-t">
                        <td className="px-4 py-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs ${e.entryType === 'CREDIT' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                          >
                            {e.entryType}
                          </span>
                        </td>
                        <td className="px-4 py-2">{parseFloat(e.goldQuantityMg).toFixed(2)}</td>
                        <td className="px-4 py-2 font-medium">{parseFloat(e.balanceAfterMg).toFixed(2)}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{e.description}</td>
                        <td className="px-4 py-2 text-gray-400">
                          {new Date(e.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {ledger.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                          No ledger entries yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
    </InstitutionLayout>
  );
}

function calcAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return '-';
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return '-';
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? String(age) : '-';
}
