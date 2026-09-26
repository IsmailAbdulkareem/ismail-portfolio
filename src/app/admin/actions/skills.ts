"use server";

import { revalidatePath } from "next/cache";
import { revalidateFeeds } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth";
import { isUniqueViolation, isUuid, parseInteger, text } from "./form-utils";
import type { FormState } from "./state";

export type SkillGroupField = "category" | "sort_order";
export type SkillField = "name" | "icon_slug" | "sort_order";

const ICON_SLUG_PATTERN = /^[a-z0-9]+$/;

// Skills render on /about and in the About section of the home page.
function revalidateSkills() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin", "layout");
  revalidateFeeds();
}

function invalid<F extends string>(errors: Partial<Record<F, string>>, values: Partial<Record<F, string>>): FormState<F> {
  return { status: "error", message: "Fix the highlighted fields.", errors, values };
}

// ─── Groups ──────────────────────────────────────────────────────────────

function parseGroup(formData: FormData) {
  const values = { category: text(formData, "category"), sort_order: text(formData, "sort_order") };
  const errors: Partial<Record<SkillGroupField, string>> = {};
  const sortOrder = parseInteger(values.sort_order);

  if (!values.category) errors.category = "Category is required.";
  else if (values.category.length > 60) errors.category = "Keep it under 60 characters.";
  if (sortOrder === null) errors.sort_order = "Enter a whole number.";

  return { values, errors, row: { category: values.category, sort_order: sortOrder ?? 0 } };
}

export async function createSkillGroup(
  _prev: FormState<SkillGroupField>,
  formData: FormData,
): Promise<FormState<SkillGroupField>> {
  const { supabase } = await requireAdmin();

  const { values, errors, row } = parseGroup(formData);
  if (Object.keys(errors).length > 0) return invalid(errors, values);

  const { error } = await supabase.from("skill_groups").insert(row);
  if (isUniqueViolation(error)) return invalid({ category: "This category already exists." }, values);
  if (error) return { status: "error", message: `Could not create: ${error.message}`, values };

  revalidateSkills();
  return { status: "success", message: "Group added." };
}

export async function updateSkillGroup(
  _prev: FormState<SkillGroupField>,
  formData: FormData,
): Promise<FormState<SkillGroupField>> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown group." };

  const { values, errors, row } = parseGroup(formData);
  if (Object.keys(errors).length > 0) return invalid(errors, values);

  const { data, error } = await supabase.from("skill_groups").update(row).eq("id", id).select("id").maybeSingle();
  if (isUniqueViolation(error)) return invalid({ category: "This category already exists." }, values);
  if (error) return { status: "error", message: `Could not save: ${error.message}`, values };
  if (!data) return { status: "error", message: "This group no longer exists." };

  revalidateSkills();
  return { status: "success", message: "Saved." };
}

export async function deleteSkillGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown group." };

  // Skills in the group are removed by the foreign key's ON DELETE CASCADE.
  const { error } = await supabase.from("skill_groups").delete().eq("id", id);
  if (error) return { status: "error", message: `Could not delete: ${error.message}` };

  revalidateSkills();
  return { status: "success", message: "Deleted." };
}

// ─── Skills ──────────────────────────────────────────────────────────────

function parseSkill(formData: FormData) {
  const values = {
    name: text(formData, "name"),
    icon_slug: text(formData, "icon_slug"),
    sort_order: text(formData, "sort_order"),
  };
  const errors: Partial<Record<SkillField, string>> = {};
  const sortOrder = parseInteger(values.sort_order);

  if (!values.name) errors.name = "Name is required.";
  else if (values.name.length > 60) errors.name = "Keep it under 60 characters.";
  if (values.icon_slug && (values.icon_slug.length > 60 || !ICON_SLUG_PATTERN.test(values.icon_slug))) {
    errors.icon_slug = "Lowercase letters and numbers only, e.g. nextdotjs.";
  }
  if (sortOrder === null) errors.sort_order = "Enter a whole number.";

  return {
    values,
    errors,
    row: { name: values.name, icon_slug: values.icon_slug || null, sort_order: sortOrder ?? 0 },
  };
}

export async function createSkill(_prev: FormState<SkillField>, formData: FormData): Promise<FormState<SkillField>> {
  const { supabase } = await requireAdmin();

  const groupId = text(formData, "group_id");
  if (!isUuid(groupId)) return { status: "error", message: "Unknown group." };

  const { values, errors, row } = parseSkill(formData);
  if (Object.keys(errors).length > 0) return invalid(errors, values);

  const { error } = await supabase.from("skills").insert({ ...row, group_id: groupId });
  if (error?.code === "23503") return { status: "error", message: "This group no longer exists.", values };
  if (error) return { status: "error", message: `Could not create: ${error.message}`, values };

  revalidateSkills();
  return { status: "success", message: "Skill added." };
}

export async function updateSkill(_prev: FormState<SkillField>, formData: FormData): Promise<FormState<SkillField>> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown skill." };

  const { values, errors, row } = parseSkill(formData);
  if (Object.keys(errors).length > 0) return invalid(errors, values);

  const { data, error } = await supabase.from("skills").update(row).eq("id", id).select("id").maybeSingle();
  if (error) return { status: "error", message: `Could not save: ${error.message}`, values };
  if (!data) return { status: "error", message: "This skill no longer exists." };

  revalidateSkills();
  return { status: "success", message: "Saved." };
}

export async function deleteSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown skill." };

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { status: "error", message: `Could not delete: ${error.message}` };

  revalidateSkills();
  return { status: "success", message: "Deleted." };
}
