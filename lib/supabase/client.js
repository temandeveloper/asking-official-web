import { createBrowserClient } from "@supabase/ssr";

let supabaseClient = null;

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    url.startsWith("http") &&
    !url.includes("your-project-id") &&
    !key.includes("your-anon-key")
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  if (!supabaseClient) {
    supabaseClient = createBrowserClient(url, key);
  }

  return supabaseClient;
}
