import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { getProjects } from "@/lib/queries";

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const latest = projects.reduce((max, p) => (p.updated_at > max ? p.updated_at : max), "");
  const lastModified = latest ? new Date(latest) : new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(project.cover_image_url && { images: [project.cover_image_url] }),
    })),
  ];
}
