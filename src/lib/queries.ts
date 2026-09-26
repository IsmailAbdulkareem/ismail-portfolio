import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Project, Service, SkillGroup } from "@/lib/types";

// Public content reads. RLS already hides unpublished projects from this client.

export async function getProjects({ featured }: { featured?: boolean } = {}) {
  let query = createPublicClient()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at");
  if (featured) query = query.eq("featured", true);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return data as Project[];
}

export async function getProject(slug: string) {
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(`Failed to load project "${slug}": ${error.message}`);
  return data as Project | null;
}

export async function getServices() {
  const { data, error } = await createPublicClient()
    .from("services")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`Failed to load services: ${error.message}`);
  return data as Service[];
}

export async function getSkillGroups() {
  const { data, error } = await createPublicClient()
    .from("skill_groups")
    .select("id, category, sort_order, skills (id, name, icon_slug, sort_order)")
    .order("sort_order")
    .order("sort_order", { referencedTable: "skills" });
  if (error) throw new Error(`Failed to load skills: ${error.message}`);
  return data as SkillGroup[];
}
