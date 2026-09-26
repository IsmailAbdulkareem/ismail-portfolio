import { cn } from "@/lib/utils";

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={cn("size-3.5", className)}>
      <path
        d="M5 11 11 5m0 0H6m5 0v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
