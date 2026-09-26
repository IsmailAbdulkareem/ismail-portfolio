import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  className?: string;
  // Atmospheric background layer rendered behind the content.
  backdrop?: ReactNode;
  children: ReactNode;
};

export function Section({ id, className, backdrop, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative isolate scroll-mt-24 py-24 sm:py-32", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Hidden on a page's first section, where it would sit under the navbar. */}
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-5xl [main>section:first-child_&]:hidden bg-linear-to-r from-transparent via-white/10 to-transparent" />
        {backdrop}
      </div>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">{children}</div>
    </section>
  );
}
