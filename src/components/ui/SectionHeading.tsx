import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
  // Page titles render as h1; sections within a page stay h2.
  as?: "h1" | "h2";
};

// Same eyebrow + uppercase heading language as the Hero, one step smaller.
export function SectionHeading({
  label,
  title,
  description,
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-accent/90 uppercase sm:tracking-[0.28em]">
        <span className="h-px w-8 bg-accent/60" />
        {label}
      </p>
      <Heading className="mt-6 text-3xl leading-[1.05] font-semibold tracking-[-0.03em] uppercase sm:text-4xl lg:text-5xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
