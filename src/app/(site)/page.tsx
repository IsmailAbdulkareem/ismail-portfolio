import type { Metadata } from "next";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ArrowRight } from "@/components/home/ArrowRight";
import { CtaBand } from "@/components/home/CtaBand";
import { Hero } from "@/components/hero/Hero";
import { Projects } from "@/components/projects/Projects";
import { Services } from "@/components/services/Services";
import { Button } from "@/components/ui/Button";
import { getProjects, getServices } from "@/lib/queries";

export const metadata: Metadata = {
  title: { absolute: "Ismail Abdul Kareem — Freelance Full-Stack AI Engineer" },
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

const FEATURED_LIMIT = 3;

export default async function Home() {
  const [featured, services] = await Promise.all([
    getProjects({ featured: true }),
    getServices(),
  ]);

  return (
    <main>
      <Hero />
      <AboutPreview />
      {featured.length > 0 && (
        <Projects projects={featured.slice(0, FEATURED_LIMIT)}>
          <div className="mt-20 flex justify-center sm:mt-24">
            <Button href="/projects" variant="secondary">
              View all projects
              <ArrowRight />
            </Button>
          </div>
        </Projects>
      )}
      <Services services={services}>
        <div className="mt-12 flex justify-center">
          <Button href="/services" variant="secondary">
            Explore services
            <ArrowRight />
          </Button>
        </div>
      </Services>
      <CtaBand />
    </main>
  );
}
