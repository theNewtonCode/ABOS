import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string

// Public read-only client (anon key)
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
)

// Admin client (service role key) — only used in admin pages, never in portfolio
// Safe locally because .env.local is gitignored.
// On Vercel, do NOT set VITE_SUPABASE_SERVICE_ROLE_KEY — writes go through /api/* instead.
export const supabaseAdmin = createClient(
  url || 'https://placeholder.supabase.co',
  serviceKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export const isDev = !!serviceKey
