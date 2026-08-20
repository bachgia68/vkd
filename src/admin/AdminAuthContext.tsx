import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Real server-verified auth: Supabase Auth session + a role check read from
// app_metadata (server-controlled, not user-editable) — enforced here in the
// route AND meant to be enforced again on the DB/API side (RLS policies
// checking auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') once admin pages
// read/write real Supabase tables instead of local mock data.

export type UserRole = 'owner' | 'editor' | 'viewer';

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function hasAdminRole(session: Session | null) {
  return session?.user?.app_metadata?.role === 'admin';
}

function getRoleFromSession(session: Session | null): UserRole {
  return (session?.user?.app_metadata?.role as UserRole) || 'viewer';
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const isAdmin = hasAdminRole(data.session);
      setIsAuthenticated(isAdmin);
      setRole(isAdmin ? getRoleFromSession(data.session) : null);
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      const isAdmin = hasAdminRole(session);
      setIsAuthenticated(isAdmin);
      setRole(isAdmin ? getRoleFromSession(session) : null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Chưa cấu hình Supabase trên môi trường này (thiếu VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY).' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Chỉ báo "sai email/mật khẩu" khi Supabase THẬT SỰ xác nhận sai (status 400).
      // Mọi lỗi khác (mất mạng, bị chặn bởi extension/firewall, CORS, rate limit...)
      // hiện nguyên message gốc — trước đây gộp chung hết vào 1 câu chung chung khiến
      // không thể phân biệt "sai mật khẩu" với "request không tới được Supabase".
      const error_ = error as { status?: number; message?: string };
      const msg =
        error_.status === 400
          ? 'Email hoặc mật khẩu không đúng.'
          : `Không đăng nhập được (${error_.message ?? 'lỗi không xác định'}). Có thể do mất mạng, VPN/firewall, hoặc trình duyệt chặn kết nối tới Supabase — thử mạng khác hoặc tắt tiện ích chặn quảng cáo.`;
      return { success: false, error: msg };
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
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, role, isOwner: role === 'owner', login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
