import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

// Call at the top of every admin layout, page and Server Action. The proxy
// alone is not enough: Server Actions are POSTs that a matcher can miss.
// Memoized per request, so a layout and page share one auth check.
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(LOGIN_PATH);

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!admin) redirect(`${LOGIN_PATH}?error=forbidden`);

  return { supabase, userId, email: data.claims.email as string | undefined };
});
