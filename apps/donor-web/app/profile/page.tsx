'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { donors } from '@/lib/api';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    pan: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth');
      return;
    }
    donors.me().then((res) => {
      if (res.success && res.data) {
        setProfile(res.data);
        setForm({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          pan: res.data.pan || '',
          address: res.data.address || '',
          city: res.data.city || '',
          state: res.data.state || '',
          pincode: res.data.pincode || '',
        });
      }
    });
  }, [user, authLoading, router]);

  const handleSave = async () => {
    const res = await donors.update(form);
    if (res.success) {
      setProfile(res.data);
      setEditing(false);
    }
  };

  if (!profile) return <div className="py-16 text-center text-gray-400">Loading...</div>;

  const kycColor: Record<string, string> = {
    VERIFIED: 'bg-green-50 text-green-700',
    UNVERIFIED: 'bg-yellow-50 text-yellow-700',
    BASIC: 'bg-blue-50 text-blue-700',
    FLAGGED: 'bg-red-50 text-red-700',
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${kycColor[profile.kycStatus] || 'bg-gray-50 text-gray-600'}`}
        >
          KYC: {profile.kycStatus}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 space-y-4">
        {editing ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="First Name"
                className="rounded-lg border px-3 py-2 text-sm"
              />
              <input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Last Name"
                className="rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <input
              value={form.pan}
              onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value }))}
              placeholder="PAN"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Address"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="City"
                className="rounded-lg border px-3 py-2 text-sm"
              />
              <input
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="State"
                className="rounded-lg border px-3 py-2 text-sm"
              />
              <input
                value={form.pincode}
                onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                placeholder="Pincode"
                className="rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="rounded-lg bg-gold-500 px-4 py-2 text-sm text-white hover:bg-gold-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm space-y-2">
              <p>
                <span className="text-gray-400">Name:</span> {profile.firstName} {profile.lastName}
              </p>
              <p>
                <span className="text-gray-400">Email:</span> {profile.user?.email}
              </p>
              {profile.pan && (
                <p>
                  <span className="text-gray-400">PAN:</span> {profile.pan}
                </p>
              )}
              {profile.city && (
                <p>
                  <span className="text-gray-400">Location:</span> {profile.city}, {profile.state}{' '}
                  {profile.pincode}
                </p>
              )}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-gold-300 px-4 py-2 text-sm text-gold-700 hover:bg-gold-50"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
