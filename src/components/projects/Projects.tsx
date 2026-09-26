import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

type ProjectsProps = {
  projects: Project[];
  as?: "h1" | "h2";
  className?: string;
  // Rendered below the list, e.g. a "View all projects" link on the home page.
  children?: ReactNode;
};

export function Projects({ projects, as, className, children }: ProjectsProps) {
  return (
    <Section id="projects" className={className}>
      <Reveal>
        <SectionHeading
          as={as}
          label="Projects"
          title="Selected work"
          description="A selection of products, experiments, and systems I've built."
        />
      </Reveal>

      {projects.length > 0 ? (
        <div className="mt-16 space-y-24 sm:mt-20 lg:space-y-32">
          {projects.map((project, index) => (
            <Reveal key={project.id}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-muted sm:mt-20">New projects are on the way — check back soon.</p>
      )}

      {children}
    </Section>
  );
}
