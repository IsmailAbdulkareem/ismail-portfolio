"use client";

import { useActionState, type ReactNode } from "react";
import { IDLE, type FormAction } from "@/app/admin/actions/state";
import { cn } from "@/lib/utils";
import { buttonClass } from "./button-styles";
import { TextField } from "./fields";
import { FormMessage } from "./FormMessage";

export type InlineField = {
  name: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  mono?: boolean;
};

type InlineFormProps = {
  action: FormAction;
  idPrefix: string;
  fields: InlineField[];
  defaults?: Record<string, string>;
  hidden?: Record<string, string>;
  submitLabel: string;
  // Tailwind grid-template for the field row, e.g. "sm:grid-cols-[1fr_6rem_auto]".
  columns: string;
  showLabels?: boolean;
  // Rendered after Save, outside this <form> (forms cannot nest).
  actions?: ReactNode;
};

// A single-row form for small records (skill groups, skills).
export function InlineForm({
  action,
  idPrefix,
  fields,
  defaults = {},
  hidden = {},
  submitLabel,
  columns,
  showLabels = false,
  actions,
}: InlineFormProps) {
  const [state, formAction, pending] = useActionState(action, IDLE);
  const values = state.values ?? defaults;
  const formId = `${idPrefix}-form`;

  return (
    <div className="grid gap-1">
      <div className={cn("grid items-start gap-2", columns)}>
        <form id={formId} action={formAction} className="contents">
          {Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          {fields.map((field) => (
            <TextField
              key={field.name}
              id={`${idPrefix}-${field.name}`}
              name={field.name}
              label={field.label}
              labelClassName={showLabels ? undefined : "sr-only"}
              type={field.type ?? "text"}
              step={field.type === "number" ? 1 : undefined}
              inputMode={field.type === "number" ? "numeric" : undefined}
              placeholder={field.placeholder}
              hint={showLabels ? field.hint : undefined}
              required={field.required}
              maxLength={field.maxLength}
              defaultValue={values[field.name] ?? ""}
              error={state.errors?.[field.name]}
              className={cn("h-8", field.mono && "font-mono text-xs")}
              autoCapitalize={field.mono ? "none" : undefined}
              spellCheck={field.mono ? false : undefined}
            />
          ))}
        </form>
        <div className={cn("flex items-center gap-2", showLabels && "sm:mt-[1.375rem]")}>
          <button type="submit" form={formId} disabled={pending} className={buttonClass("secondary", "sm")}>
            {pending ? "Saving…" : submitLabel}
          </button>
          {actions}
        </div>
      </div>
      <FormMessage state={state} />
    </div>
  );
}
