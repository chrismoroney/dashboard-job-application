import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Check .env.local.");
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

/**
 * Note: ensure the storage bucket defined in NEXT_PUBLIC_SUPABASE_BUCKET exists
 * in the Supabase project (e.g., "materials"). The upload flow will fail with
 * "Bucket not found" otherwise.
 */
