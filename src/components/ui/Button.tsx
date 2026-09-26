import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
};

const variants = {
  primary: "bg-fg text-bg hover:bg-white/85",
  secondary:
    "border border-white/[0.12] text-fg hover:border-white/25 hover:bg-white/[0.04]",
};

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-[15px]",
};

// Shared with links that must be plain <a> elements (e.g. file downloads).
export function buttonClasses(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
  className?: string,
) {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
