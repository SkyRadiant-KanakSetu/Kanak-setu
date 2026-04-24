'use client';
import { useState, useEffect } from 'react';
import { auth, portal, setTokens, clearTokens } from '@/lib/api';
import { DonationQr } from '@/components/DonationQr';

type InstitutionTab = 'overview' | 'donations' | 'donors' | 'ledger' | 'settings';

export default function InstitutionHome() {
  const showDevHints = process.env.NODE_ENV !== 'production';
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [portalError, setPortalError] = useState('');
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(30);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiSaving, setUpiSaving] = useState(false);
  const [upiMessage, setUpiMessage] = useState('');
  const [activeTab, setActiveTab] = useState<InstitutionTab>('overview');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      setLoggedIn(true);
      loadDashboard();
    }
  }, []);

  const loadDashboard = async () => {
    setPortalError('');
    const [d, l] = await Promise.all([portal.dashboard(rangeDays), portal.ledger()]);
    if (d.success) {
      setDashboard(d.data);
      setUpiIdInput(d.data?.upiId || '');
    }
    else setPortalError(d.error?.message || 'Could not load dashboard');
    if (l.success) setLedger(l.data || []);
  };

  useEffect(() => {
    if (!loggedIn) return;
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setDashboard((prev: any) => (prev ? { ...prev, upiId: savedUpiId } : prev));
    setUpiMessage('UPI ID saved');
    setUpiSaving(false);
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
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

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'donations', label: 'Recent Donations' },
              { key: 'donors', label: 'Donor Directory' },
              { key: 'ledger', label: 'Gold Ledger' },
              { key: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as InstitutionTab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  activeTab === tab.key ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">Total Donations</p>
                  <p className="mt-1 text-2xl font-bold">{dashboard.totalDonations}</p>
                </div>
                <div className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">Total Gold (mg)</p>
                  <p className="mt-1 text-2xl font-bold text-amber-700">
                    {parseFloat(dashboard.totalGoldMg || 0).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">Total Gold (grams)</p>
                  <p className="mt-1 text-2xl font-bold text-amber-700">
                    {(parseFloat(dashboard.totalGoldMg || 0) / 1000).toFixed(4)}
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">Unique Donors</p>
                  <p className="mt-1 text-2xl font-bold">{dashboard.uniqueDonors ?? 0}</p>
                </div>
                <div className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">Repeat Donors</p>
                  <p className="mt-1 text-2xl font-bold">{dashboard.repeatDonors ?? 0}</p>
                </div>
                <div className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">Active Donors ({dashboard.rangeDays ?? 30}d)</p>
                  <p className="mt-1 text-2xl font-bold">{dashboard.activeDonorsInRange ?? 0}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setRangeDays(d as 7 | 30 | 90)}
                    className={`rounded px-3 py-1 text-xs ${rangeDays === d ? 'bg-amber-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl border bg-white p-4">
                <p className="text-xs text-gray-500">Donor trend ({dashboard.rangeDays}d)</p>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <MiniTrend
                    title="Donations / day"
                    values={(dashboard.donorTrend || []).map((d: any) => d.donations)}
                  />
                  <MiniTrend
                    title="Active donors / day"
                    values={(dashboard.donorTrend || []).map((d: any) => d.activeDonors)}
                  />
                </div>
              </div>
            </>
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
              <DonationQr
                institutionId={dashboard.institutionId}
                publicName={dashboard.publicName}
                publicPageSlug={dashboard.publicPageSlug}
                status={dashboard.status}
              />
            </>
          )}

          {activeTab === 'donations' && (
            <>
              <h2 className="mt-10 font-semibold text-lg">Recent Donations</h2>
              <div className="mt-3 rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2">Ref</th>
                      <th className="px-4 py-2">Donor</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Profession</th>
                      <th className="px-4 py-2">Age</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Gold (mg)</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard.recentDonations || []).map((d: any) => (
                      <tr key={d.id} className="border-t">
                        <td className="px-4 py-2 font-mono text-xs">{d.donationRef?.slice(0, 12)}</td>
                        <td className="px-4 py-2">
                          {[d.donor?.firstName, d.donor?.lastName].filter(Boolean).join(' ') || '-'}
                        </td>
                        <td className="px-4 py-2">{d.donor?.user?.phone || '-'}</td>
                        <td className="px-4 py-2">
                          {[d.donor?.city, d.donor?.state].filter(Boolean).join(', ') || '-'}
                        </td>
                        <td className="px-4 py-2">{d.donor?.profession || '-'}</td>
                        <td className="px-4 py-2">{calcAge(d.donor?.dateOfBirth)}</td>
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
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'donors' && (
            <>
              <h2 className="mt-10 font-semibold text-lg">Donor Directory</h2>
              <div className="mt-3 rounded-xl border bg-white overflow-hidden">
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
                    {(dashboard.donorDirectory || []).map((d: any) => (
                      <tr key={d.donorId} className="border-t">
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
                    {(dashboard.donorDirectory || []).length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                          No donor profiles available yet
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
                    {ledger.map((e: any) => (
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
