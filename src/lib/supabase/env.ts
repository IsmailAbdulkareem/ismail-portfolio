// NEXT_PUBLIC_* must be referenced literally so Next can inline them in the browser bundle.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function supabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local",
    );
  }
  return { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
}
