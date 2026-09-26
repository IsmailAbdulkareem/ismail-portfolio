"use client";

import { useActionState } from "react";
import { updateLeadStatus } from "@/app/admin/actions/leads";
import { IDLE } from "@/app/admin/actions/state";
import { controlClass } from "@/components/admin/fields";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

// Saves as soon as a new status is picked.
export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [state, formAction, pending] = useActionState(updateLeadStatus, IDLE);
  const selectId = `lead-status-${id}`;

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={selectId} className="text-xs text-muted">
        Status
      </label>
      <select
        id={selectId}
        name="status"
        defaultValue={status}
        aria-busy={pending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={cn(controlClass, "h-8 w-auto py-0 pr-8 text-xs capitalize")}
      >
        {LEAD_STATUSES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <span role="status" aria-live="polite" className={cn("text-xs", state.status === "error" ? "text-rose-300" : "text-muted")}>
        {pending ? "Saving…" : state.status === "error" ? state.message : null}
      </span>
    </form>
  );
}
