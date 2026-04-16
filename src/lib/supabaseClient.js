import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This client will be used for all Auth and Database queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey)