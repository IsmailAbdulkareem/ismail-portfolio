"use client";

import { buttonClass } from "@/components/admin/button-styles";

export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-6">
      <h1 className="text-base font-semibold">Something went wrong</h1>
      <p className="mt-1 text-sm text-muted">{error.digest ? `Error ${error.digest}` : error.message}</p>
      <button type="button" onClick={() => retry()} className={buttonClass("secondary", "sm", "mt-4")}>
        Try again
      </button>
    </div>
  );
}
