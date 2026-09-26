import Link from "next/link";
import { ArrowRight } from "@/components/home/ArrowRight";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExternalLinks, displayHost, linkClass } from "./links";
import { ProjectArt } from "./ProjectArt";
import { ProjectVisual } from "./ProjectVisual";
import { TechList } from "./TechList";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reversed = index % 2 === 1;
  const href = `/projects/${project.slug}`;

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={cn("min-w-0 lg:col-span-7", reversed && "lg:order-2")}>
        <ProjectVisual href={project.url} host={displayHost(project.url)}>
          <ProjectArt project={project} />
        </ProjectVisual>
      </div>

      <div className={cn("min-w-0 lg:col-span-5", reversed && "lg:order-1")}>
        <p className="font-mono text-[11px] tracking-[0.24em] text-accent/80 uppercase">
          Project {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          <Link href={href} className="transition-colors hover:text-accent">
            {project.name}
          </Link>
        </h3>
        <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

        {project.features.length > 0 && (
          <ul className="mt-5 grid gap-2 text-sm text-fg/80 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1 shrink-0 rounded-full bg-accent/70" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <TechList technologies={project.technologies} className="mt-6" />

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <Link href={href} className={cn(linkClass, "group")}>
            Case study
            <span className="sr-only">: {project.name}</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <ExternalLinks project={project} />
        </div>
      </div>
    </article>
  );
}
