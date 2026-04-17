'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth as authApi, setTokens, clearTokens, donors } from './api';

interface User {
  id: string;
  email: string;
  role: string;
}
interface DonorProfile {
  firstName: string;
  lastName: string;
  kycStatus: string;
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
            setProfile(res.data as any);
            setUser({ id: res.data.userId, email: (res.data as any).user?.email, role: 'DONOR' });
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (!res.success) throw new Error(res.error?.message || 'Login failed');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success) setProfile(p.data as any);
  };

  const requestPhoneOtp = async (phone: string) => {
    const res = await authApi.requestPhoneOtp(phone);
    if (!res.success) throw new Error(res.error?.message || 'Failed to send OTP');
    return {
      devOtp: (res.data as { devOtp?: string })?.devOtp,
      expiresInSeconds: (res.data as { expiresInSeconds?: number })?.expiresInSeconds,
    };
  };

  const verifyPhoneOtp = async (phone: string, otp: string) => {
    const res = await authApi.verifyPhoneOtp(phone, otp);
    if (!res.success) throw new Error(res.error?.message || 'OTP verification failed');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success) setProfile(p.data as any);
  };

  const requestSignupPhoneOtp = async (phone: string) => {
    const res = await authApi.requestSignupPhoneOtp(phone);
    if (!res.success) throw new Error(res.error?.message || 'Failed to send OTP');
    return {
      devOtp: (res.data as { devOtp?: string })?.devOtp,
      expiresInSeconds: (res.data as { expiresInSeconds?: number })?.expiresInSeconds,
    };
  };

  const verifySignupPhoneOtp = async (
    phone: string,
    otp: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await authApi.verifySignupPhoneOtp(phone, otp, firstName, lastName);
    if (!res.success) throw new Error(res.error?.message || 'OTP verification failed');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success) setProfile(p.data as any);
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const res = await authApi.register(data);
    if (!res.success) throw new Error(res.error?.message || 'Registration failed');
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
    const p = await donors.me();
    if (p.success) setProfile(p.data as any);
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
