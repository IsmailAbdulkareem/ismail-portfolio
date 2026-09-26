import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <>
      <Link href="/admin/projects" className="text-xs text-muted transition-colors hover:text-fg">
        ← Projects
      </Link>
      <div className="mt-2">
        <PageHeader title="New project" />
      </div>
      <ProjectForm />
    </>
  );
}
