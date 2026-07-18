import { createClient } from '@supabase/supabase-js';

// Deliberately does NOT throw at module load if these are missing: this module is
// imported (transitively, via AdminAuthContext) from main.tsx's static import graph,
// which the whole site bundle evaluates on every page load — a thrown error here would
// take down the entire public storefront, not just the admin route, if the Netlify
// build environment is ever missing these two vars. Falling back to a clearly-invalid
// placeholder means only admin login fails (with an auth error), not the homepage.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://misconfigured.invalid';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(url, anonKey);
