import { PROFILE } from "@/data/profile";
import { cn } from "@/lib/utils";

// Real figures from the CV only — no invented metrics.
export function Facts({ className }: { className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4", className)}>
      {PROFILE.facts.map((fact) => (
        <div key={fact.label} className="flex flex-col-reverse gap-2 bg-bg p-6 sm:p-8">
          <dt className="text-sm leading-snug text-muted">{fact.label}</dt>
          <dd className="text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-4xl">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
