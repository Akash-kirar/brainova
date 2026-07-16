import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if the URL and key are provided and the URL is valid
let client = null;
if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn("Invalid supabaseUrl provided:", e);
  }
}

export const supabase = client;
