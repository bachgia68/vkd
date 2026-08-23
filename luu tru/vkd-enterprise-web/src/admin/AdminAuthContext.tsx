import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * DEMO-ONLY GATE. This checks a hardcoded password entirely in the browser and
 * flips a sessionStorage flag — it ships inside the public JS bundle, so anyone
 * can read the password from devtools or view-source. It stops casual visitors
 * from stumbling into /gate-vkd-control-2026, it does NOT stop a motivated
 * person. Before real internal/customer data ever flows through these admin
 * pages, replace this with server-verified auth (e.g. Supabase Auth session +
 * a role check enforced on the API/DB side, not just in the React route).
 */
const DEMO_PASSWORD = 'VKD@NgocLinh2026';
const SESSION_KEY = 'vkd_admin_session';

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  const login = (password: string) => {
    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
