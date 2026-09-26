import "server-only";
import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import type { SkillGroup } from "@/lib/types";

// Server-only lookup: only the resolved SVG path reaches the HTML, never the icon set.
const ICONS = icons as unknown as Record<string, SimpleIcon | undefined>;

function iconFor(slug: string | null) {
  if (!slug) return undefined;
  return ICONS[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
}

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="rounded-3xl border border-white/[0.08] bg-surface/60 p-6 transition-colors duration-300 hover:border-white/[0.14]"
        >
          <h3 className="font-mono text-[11px] tracking-[0.24em] text-muted uppercase">
            {group.category}
          </h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {group.skills.map((skill) => {
              const icon = iconFor(skill.icon_slug);
              return (
                <li
                  key={skill.id}
                  className="group/skill flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5 text-[13px] text-fg/80 transition-colors duration-300 hover:border-accent/40 hover:text-fg"
                >
                  {icon ? (
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-3.5 text-muted transition-colors duration-300 group-hover/skill:text-accent"
                    >
                      <path d={icon.path} />
                    </svg>
                  ) : (
                    <span
                      aria-hidden
                      className="size-1.5 rotate-45 bg-muted transition-colors duration-300 group-hover/skill:bg-accent"
                    />
                  )}
                  {skill.name}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
