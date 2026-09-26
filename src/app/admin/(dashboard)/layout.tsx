import Link from "next/link";
import { signOut } from "@/app/admin/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { buttonClass } from "@/components/admin/button-styles";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[13.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 z-20 border-b border-white/[0.08] bg-bg/90 backdrop-blur md:flex md:h-dvh md:flex-col md:border-r md:border-b-0 md:bg-surface/40">
        <div className="flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">
          <Link
            href="/admin"
            className="font-mono text-[11px] tracking-[0.22em] text-fg uppercase focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none"
          >
            Ismail<span className="text-accent">/</span>admin
          </Link>
          <div className="flex items-center gap-1 md:hidden">
            <a href="/" target="_blank" rel="noreferrer" className={buttonClass("ghost", "sm")}>
              View site ↗
            </a>
            <form action={signOut}>
              <button type="submit" className={buttonClass("ghost", "sm")}>
                Sign out
              </button>
            </form>
          </div>
        </div>

        <AdminNav />

        <div className="mt-auto hidden border-t border-white/[0.06] p-3 md:grid md:gap-0.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 items-center rounded-lg px-3 text-sm text-muted transition-colors hover:bg-white/[0.04] hover:text-fg"
          >
            View site ↗
          </a>
          <form action={signOut}>
            <button
              type="submit"
              className="flex h-8 w-full items-center rounded-lg px-3 text-left text-sm text-muted transition-colors hover:bg-white/[0.04] hover:text-fg"
            >
              Sign out
            </button>
          </form>
          {email ? (
            <p className="truncate px-3 pt-2 font-mono text-[10px] text-muted/70" title={email}>
              {email}
            </p>
          ) : null}
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
