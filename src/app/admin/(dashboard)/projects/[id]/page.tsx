import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isUuid } from "@/app/admin/actions/form-utils";
import { deleteProject } from "@/app/admin/actions/projects";
import { Badge } from "@/components/admin/Badge";
import { buttonClass } from "@/components/admin/button-styles";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { requireAdmin } from "@/lib/auth";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
}) {
  const [{ supabase }, { id }, { created }] = await Promise.all([requireAdmin(), params, searchParams]);
  if (!isUuid(id)) notFound();

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Failed to load project: ${error.message}`);
  if (!data) notFound();
  const project = data as Project;

  return (
    <>
      <Link href="/admin/projects" className="text-xs text-muted transition-colors hover:text-fg">
        ← Projects
      </Link>
      <div className="mt-2">
        <PageHeader
          title={
            <span className="flex flex-wrap items-center gap-2">
              {project.name}
              {project.published ? null : <Badge tone="warning">Draft</Badge>}
            </span>
          }
          description={<span className="font-mono text-xs">/projects/{project.slug}</span>}
          actions={
            <>
              {project.published ? (
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClass("secondary", "sm")}
                >
                  View live ↗
                </Link>
              ) : null}
              <ConfirmDeleteButton
                action={deleteProject}
                id={project.id}
                confirmMessage={`Delete "${project.name}"? This cannot be undone.`}
                label="Delete project"
              />
            </>
          }
        />
      </div>
      <ProjectForm project={project} created={created === "1"} />
    </>
  );
}
