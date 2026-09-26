import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Form controls for the admin forms. Each labelled control wires its error or
// hint to aria-describedby. `id` defaults to `name`; pass a unique id when the
// same form is rendered more than once on a page.

export const controlClass = cn(
  "w-full rounded-lg border border-white/[0.1] bg-bg px-3 text-sm text-fg placeholder:text-muted/60",
  "transition-colors hover:border-white/20 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:outline-none",
  "aria-invalid:border-rose-400/60 disabled:opacity-60",
);

type FieldProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
};

export function Field({ id, label, hint, error, className, labelClassName, children }: FieldProps) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-xs font-medium text-fg/80", labelClassName)}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

type Labelled = {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  fieldClassName?: string;
  labelClassName?: string;
};

export function TextField({
  id,
  name,
  label,
  hint,
  error,
  fieldClassName,
  labelClassName,
  className,
  ...props
}: Labelled & InputHTMLAttributes<HTMLInputElement>) {
  const controlId = id ?? name;
  return (
    <Field id={controlId} label={label} hint={hint} error={error} className={fieldClassName} labelClassName={labelClassName}>
      <input
        id={controlId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(controlId, error, hint)}
        className={cn(controlClass, "h-9", className)}
        {...props}
      />
    </Field>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  hint,
  error,
  fieldClassName,
  labelClassName,
  className,
  ...props
}: Labelled & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const controlId = id ?? name;
  return (
    <Field id={controlId} label={label} hint={hint} error={error} className={fieldClassName} labelClassName={labelClassName}>
      <textarea
        id={controlId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(controlId, error, hint)}
        className={cn(controlClass, "min-h-20 resize-y py-2 leading-relaxed", className)}
        {...props}
      />
    </Field>
  );
}

export function SelectField({
  id,
  name,
  label,
  hint,
  error,
  fieldClassName,
  labelClassName,
  className,
  children,
  ...props
}: Labelled & SelectHTMLAttributes<HTMLSelectElement>) {
  const controlId = id ?? name;
  return (
    <Field id={controlId} label={label} hint={hint} error={error} className={fieldClassName} labelClassName={labelClassName}>
      <select
        id={controlId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(controlId, error, hint)}
        className={cn(controlClass, "h-9", className)}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

export function Checkbox({
  id,
  name,
  label,
  hint,
  ...props
}: { name: string; label: ReactNode; hint?: ReactNode } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const controlId = id ?? name;
  return (
    <label htmlFor={controlId} className="flex cursor-pointer items-start gap-2.5 text-sm">
      <input
        id={controlId}
        name={name}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-accent"
        {...props}
      />
      <span className="grid gap-0.5">
        <span className="text-fg/90">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}
