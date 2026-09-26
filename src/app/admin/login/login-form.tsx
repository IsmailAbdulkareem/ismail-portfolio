"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions/auth";
import type { LoginState } from "@/app/admin/actions/state";
import { buttonClass } from "@/components/admin/button-styles";
import { TextField } from "@/components/admin/fields";

const INITIAL: LoginState = {};

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(signIn, INITIAL);
  // A fresh submission replaces the error carried in from the URL.
  const error = state === INITIAL ? initialError : state.error;

  return (
    <form action={formAction} className="grid gap-4">
      <TextField
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        defaultValue={state.email}
        autoFocus
      />
      <TextField name="password" type="password" label="Password" autoComplete="current-password" required />

      <p role="alert" aria-live="assertive" className="min-h-4 text-xs text-rose-300">
        {error}
      </p>

      <button type="submit" disabled={pending} className={buttonClass("primary", "md", "w-full")}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
