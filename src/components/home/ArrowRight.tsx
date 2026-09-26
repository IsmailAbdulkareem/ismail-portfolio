import { cn } from "@/lib/utils";

// Same arrow as the Hero's primary button; nudges right on group hover.
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "size-4 transition-transform duration-300 group-hover:translate-x-0.5",
        className,
      )}
    >
      <path
        d="M3 8h10m0 0L9 4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
