import type { Metadata } from "next";
import { CtaBand } from "@/components/home/CtaBand";
import { Projects } from "@/components/projects/Projects";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/projects" },
  title: "Projects",
  description:
    "Products, experiments, and systems built by Ismail Abdul Kareem — web apps, AI assistants, lead generation, and more.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <Projects as="h1" projects={projects} className="pt-32 sm:pt-40" />
      <CtaBand />
    </main>
  );
}
