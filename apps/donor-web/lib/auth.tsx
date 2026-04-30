'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth as authApi, setTokens, clearTokens, donors } from './api';
import type { DonorProfileData, OtpResponseData } from './api';

interface User {
  id: string;
  email: string;
  role: string;
}
interface DonorProfile {
  userId: string;
  firstName: string;
  lastName: string;
  kycStatus: string;
  user?: { email?: string };
}

interface AuthCtx {
  user: User | null;
  profile: DonorProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  requestPhoneOtp: (phone: string) => Promise<{ devOtp?: string; expiresInSeconds?: number }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<void>;
  requestSignupPhoneOtp: (phone: string) => Promise<{ devOtp?: string; expiresInSeconds?: number }>;
  verifySignupPhoneOtp: (
    phone: string,
    otp: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

function toApiError(error: { code?: string; message?: string } | undefined, fallback: string) {
  const err = new Error(error?.message || fallback) as Error & { code?: string };
  if (error?.code) err.code = error.code;
  return err;
}

function profileToUser(profile: DonorProfileData): User {
  return {
    id: profile.userId,
    email: profile.user?.email || '',
    role: 'DONOR',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      donors
        .me()
        .then((res) => {
          if (res.success && res.data) {
            setProfile(res.data);
            setUser(profileToUser(res.data));
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (!res.success) throw toApiError(res.error, 'Login failed');
    if (!res.data) throw new Error('Login response missing data');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success && p.data) setProfile(p.data);
  };

  const requestPhoneOtp = async (phone: string) => {
    const res = await authApi.requestPhoneOtp(phone);
    if (!res.success) throw toApiError(res.error, 'Failed to send OTP');
    const data: OtpResponseData = res.data || {};
    return { devOtp: data.devOtp, expiresInSeconds: data.expiresInSeconds };
  };

  const verifyPhoneOtp = async (phone: string, otp: string) => {
    const res = await authApi.verifyPhoneOtp(phone, otp);
    if (!res.success) throw toApiError(res.error, 'OTP verification failed');
    if (!res.data) throw new Error('OTP verification response missing data');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success && p.data) setProfile(p.data);
  };

  const requestSignupPhoneOtp = async (phone: string) => {
    const res = await authApi.requestSignupPhoneOtp(phone);
    if (!res.success) throw toApiError(res.error, 'Failed to send OTP');
    const data: OtpResponseData = res.data || {};
    return { devOtp: data.devOtp, expiresInSeconds: data.expiresInSeconds };
  };

  const verifySignupPhoneOtp = async (
    phone: string,
    otp: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await authApi.verifySignupPhoneOtp(phone, otp, firstName, lastName);
    if (!res.success) throw toApiError(res.error, 'OTP verification failed');
    if (!res.data) throw new Error('Signup OTP verification response missing data');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success && p.data) setProfile(p.data);
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const res = await authApi.register(data);
    if (!res.success) throw toApiError(res.error, 'Registration failed');
    if (!res.data) throw new Error('Registration response missing data');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success && p.data) setProfile(p.data);
  };

  const logout = () => {
    authApi.logout();
    clearTokens();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        requestPhoneOtp,
        verifyPhoneOtp,
        requestSignupPhoneOtp,
        verifySignupPhoneOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
