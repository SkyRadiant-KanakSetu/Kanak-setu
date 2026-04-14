'use client';
import { useState, useEffect } from 'react';
import { auth, portal, setTokens, clearTokens } from '@/lib/api';

export default function InstitutionHome() {
  const showDevHints = process.env.NODE_ENV !== 'production';
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      setLoggedIn(true);
      loadDashboard();
    }
  }, []);

  const loadDashboard = async () => {
    const [d, l] = await Promise.all([portal.dashboard(), portal.ledger()]);
    if (d.success) setDashboard(d.data);
    if (l.success) setLedger(l.data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await auth.login(email, password);
    if (!res.success) {
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
          </div>

          {/* Recent donations */}
          <h2 className="mt-10 font-semibold text-lg">Recent Donations</h2>
          <div className="mt-3 rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-2">Ref</th>
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

          {/* Ledger */}
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
                    <td className="px-4 py-2 font-medium">
                      {parseFloat(e.balanceAfterMg).toFixed(2)}
                    </td>
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
    </div>
  );
}
