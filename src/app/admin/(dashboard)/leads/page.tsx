import type { Metadata } from "next";
import Link from "next/link";
import { deleteLead } from "@/app/admin/actions/leads";
import { Badge, LEAD_STATUS_TONE } from "@/components/admin/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { formatDateTime } from "@/components/admin/format";
import { LeadStatusSelect } from "@/components/admin/leads/LeadStatusSelect";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import { LEAD_STATUSES, type Lead, type LeadSource, type LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

const SOURCES: LeadSource[] = ["contact", "chatbot"];
const PAGE_SIZE = 100;

type Filters = { status?: LeadStatus; source?: LeadSource };

function pick<T extends string>(value: string | string[] | undefined, allowed: readonly T[]) {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

function filterHref(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  const query = params.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-xs capitalize transition-colors",
        "focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none",
        active
          ? "border-accent/40 bg-accent/[0.08] text-accent"
          : "border-white/[0.1] text-muted hover:border-white/20 hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; source?: string | string[] }>;
}) {
  const [{ supabase }, params] = await Promise.all([requireAdmin(), searchParams]);
  const filters: Filters = { status: pick(params.status, LEAD_STATUSES), source: pick(params.source, SOURCES) };

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.source) query = query.eq("source", filters.source);

  const { data, count, error } = await query;
  if (error) throw new Error(`Failed to load leads: ${error.message}`);
  const leads = data as Lead[];
  const total = count ?? leads.length;

  return (
    <>
      <PageHeader
        title="Leads"
        description={
          total > leads.length ? `Showing the latest ${leads.length} of ${total}.` : `${total} ${total === 1 ? "lead" : "leads"}.`
        }
      />

      <div className="mb-5 grid gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 w-14 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Status</span>
          <Chip href={filterHref({ ...filters, status: undefined })} active={!filters.status}>
            All
          </Chip>
          {LEAD_STATUSES.map((status) => (
            <Chip key={status} href={filterHref({ ...filters, status })} active={filters.status === status}>
              {status}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 w-14 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Source</span>
          <Chip href={filterHref({ ...filters, source: undefined })} active={!filters.source}>
            All
          </Chip>
          {SOURCES.map((source) => (
            <Chip key={source} href={filterHref({ ...filters, source })} active={filters.source === source}>
              {source}
            </Chip>
          ))}
        </div>
      </div>

      {leads.length === 0 ? (
        <EmptyState>{filters.status || filters.source ? "No leads match these filters." : "No leads yet."}</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className={cn(
                "rounded-xl border bg-surface/60 p-4",
                lead.status === "new" ? "border-accent/20" : "border-white/[0.08]",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{lead.name}</p>
                  <a
                    href={`mailto:${encodeURIComponent(lead.email)}`}
                    className="text-xs break-all text-accent/90 hover:text-accent hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="dim">{lead.source}</Badge>
                  <Badge tone={LEAD_STATUS_TONE[lead.status]}>{lead.status}</Badge>
                  <time dateTime={lead.created_at} className="font-mono text-[11px] whitespace-nowrap text-muted">
                    {formatDateTime(lead.created_at)}
                  </time>
                </div>
              </div>

              <details className="group mt-3">
                <summary className="cursor-pointer list-none text-sm text-fg/75 [&::-webkit-details-marker]:hidden">
                  <span className="line-clamp-2 group-open:hidden">{lead.message}</span>
                  <span className="mt-1 inline-block text-xs text-muted group-open:mt-0 hover:text-fg">
                    <span className="group-open:hidden">Show full message</span>
                    <span className="hidden group-open:inline">Hide message</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-fg/85">{lead.message}</p>
              </details>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                <LeadStatusSelect id={lead.id} status={lead.status} />
                <div className="flex flex-wrap items-center gap-3">
                  {lead.conversation_id ? (
                    <Link
                      href={`/admin/chats/${lead.conversation_id}`}
                      className="text-xs text-muted transition-colors hover:text-fg"
                    >
                      View chat transcript →
                    </Link>
                  ) : null}
                  <ConfirmDeleteButton
                    action={deleteLead}
                    id={lead.id}
                    confirmMessage={`Delete the lead from "${lead.name}"? This cannot be undone.`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
