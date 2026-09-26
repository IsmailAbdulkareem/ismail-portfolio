"use server";

import { revalidatePath } from "next/cache";
import { revalidateFeeds } from "@/lib/revalidate";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { PROJECT_ART_KINDS, type ProjectArtKind } from "@/lib/types";
import {
  checked,
  isHttpUrl,
  isUniqueViolation,
  isUuid,
  parseInteger,
  parseList,
  text,
} from "./form-utils";
import type { FormState } from "./state";

export type ProjectField =
  | "name"
  | "slug"
  | "summary"
  | "description"
  | "url"
  | "repo_url"
  | "technologies"
  | "features"
  | "art_kind"
  | "cover_image"
  | "remove_image"
  | "featured"
  | "published"
  | "sort_order";

type ProjectState = FormState<ProjectField>;

const BUCKET = "project-images";
const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// Raster formats only: SVG can carry script and is served from a public bucket.
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/, "");
}

function safeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^[-.]+|-+$/g, "")
    .slice(-80);
  return cleaned || "image";
}

// Storage object path for a URL this bucket issued, or null for anything else.
function storagePath(publicUrl: string | null) {
  if (!publicUrl) return null;
  const index = publicUrl.indexOf(PUBLIC_PREFIX);
  if (index === -1) return null;
  const path = decodeURIComponent(publicUrl.slice(index + PUBLIC_PREFIX.length));
  return path.startsWith("projects/") ? path : null;
}

function revalidateProject(...slugs: Array<string | undefined>) {
  revalidatePath("/");
  revalidatePath("/projects");
  for (const slug of new Set(slugs)) if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin", "layout");
  revalidateFeeds();
}

export async function saveProject(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (id && !isUuid(id)) return { status: "error", message: "Unknown project." };

  const values = {
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    summary: text(formData, "summary"),
    description: text(formData, "description"),
    url: text(formData, "url"),
    repo_url: text(formData, "repo_url"),
    technologies: text(formData, "technologies"),
    features: text(formData, "features"),
    art_kind: text(formData, "art_kind"),
    sort_order: text(formData, "sort_order"),
    featured: checked(formData, "featured") ? "on" : "",
    published: checked(formData, "published") ? "on" : "",
    remove_image: checked(formData, "remove_image") ? "on" : "",
  } satisfies Partial<Record<ProjectField, string>>;

  const errors: Partial<Record<ProjectField, string>> = {};
  const slug = values.slug || slugify(values.name);
  const technologies = parseList(values.technologies);
  const features = parseList(values.features);
  const sortOrder = parseInteger(values.sort_order);

  if (!values.name) errors.name = "Name is required.";
  else if (values.name.length > 120) errors.name = "Keep the name under 120 characters.";

  if (!slug) errors.slug = "Enter a slug (or a name to generate one from).";
  else if (slug.length > 100 || !SLUG_PATTERN.test(slug)) {
    errors.slug = "Use lowercase letters, numbers and single hyphens, e.g. my-project.";
  }

  if (!values.summary) errors.summary = "Summary is required.";
  else if (values.summary.length > 500) errors.summary = "Keep the summary under 500 characters.";

  if (values.description.length > 10_000) errors.description = "Description is too long.";

  if (!values.url) errors.url = "Live URL is required.";
  else if (values.url.length > 2048 || !isHttpUrl(values.url)) errors.url = "Enter a full http(s) URL.";

  if (values.repo_url && (values.repo_url.length > 2048 || !isHttpUrl(values.repo_url))) {
    errors.repo_url = "Enter a full http(s) URL or leave it empty.";
  }

  if (technologies.length > 30 || technologies.some((t) => t.length > 50)) {
    errors.technologies = "Up to 30 technologies, 50 characters each.";
  }
  if (features.length > 30 || features.some((f) => f.length > 200)) {
    errors.features = "Up to 30 features, 200 characters each.";
  }

  const artKind = values.art_kind ? (values.art_kind as ProjectArtKind) : null;
  if (artKind && !PROJECT_ART_KINDS.includes(artKind)) errors.art_kind = "Pick one of the listed kinds.";

  if (sortOrder === null) errors.sort_order = "Enter a whole number.";

  const image = formData.get("cover_image");
  const file = image instanceof File && image.size > 0 ? image : null;
  if (file && !IMAGE_TYPES.has(file.type)) errors.cover_image = "Use a JPEG, PNG, WebP, AVIF or GIF image.";
  else if (file && file.size > MAX_IMAGE_BYTES) errors.cover_image = "Images must be 5 MB or smaller.";

  let existing: { slug: string; cover_image_url: string | null } | null = null;
  if (id) {
    const { data, error } = await supabase
      .from("projects")
      .select("slug, cover_image_url")
      .eq("id", id)
      .maybeSingle();
    if (error) return { status: "error", message: `Could not load the project: ${error.message}`, values };
    if (!data) return { status: "error", message: "This project no longer exists." };
    existing = data;
  }

  if (Object.keys(errors).length > 0) {
    const message = file ? "Fix the highlighted fields and re-select the image." : "Fix the highlighted fields.";
    return { status: "error", message, errors, values };
  }

  let uploadedPath: string | null = null;
  let coverImageUrl = values.remove_image ? null : (existing?.cover_image_url ?? null);
  if (file) {
    uploadedPath = `projects/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(uploadedPath, file, { contentType: file.type, upsert: false });
    if (error) {
      return { status: "error", message: `Image upload failed: ${error.message}`, values };
    }
    coverImageUrl = supabase.storage.from(BUCKET).getPublicUrl(uploadedPath).data.publicUrl;
  }

  const row = {
    name: values.name,
    slug,
    summary: values.summary,
    description: values.description || null,
    url: values.url,
    repo_url: values.repo_url || null,
    technologies,
    features,
    art_kind: artKind,
    cover_image_url: coverImageUrl,
    featured: values.featured === "on",
    published: values.published === "on",
    sort_order: sortOrder ?? 0,
  };

  const { data: saved, error } = id
    ? await supabase.from("projects").update(row).eq("id", id).select("id").maybeSingle()
    : await supabase.from("projects").insert(row).select("id").single();

  if (error || !saved) {
    if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
    if (isUniqueViolation(error)) {
      return { status: "error", message: "Fix the highlighted fields.", errors: { slug: "This slug is already used." }, values };
    }
    return { status: "error", message: `Could not save: ${error?.message ?? "project not found"}`, values };
  }

  // The old image is no longer referenced once it was replaced or removed.
  const oldPath = storagePath(existing?.cover_image_url ?? null);
  if (oldPath && existing?.cover_image_url !== coverImageUrl) {
    await supabase.storage.from(BUCKET).remove([oldPath]);
  }

  revalidateProject(existing?.slug, slug);

  if (!id) redirect(`/admin/projects/${saved.id}?created=1`);
  return { status: "success", message: "Saved." };
}

export async function deleteProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown project." };

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .select("slug, cover_image_url")
    .maybeSingle();
  if (error) return { status: "error", message: `Could not delete: ${error.message}` };
  if (!data) return { status: "error", message: "This project no longer exists." };

  const imagePath = storagePath(data.cover_image_url);
  if (imagePath) await supabase.storage.from(BUCKET).remove([imagePath]);

  revalidateProject(data.slug);
  redirect("/admin/projects");
}
