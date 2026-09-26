import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "./env";

export const LOGIN_PATH = "/admin/login";

// Refreshes the auth session cookie and keeps signed-out visitors out of /admin.
export async function updateSession(request: NextRequest) {
  const { url, key } = supabaseConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // Nothing may run between createServerClient and getClaims.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && request.nextUrl.pathname !== LOGIN_PATH) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
