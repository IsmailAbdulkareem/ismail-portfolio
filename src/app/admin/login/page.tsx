import type { Metadata } from "next";
import { signOut } from "@/app/admin/actions/auth";
import { buttonClass } from "@/components/admin/button-styles";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string | string[] }> }) {
  const { error } = await searchParams;
  const forbidden = error === "forbidden";

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
          Ismail<span className="text-accent">/</span>admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Dashboard access for site admins.</p>

        <div className="mt-8 rounded-xl border border-white/[0.08] bg-surface/60 p-5">
          <LoginForm initialError={forbidden ? "This account is not an admin." : undefined} />
        </div>

        {forbidden ? (
          <form action={signOut} className="mt-4 text-center">
            <button type="submit" className={buttonClass("ghost", "sm")}>
              Sign out of the current account
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
