'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

type UiError = Error & { code?: string };

function AuthContent() {
  const showDevHints = process.env.NODE_ENV !== 'production';
  const [isLogin, setIsLogin] = useState(true);
  const [otpMode, setOtpMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestPhoneOtp, verifyPhoneOtp, requestSignupPhoneOtp, verifySignupPhoneOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/institutions';

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!otpSent || otpExpiresIn <= 0) return;
    const timer = window.setInterval(() => {
      setOtpExpiresIn((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpSent, otpExpiresIn]);

  useEffect(() => {
    if (!otpSent || otpExpiresIn > 0) return;
    setOtpSent(false);
    setOtp('');
    setHint('OTP expired. Please request a new OTP.');
  }, [otpSent, otpExpiresIn]);

  function formatSeconds(total: number) {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function maskPhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    return `${'*'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
  }

  async function copyOtp() {
    if (!devOtp) return;
    try {
      await navigator.clipboard.writeText(devOtp);
      setCopiedOtp(true);
      window.setTimeout(() => setCopiedOtp(false), 1500);
    } catch {
      // ignore clipboard failure
    }
  }

  function resolveReturnPath(path: string) {
    // Prevent open redirects and allow only in-app routes.
    if (!path.startsWith('/')) return '/institutions';
    if (path.startsWith('//')) return '/institutions';
    return path;
  }

  function getOtpRequestErrorMessage(err: UiError) {
    const code = err?.code;
    const message = String(err?.message || '');
    if (code === 'DONOR_NOT_FOUND' || message.includes('No active donor account found for phone')) {
      return 'No donor account found for this number. Use Sign up to create an account first.';
    }
    if (code === 'UNEXPECTED_ERROR' || message.toLowerCase().includes('unexpected error')) {
      return 'Could not send OTP right now. Please try again in a few seconds.';
    }
    return message || 'Failed to send OTP';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setHint('');
    setLoading(true);
    try {
      if (otpMode === 'login') {
        await verifyPhoneOtp(phone, otp);
      } else {
        await verifySignupPhoneOtp(phone, otp, firstName, lastName);
      }
      router.push(resolveReturnPath(returnTo));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithPhone = async () => {
    setError('');
    setHint('');
    setLoading(true);
    try {
      try {
        const resp = await requestPhoneOtp(phone);
        setOtpSent(true);
        setOtpMode('login');
        setHint(`OTP sent to ${maskPhone(phone)}. Existing donor found, enter OTP to sign in.`);
        setDevOtp(resp.devOtp || '');
        setResendCooldown(30);
        setOtpExpiresIn(resp.expiresInSeconds || 300);
      } catch (err: unknown) {
        const knownErr = err as UiError;
        const msg = knownErr?.message || '';
        if (msg.includes('No active donor account found for phone')) {
          const resp = await requestSignupPhoneOtp(phone);
          setOtpSent(true);
          setOtpMode('signup');
          setHint(
            `OTP sent to ${maskPhone(phone)}. New donor flow detected, enter OTP and your name to create account.`
          );
          setDevOtp(resp.devOtp || '');
          setResendCooldown(30);
          setOtpExpiresIn(resp.expiresInSeconds || 300);
          return;
        }
        throw knownErr;
      }
    } catch (err: unknown) {
      setError(getOtpRequestErrorMessage(err as UiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-gold-100 bg-white p-8 shadow-lg">
        <div className="mb-4 inline-flex rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
          Secure OTP Authentication
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isLogin ? 'Sign in with phone OTP to donate gold' : 'Create account with phone OTP'}
        </p>

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {hint && <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{hint}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              />
            </div>
          )}
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
          />
          {phone.trim() && (
            <div className="text-xs text-gray-500">OTP will be sent to {maskPhone(phone)}</div>
          )}

          {!otpSent ? (
            <button
              type="button"
              onClick={handleContinueWithPhone}
              disabled={loading || !phone.trim()}
              className="w-full rounded-xl border border-gold-500 py-2.5 font-semibold text-gold-700 transition hover:bg-gold-50 disabled:opacity-50"
            >
              {loading ? 'Getting OTP...' : 'Get OTP'}
            </button>
          ) : (
            <>
              {devOtp && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  <div className="flex items-center justify-between">
                    <span>
                      OTP: <strong>{devOtp}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={copyOtp}
                      className="text-xs font-medium text-emerald-700 hover:underline"
                    >
                      {copiedOtp ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              {otpMode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
                  />
                </div>
              )}
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleContinueWithPhone}
                disabled={loading || resendCooldown > 0}
                className="text-sm font-medium text-gold-700 hover:underline"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </>
          )}
          {otpSent && otpExpiresIn > 0 && (
            <div className="text-xs text-gray-500">OTP expires in {formatSeconds(otpExpiresIn)}</div>
          )}
          <button
            type="submit"
            disabled={loading || !otpSent}
            className="w-full rounded-xl bg-gold-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-gold-700 disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : otpMode === 'login'
                ? 'Verify & Sign In'
                : 'Verify & Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setHint('');
              setOtpSent(false);
              setOtp('');
              setDevOtp('');
            }}
            className="font-medium text-gold-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {showDevHints && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-400">
            OTP-based donor login enabled.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
