import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Real server-verified auth: Supabase Auth session + a role check read from
// app_metadata (server-controlled, not user-editable) — enforced here in the
// route AND meant to be enforced again on the DB/API side (RLS policies
// checking auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') once admin pages
// read/write real Supabase tables instead of local mock data.

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function hasAdminRole(session: Session | null) {
  return session?.user?.app_metadata?.role === 'admin';
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setIsAuthenticated(hasAdminRole(data.session));
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setIsAuthenticated(hasAdminRole(session));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Chưa cấu hình Supabase trên môi trường này (thiếu VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY).' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
    }
    if (!hasAdminRole(data.session)) {
      await supabase.auth.signOut();
      return { success: false, error: 'Tài khoản này không có quyền quản trị.' };
    }
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
