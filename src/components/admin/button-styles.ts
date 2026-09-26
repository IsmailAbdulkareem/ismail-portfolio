import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-fg text-bg hover:bg-white/85",
  secondary: "border border-white/[0.12] text-fg hover:border-white/25 hover:bg-white/[0.04]",
  ghost: "text-muted hover:bg-white/[0.05] hover:text-fg",
  danger: "border border-rose-500/30 text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
};

// Shared by <button>s and button-styled <Link>s.
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors",
    "focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}
