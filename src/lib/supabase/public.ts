import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./env";

// Cookie-less client for public reads, so public pages can stay static.
// RLS limits it to published content.
export function createPublicClient() {
  const { url, key } = supabaseConfig();
  return createClient(url, key, { auth: { persistSession: false } });
}
