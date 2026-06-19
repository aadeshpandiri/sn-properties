import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
);

function createSupabaseClient(url, key) {
  try {
    return createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn('[supabase] createClient failed:', err.message);
    return null;
  }
}

export const supabase = isSupabaseConfigured
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseServer =
  isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;
