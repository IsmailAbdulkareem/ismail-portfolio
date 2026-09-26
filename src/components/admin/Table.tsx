import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-white/[0.08] bg-surface/60", className)}>
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-white/[0.08] px-4 py-2.5 font-mono text-[10px] font-normal tracking-[0.16em] text-muted uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("border-b border-white/[0.05] px-4 py-3 align-middle", className)} {...props} />;
}
