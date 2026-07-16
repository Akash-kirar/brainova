import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && supabaseUrl.startsWith('http') && Boolean(supabasePublishableKey);

export const supabaseConfigError =
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.';

let client: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e) {
    console.warn('Invalid supabaseUrl provided:', e);
  }
}

export const supabase = client;
