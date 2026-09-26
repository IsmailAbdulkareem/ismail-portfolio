import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import type { Project } from "@/lib/types";

export const linkClass =
  "group/link inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent";

// "host/path" label for the browser frame; falls back to the raw value if it isn't a URL.
export function displayHost(url: string) {
  try {
    const { host, pathname } = new URL(url);
    return host + pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

const arrow = (
  <ArrowUpRight className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
);

// Live Demo, plus GitHub only when a public repository exists. A project whose
// only URL is its repository (no deployed demo) shows just the GitHub link.
export function ExternalLinks({ project }: { project: Pick<Project, "url" | "repo_url"> }) {
  const sourceOnly = project.repo_url === project.url;
  return (
    <>
      {!sourceOnly && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Live Demo
          {arrow}
        </a>
      )}
      {project.repo_url && (
        <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          GitHub
          {arrow}
        </a>
      )}
    </>
  );
}
