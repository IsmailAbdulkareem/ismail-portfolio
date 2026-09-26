"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { EMAIL } from "@/data/site";
import { ContactSubmitError, submitContact } from "@/lib/contact";
import { cn } from "@/lib/utils";
import {
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactPayload,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactPayload = { name: "", email: "", message: "" };
const FIELDS = Object.keys(EMPTY) as ContactField[];

function mailtoFor(values: ContactPayload) {
  const subject = encodeURIComponent(`Project inquiry from ${values.name.trim()}`);
  const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`);
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

const inputClass =
  "w-full rounded-2xl border bg-bg/60 px-4 py-3.5 text-[15px] text-fg placeholder:text-muted/60 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent/30";

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Snapshot of what was submitted, so the email fallback survives edits.
  const [submitted, setSubmitted] = useState<ContactPayload>(EMPTY);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as ContactField;
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    // Once a field has been flagged, re-check it live so the error clears.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateContact(next)[field] }));
    if (status === "success" || status === "error") setStatus("idle");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const focusFirstInvalid = (fieldErrors: ContactErrors) => {
      const firstInvalid = FIELDS.find((field) => fieldErrors[field]);
      if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return Boolean(firstInvalid);
    };

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (focusFirstInvalid(nextErrors)) return;

    setStatus("submitting");
    setSubmitted(values);
    try {
      const company = new FormData(form).get("company");
      await submitContact({ ...values, company: typeof company === "string" ? company : "" });
      setStatus("success");
      setValues(EMPTY);
    } catch (error) {
      const serverErrors = error instanceof ContactSubmitError ? error.fieldErrors : {};
      if (Object.keys(serverErrors).length > 0) {
        // Validation failure: show it on the fields, not as a send failure.
        setErrors(serverErrors);
        setStatus("idle");
        focusFirstInvalid(serverErrors);
        return;
      }
      setErrorMessage(
        error instanceof ContactSubmitError && error.rateLimited
          ? "You've sent several messages in a short time, so this one wasn't sent. "
          : "Something went wrong and your message wasn't sent. ",
      );
      setStatus("error");
    }
  };

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    maxLength: CONTACT_LIMITS[field],
    onChange,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: cn(
      inputClass,
      errors[field] ? "border-red-400/50" : "border-white/[0.08] hover:border-white/[0.14]",
    ),
  });

  const fieldError = (field: ContactField) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="mt-2 text-[13px] text-red-300/90">
        {errors[field]}
      </p>
    );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm text-fg/80">
            Name
          </label>
          <input type="text" autoComplete="name" placeholder="Your name" {...fieldProps("name")} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm text-fg/80">
            Email
          </label>
          <input type="email" autoComplete="email" placeholder="you@company.com" {...fieldProps("email")} />
          {fieldError("email")}
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm text-fg/80">
          Message
        </label>
        <textarea rows={5} placeholder="What would you like to build?" {...fieldProps("message")} />
        {fieldError("message")}
      </div>

      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-fg px-6 text-[15px] font-medium tracking-tight text-bg transition-[background-color,transform] duration-300 hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        {status !== "submitting" && (
          <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div aria-live="polite" className="min-h-6 text-sm">
        {status === "success" && (
          <p className="text-accent">Thanks — your message was sent. I&apos;ll get back to you soon.</p>
        )}
        {status === "error" && (
          <p className="text-muted">
            {errorMessage}
            <a href={mailtoFor(submitted)} className="text-fg underline decoration-white/30 underline-offset-4 hover:decoration-accent">
              Email it to me directly instead
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
