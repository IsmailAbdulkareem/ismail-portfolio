import { cn } from "@/lib/utils";

export function TechList({ technologies, className }: { technologies: string[]; className?: string }) {
  if (technologies.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {technologies.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-white/[0.08] px-3 py-1 font-mono text-[11px] tracking-wide text-muted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
