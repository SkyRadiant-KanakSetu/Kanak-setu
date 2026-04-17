'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AuthPage() {
  const showDevHints = process.env.NODE_ENV !== 'production';
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'password' | 'phone'>('password');
  const [otpMode, setOtpMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, requestPhoneOtp, verifyPhoneOtp, requestSignupPhoneOtp, verifySignupPhoneOtp, register } =
    useAuth();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setHint('');
    setLoading(true);
    try {
      if (isLogin) {
        if (authMethod === 'password') {
          await login(email, password);
        } else {
          if (otpMode === 'login') {
            await verifyPhoneOtp(phone, otp);
          } else {
            await verifySignupPhoneOtp(phone, otp, firstName, lastName);
          }
        }
      } else {
        if (authMethod === 'password') {
          await register({ email, password, firstName, lastName });
        } else {
          if (otpMode === 'login') {
            await verifyPhoneOtp(phone, otp);
          } else {
            await verifySignupPhoneOtp(phone, otp, firstName, lastName);
          }
        }
      }
      router.push('/institutions');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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
      } catch (err: any) {
        const msg = err?.message || '';
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
        throw err;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gold-100 bg-white p-8 shadow-lg">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isLogin ? 'Sign in to donate gold' : 'Join Kanak Setu today'}
        </p>

        <div className="mt-4 grid grid-cols-2 rounded-lg border border-gray-200 p-1 text-sm">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setOtpSent(false);
              setOtp('');
              setHint('');
              setError('');
            }}
            className={`rounded-md px-3 py-2 ${authMethod === 'password' ? 'bg-gold-500 text-white' : 'text-gray-600'}`}
          >
            {isLogin ? 'Email Login' : 'Email Signup'}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setOtpSent(false);
              setOtp('');
              setHint('');
              setError('');
            }}
            className={`rounded-md px-3 py-2 ${authMethod === 'phone' ? 'bg-gold-500 text-white' : 'text-gray-600'}`}
          >
            Continue with Phone
          </button>
        </div>

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
          {authMethod === 'password' && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
              />
            </>
          )}

          {authMethod === 'phone' && (
            <>
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
                  className="w-full rounded-lg border border-gold-500 py-2.5 font-semibold text-gold-700 hover:bg-gold-50 disabled:opacity-50 transition"
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                </button>
              ) : (
                <>
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
                    className="text-sm text-gold-700 hover:underline"
                  >
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </>
              )}
            </>
          )}
              {otpSent && otpExpiresIn > 0 && (
                <div className="text-xs text-gray-500">OTP expires in {formatSeconds(otpExpiresIn)}</div>
              )}
          <button
            type="submit"
            disabled={
              loading ||
              (authMethod === 'phone' && !otpSent)
            }
            className="w-full rounded-lg bg-gold-500 py-2.5 font-semibold text-white hover:bg-gold-600 disabled:opacity-50 transition"
          >
            {loading
              ? 'Please wait...'
              : authMethod === 'phone'
                ? otpMode === 'login'
                  ? 'Verify & Sign In'
                  : 'Verify & Create Account'
                : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
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
            <strong>Dev credentials:</strong> donor@example.com / password123
            {devOtp && (
              <div className="mt-1">
                <strong>Dev OTP:</strong> {devOtp}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
