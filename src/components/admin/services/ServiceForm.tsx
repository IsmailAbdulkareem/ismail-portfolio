"use client";

import { useActionState, type ReactNode } from "react";
import { createService, updateService, type ServiceField } from "@/app/admin/actions/services";
import { IDLE, type FormState } from "@/app/admin/actions/state";
import { buttonClass } from "@/components/admin/button-styles";
import { TextAreaField, TextField } from "@/components/admin/fields";
import { FormMessage } from "@/components/admin/FormMessage";
import type { Service } from "@/lib/types";

type Values = Partial<Record<ServiceField, string>>;

const EMPTY: Values = { core: "0", sort_order: "0" };

function toValues(service: Service): Values {
  return {
    title: service.title,
    description: service.description,
    flow: service.flow.join(", "),
    core: String(service.core),
    sort_order: String(service.sort_order),
  };
}

// Create form when `service` is omitted. `actions` (e.g. a delete button) is
// rendered beside Save but outside this <form>, since forms cannot nest.
export function ServiceForm({ service, actions }: { service?: Service; actions?: ReactNode }) {
  const [state, formAction, pending] = useActionState<FormState<ServiceField>, FormData>(
    service ? updateService : createService,
    IDLE,
  );
  const prefix = service ? `service-${service.id}` : "service-new";
  const formId = `${prefix}-form`;
  const v = state.values ?? (service ? toValues(service) : EMPTY);
  const e = state.errors ?? {};

  return (
    <div className="grid gap-4 rounded-xl border border-white/[0.08] bg-surface/60 p-4 sm:p-5">
      <form id={formId} action={formAction} className="grid gap-4">
        {service ? <input type="hidden" name="id" value={service.id} /> : null}
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
          <TextField id={`${prefix}-title`} name="title" label="Title" required maxLength={120} defaultValue={v.title} error={e.title} />
          <TextField
            id={`${prefix}-sort`}
            name="sort_order"
            type="number"
            step={1}
            label="Sort order"
            defaultValue={v.sort_order}
            error={e.sort_order}
            className="font-mono"
          />
        </div>
        <TextAreaField
          id={`${prefix}-description`}
          name="description"
          label="Description"
          required
          rows={2}
          maxLength={1000}
          defaultValue={v.description}
          error={e.description}
        />
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
          <TextField
            id={`${prefix}-flow`}
            name="flow"
            label="Flow"
            required
            placeholder="Input, Model, Output"
            defaultValue={v.flow}
            error={e.flow}
            hint="Comma-separated stages of the diagram."
          />
          <TextField
            id={`${prefix}-core`}
            name="core"
            type="number"
            min={0}
            step={1}
            label="Core stage"
            defaultValue={v.core}
            error={e.core}
            hint="0-based index."
            className="font-mono"
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-3">
          <button type="submit" form={formId} disabled={pending} className={buttonClass("primary", "sm")}>
            {pending ? "Saving…" : service ? "Save" : "Add service"}
          </button>
          <FormMessage state={state} />
        </div>
        {actions}
      </div>
    </div>
  );
}
