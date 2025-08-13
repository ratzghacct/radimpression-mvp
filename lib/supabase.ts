import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Only throw error in production if env vars are missing
if (
  process.env.NODE_ENV === "production" &&
  (supabaseUrl === "https://placeholder.supabase.co" || supabaseAnonKey === "placeholder-key")
) {
  console.warn("Missing Supabase environment variables in production")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
