// Shapes returned by the admin Server Actions. Kept outside the 'use server'
// files because those may only export async functions.

export type FormState<F extends string = string> = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<F, string>>;
  // Submitted values, echoed back on error so the form can be repopulated
  // (React resets uncontrolled forms after an action completes).
  values?: Partial<Record<F, string>>;
};

export type FormAction<F extends string = string> = (
  state: FormState<F>,
  formData: FormData,
) => Promise<FormState<F>>;

export const IDLE: FormState = { status: "idle" };

export type LoginState = { error?: string; email?: string };
