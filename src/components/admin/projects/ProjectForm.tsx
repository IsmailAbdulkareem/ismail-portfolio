"use client";

import Image from "next/image";
import { useActionState } from "react";
import { saveProject, type ProjectField } from "@/app/admin/actions/projects";
import { IDLE, type FormState } from "@/app/admin/actions/state";
import { Checkbox, Field, SelectField, TextAreaField, TextField, controlClass } from "@/components/admin/fields";
import { FormMessage } from "@/components/admin/FormMessage";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { PROJECT_ART_KINDS, type Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type Values = Partial<Record<ProjectField, string>>;

const NEW_PROJECT: Values = { published: "on", featured: "", sort_order: "0" };

function toValues(project: Project): Values {
  return {
    name: project.name,
    slug: project.slug,
    summary: project.summary,
    description: project.description ?? "",
    url: project.url,
    repo_url: project.repo_url ?? "",
    technologies: project.technologies.join(", "),
    features: project.features.join(", "),
    art_kind: project.art_kind ?? "",
    featured: project.featured ? "on" : "",
    published: project.published ? "on" : "",
    sort_order: String(project.sort_order),
  };
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-xl border border-white/[0.08] bg-surface/60 p-4 sm:p-5">
      <legend className="float-left mb-1 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{title}</legend>
      {children}
    </fieldset>
  );
}

export function ProjectForm({ project, created = false }: { project?: Project; created?: boolean }) {
  const [state, formAction] = useActionState<FormState<ProjectField>, FormData>(saveProject, IDLE);
  const v = state.values ?? (project ? toValues(project) : NEW_PROJECT);
  const e = state.errors ?? {};
  const message = state.status === "idle" && created ? { status: "success" as const, message: "Project created." } : state;

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-5">
        <Panel title="Content">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="name" label="Name" required maxLength={120} defaultValue={v.name} error={e.name} />
            <TextField
              name="slug"
              label="Slug"
              maxLength={100}
              defaultValue={v.slug}
              error={e.slug}
              placeholder="generated-from-name"
              className="font-mono"
              hint={project ? "Changing it changes the public URL." : "Leave blank to generate it from the name."}
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>
          <TextAreaField
            name="summary"
            label="Summary"
            required
            maxLength={500}
            rows={2}
            defaultValue={v.summary}
            error={e.summary}
            hint="One or two sentences for cards."
          />
          <TextAreaField
            name="description"
            label="Description"
            rows={6}
            maxLength={10000}
            defaultValue={v.description}
            error={e.description}
            hint="Optional long-form copy for the project page."
          />
        </Panel>

        <Panel title="Links & details">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="url"
              type="url"
              label="Live URL"
              required
              placeholder="https://"
              defaultValue={v.url}
              error={e.url}
            />
            <TextField
              name="repo_url"
              type="url"
              label="Repository URL"
              placeholder="https://github.com/…"
              defaultValue={v.repo_url}
              error={e.repo_url}
              hint="Optional. Only real, public repositories."
            />
          </div>
          <TextField
            name="technologies"
            label="Technologies"
            placeholder="Next.js, Supabase, OpenAI"
            defaultValue={v.technologies}
            error={e.technologies}
            hint="Comma-separated."
          />
          <TextAreaField
            name="features"
            label="Features"
            rows={3}
            placeholder="Realtime sync, Role-based access, …"
            defaultValue={v.features}
            error={e.features}
            hint="Comma-separated."
          />
        </Panel>
      </div>

      <div className="grid gap-5 lg:sticky lg:top-10">
        <Panel title="Visibility">
          <Checkbox name="published" label="Published" hint="Visible on the public site." defaultChecked={v.published === "on"} />
          <Checkbox name="featured" label="Featured" hint="Shown on the home page." defaultChecked={v.featured === "on"} />
          <TextField
            name="sort_order"
            type="number"
            inputMode="numeric"
            step={1}
            label="Sort order"
            defaultValue={v.sort_order}
            error={e.sort_order}
            hint="Lower numbers come first."
            className="font-mono"
          />
        </Panel>

        <Panel title="Artwork">
          <SelectField name="art_kind" label="Illustration" defaultValue={v.art_kind} error={e.art_kind}>
            <option value="">None</option>
            {PROJECT_ART_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </SelectField>

          {project?.cover_image_url ? (
            <div className="grid gap-2">
              <Image
                src={project.cover_image_url}
                alt="Current cover image"
                width={320}
                height={180}
                unoptimized
                className="aspect-video w-full rounded-lg border border-white/[0.08] object-cover"
              />
              <Checkbox name="remove_image" label="Remove image" defaultChecked={v.remove_image === "on"} />
            </div>
          ) : null}

          <Field
            id="cover_image"
            label={project?.cover_image_url ? "Replace cover image" : "Cover image"}
            error={e.cover_image}
            hint="JPEG, PNG, WebP, AVIF or GIF, up to 5 MB."
          >
            <input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              aria-invalid={e.cover_image ? true : undefined}
              aria-describedby={e.cover_image ? "cover_image-error" : "cover_image-hint"}
              className={cn(
                controlClass,
                "py-1.5 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-white/[0.08] file:px-2.5 file:py-1 file:text-xs file:text-fg",
              )}
            />
          </Field>
        </Panel>

        <div className="flex items-center gap-3">
          <SubmitButton pendingLabel="Saving…">{project ? "Save changes" : "Create project"}</SubmitButton>
          <FormMessage state={message} />
        </div>
      </div>
    </form>
  );
}
