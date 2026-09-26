"use server";

import { revalidatePath } from "next/cache";
import { revalidateFeeds } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth";
import { isUuid, parseInteger, parseList, text } from "./form-utils";
import type { FormState } from "./state";

export type ServiceField = "title" | "description" | "flow" | "core" | "sort_order";
type ServiceState = FormState<ServiceField>;

function revalidateServices() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin", "layout");
  revalidateFeeds();
}

function parseService(formData: FormData) {
  const values = {
    title: text(formData, "title"),
    description: text(formData, "description"),
    flow: text(formData, "flow"),
    core: text(formData, "core"),
    sort_order: text(formData, "sort_order"),
  };
  const errors: Partial<Record<ServiceField, string>> = {};
  const flow = parseList(values.flow);
  const core = parseInteger(values.core);
  const sortOrder = parseInteger(values.sort_order);

  if (!values.title) errors.title = "Title is required.";
  else if (values.title.length > 120) errors.title = "Keep the title under 120 characters.";

  if (!values.description) errors.description = "Description is required.";
  else if (values.description.length > 1000) errors.description = "Keep it under 1000 characters.";

  if (flow.length === 0) errors.flow = "Add at least one stage.";
  else if (flow.length > 8 || flow.some((stage) => stage.length > 40)) {
    errors.flow = "Up to 8 stages, 40 characters each.";
  } else if (new Set(flow.map((stage) => stage.toLowerCase())).size !== flow.length) {
    errors.flow = "Stages must be unique.";
  }

  if (core === null || core < 0 || (flow.length > 0 && core >= flow.length)) {
    errors.core = `Enter a stage index from 0 to ${Math.max(flow.length - 1, 0)}.`;
  }
  if (sortOrder === null) errors.sort_order = "Enter a whole number.";

  const row = {
    title: values.title,
    description: values.description,
    flow,
    core: core ?? 0,
    sort_order: sortOrder ?? 0,
  };
  return { values, errors, row };
}

export async function createService(_prev: ServiceState, formData: FormData): Promise<ServiceState> {
  const { supabase } = await requireAdmin();

  const { values, errors, row } = parseService(formData);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", errors, values };
  }

  const { error } = await supabase.from("services").insert(row);
  if (error) return { status: "error", message: `Could not create: ${error.message}`, values };

  revalidateServices();
  return { status: "success", message: "Service added." };
}

export async function updateService(_prev: ServiceState, formData: FormData): Promise<ServiceState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown service." };

  const { values, errors, row } = parseService(formData);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", errors, values };
  }

  const { data, error } = await supabase.from("services").update(row).eq("id", id).select("id").maybeSingle();
  if (error) return { status: "error", message: `Could not save: ${error.message}`, values };
  if (!data) return { status: "error", message: "This service no longer exists." };

  revalidateServices();
  return { status: "success", message: "Saved." };
}

export async function deleteService(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!isUuid(id)) return { status: "error", message: "Unknown service." };

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { status: "error", message: `Could not delete: ${error.message}` };

  revalidateServices();
  return { status: "success", message: "Deleted." };
}
