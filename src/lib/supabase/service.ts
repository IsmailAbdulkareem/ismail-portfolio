import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./env";

// Secret-key client that bypasses RLS. Only for trusted server code: public
// inserts (leads, chat transcripts) that have already been validated.
export function createServiceClient() {
  const { url } = supabaseConfig();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("SUPABASE_SECRET_KEY is not set in .env.local");
  return createClient(url, secret, { auth: { persistSession: false } });
}
