"use server";

import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";
import type { LoginState } from "./state";

const INVALID = "Invalid email or password.";

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  if (!email || !password) return { error: "Enter your email and password.", email };
  if (email.length > 320 || password.length > 1024) return { error: INVALID, email };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: INVALID, email };

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account is not an admin.", email };
  }

  redirect("/admin");
}

// Deliberately not gated by requireAdmin(): a signed-in non-admin (sent to
// /admin/login?error=forbidden) must be able to sign out too.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
