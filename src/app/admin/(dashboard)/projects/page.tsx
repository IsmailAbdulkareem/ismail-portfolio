import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/admin/Badge";
import { buttonClass } from "@/components/admin/button-styles";
import { formatDate } from "@/components/admin/format";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { Table, Td, Th } from "@/components/admin/Table";
import { requireAdmin } from "@/lib/auth";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

type Row = Pick<Project, "id" | "name" | "slug" | "featured" | "published" | "sort_order" | "updated_at">;

export default async function ProjectsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, slug, featured, published, sort_order, updated_at")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  const projects = data as Row[];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Ordered by sort order, as on the site. Drafts stay hidden from visitors."
        actions={
          <Link href="/admin/projects/new" className={buttonClass("primary")}>
            New project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState>No projects yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Featured</Th>
              <Th>Status</Th>
              <Th className="text-right">Order</Th>
              <Th className="text-right">Updated</Th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="transition-colors hover:bg-white/[0.02]">
                <Td>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-medium text-fg hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    {project.name}
                  </Link>
                </Td>
                <Td className="font-mono text-xs text-muted">{project.slug}</Td>
                <Td>{project.featured ? <Badge tone="accent">Featured</Badge> : <span className="text-muted">—</span>}</Td>
                <Td>
                  {project.published ? <Badge tone="success">Published</Badge> : <Badge tone="warning">Draft</Badge>}
                </Td>
                <Td className="text-right font-mono text-xs tabular-nums text-muted">{project.sort_order}</Td>
                <Td className="text-right font-mono text-xs whitespace-nowrap text-muted">
                  <time dateTime={project.updated_at}>{formatDate(project.updated_at)}</time>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
