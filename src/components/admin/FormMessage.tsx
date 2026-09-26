import type { FormState } from "@/app/admin/actions/state";
import { cn } from "@/lib/utils";

// Live region for the result of the last submission.
export function FormMessage({ state, className }: { state: Pick<FormState, "status" | "message">; className?: string }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "text-xs",
        state.status === "error" ? "text-rose-300" : "text-emerald-300",
        !state.message && "sr-only",
        className,
      )}
    >
      {state.message}
    </p>
  );
}
