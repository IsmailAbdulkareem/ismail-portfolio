import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the admin area needs sessions; public pages stay static.
export const config = {
  matcher: ["/admin/:path*"],
};
