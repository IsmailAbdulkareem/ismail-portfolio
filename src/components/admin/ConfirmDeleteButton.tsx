"use client";

import { useActionState } from "react";
import { IDLE, type FormAction } from "@/app/admin/actions/state";
import { SubmitButton } from "./SubmitButton";

type ConfirmDeleteButtonProps = {
  action: FormAction;
  id: string;
  confirmMessage: string;
  label?: string;
  size?: "sm" | "md";
};

// Standalone form (never nested inside another form) that asks before deleting.
export function ConfirmDeleteButton({ action, id, confirmMessage, label = "Delete", size = "sm" }: ConfirmDeleteButtonProps) {
  const [state, formAction] = useActionState(action, IDLE);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger" size={size} pendingLabel="Deleting…">
        {label}
      </SubmitButton>
      {state.status === "error" ? (
        <p role="alert" className="text-xs text-rose-300">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
