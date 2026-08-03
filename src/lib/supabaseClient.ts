import { createClient } from '@supabase/supabase-js';

// Deliberately does NOT throw at module load if these are missing: this module is
// imported (transitively, via AdminAuthContext) from main.tsx's static import graph,
// which the whole site bundle evaluates on every page load — a thrown error here would
// take down the entire public storefront, not just the admin route, if the Netlify
// build environment is ever missing these two vars. Falling back to a clearly-invalid
// placeholder means only admin login fails (with an auth error), not the homepage.
//
// sanitizeEnvValue strips anything a browser Headers/fetch call can't encode (only
// ISO-8859-1 / Latin-1 code points, 0x00-0xFF, are legal HTTP header bytes) plus
// leading/trailing whitespace. This exists because a Vercel env var edited/pasted
// through the dashboard UI repeatedly ended up with an invisible non-Latin1 character
// baked into VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_URL, which made supabase-js's
// internal `new Headers(...)` throw `Failed to read the 'headers' property from
// 'RequestInit': String contains non ISO-8859-1 code point` on every single request —
// crashing the entire admin app before it could even render, and never reaching
// Supabase's servers (so its logs showed nothing). Re-pasting the value through the
// Vercel UI did not reliably fix this across multiple attempts, so the value is now
// cleaned defensively here instead of trusting the env var to already be clean.
function sanitizeEnvValue(raw: string | undefined): string {
  if (!raw) return '';
  return raw.replace(/[^\x00-\xFF]/g, '').trim();
}

const rawUrl = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_URL);
const rawAnonKey = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(rawUrl && rawAnonKey && isValidHttpUrl(rawUrl));

if ((import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_ANON_KEY) && !isSupabaseConfigured) {
  // Something is set but unusable after sanitizing — surface it loudly in the console
  // instead of a silent crash, so this is diagnosable from a bug report alone.
  console.error(
    '[supabaseClient] VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set but invalid after sanitizing.',
    { urlLength: rawUrl.length, anonKeyLength: rawAnonKey.length, urlValid: isValidHttpUrl(rawUrl) }
  );
}

const url = isValidHttpUrl(rawUrl) ? rawUrl : 'https://misconfigured.invalid';
const anonKey = rawAnonKey || 'missing-anon-key';

export const supabase = createClient(url, anonKey);
