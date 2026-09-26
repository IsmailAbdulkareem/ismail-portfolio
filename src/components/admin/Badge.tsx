import type { ReactNode } from "react";
import type { LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export type BadgeTone = "accent" | "success" | "warning" | "neutral" | "dim";

const tones: Record<BadgeTone, string> = {
  accent: "border-accent/30 bg-accent/[0.08] text-accent",
  success: "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300",
  warning: "border-amber-400/25 bg-amber-400/[0.07] text-amber-300",
  neutral: "border-white/[0.12] text-fg/75",
  dim: "border-white/[0.06] text-muted",
};

export const LEAD_STATUS_TONE: Record<LeadStatus, BadgeTone> = {
  new: "accent",
  read: "neutral",
  replied: "success",
  archived: "dim",
};

export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
