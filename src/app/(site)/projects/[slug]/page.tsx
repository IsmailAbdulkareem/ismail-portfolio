import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CtaBand } from "@/components/home/CtaBand";
import { ExternalLinks, displayHost } from "@/components/projects/links";
import { ProjectArt } from "@/components/projects/ProjectArt";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { TechList } from "@/components/projects/TechList";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProject, getProjects } from "@/lib/queries";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectSchema } from "@/lib/structured-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

// generateMetadata and the page both need the project: one query per request.
const loadProject = cache(getProject);

const PARAGRAPH_BREAK = /\n\s*\n/;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      url: `/projects/${project.slug}`,
      title: `${project.name} — Ismail Abdul Kareem`,
      description: project.summary,
      type: "article",
      // A page-level openGraph replaces the root one, so restate the default image.
      images: [project.cover_image_url ?? "/opengraph-image"],
    },
  };
}

const eyebrow = "font-mono text-[11px] tracking-[0.24em] text-muted uppercase";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  const paragraphs =
    project.description
      ?.split(PARAGRAPH_BREAK)
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  return (
    <main>
      <JsonLd data={projectSchema(project)} />
      <Section
        id="project"
        className="pt-32 sm:pt-40"
        backdrop={
          <div className="absolute top-0 right-[-15%] size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.06),transparent)]" />
        }
      >
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-muted uppercase transition-colors hover:text-fg"
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            fill="none"
            className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path
              d="M13 8H3m0 0 4-4M3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All projects
        </Link>

        <Reveal className="mt-10">
          <SectionHeading
            as="h1"
            label="Case study"
            title={project.name}
            description={project.summary}
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-14 sm:mt-16">
          <ProjectVisual href={project.url} host={displayHost(project.url)}>
            <ProjectArt project={project} sizes="(min-width: 1280px) 1200px, 100vw" preload />
          </ProjectVisual>
        </Reveal>

        <div className="mt-16 grid gap-14 sm:mt-20 lg:grid-cols-12 lg:gap-14">
          {paragraphs.length > 0 && (
            <Reveal className="min-w-0 lg:col-span-7">
              <h2 className={eyebrow}>Overview</h2>
              <div className="mt-6 max-w-2xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal
            className={
              paragraphs.length > 0
                ? "min-w-0 space-y-10 lg:col-span-5"
                : "min-w-0 space-y-10 lg:col-span-12"
            }
          >
            {project.features.length > 0 && (
              <div>
                <h2 className={eyebrow}>Features</h2>
                <ul className="mt-5 grid gap-2.5 text-[15px] text-fg/85 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <span aria-hidden className="size-1 shrink-0 rounded-full bg-accent/70" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies.length > 0 && (
              <div>
                <h2 className={eyebrow}>Technologies</h2>
                <TechList technologies={project.technologies} className="mt-5" />
              </div>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <ExternalLinks project={project} />
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Want something
            <br />
            <span className="bg-linear-to-r from-fg via-sky-100 to-sky-300/70 bg-clip-text text-transparent">
              similar?
            </span>
          </>
        }
        description="Tell me about your idea or business problem and I'll help you turn it into a working product."
      />
    </main>
  );
}
