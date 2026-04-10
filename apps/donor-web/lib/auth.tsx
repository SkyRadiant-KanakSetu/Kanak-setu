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
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
