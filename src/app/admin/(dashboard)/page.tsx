import type { Metadata } from "next";
import Link from "next/link";
import { Badge, LEAD_STATUS_TONE } from "@/components/admin/Badge";
import { excerpt, formatDateTime } from "@/components/admin/format";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();

  const count = { count: "exact", head: true } as const;
  const [newLeads, totalLeads, publishedProjects, conversations, latest] = await Promise.all([
    supabase.from("leads").select("id", count).eq("status", "new"),
    supabase.from("leads").select("id", count),
    supabase.from("projects").select("id", count).eq("published", true),
    supabase.from("chat_conversations").select("id", count),
    supabase
      .from("leads")
      .select("id, source, name, email, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const failed = [newLeads, totalLeads, publishedProjects, conversations, latest].find((r) => r.error);
  if (failed?.error) throw new Error(`Failed to load overview: ${failed.error.message}`);

  const stats = [
    { label: "New leads", value: newLeads.count ?? 0, href: "/admin/leads?status=new", highlight: true },
    { label: "Total leads", value: totalLeads.count ?? 0, href: "/admin/leads" },
    { label: "Published projects", value: publishedProjects.count ?? 0, href: "/admin/projects" },
    { label: "Conversations", value: conversations.count ?? 0, href: "/admin/chats" },
  ];
  const leads = (latest.data ?? []) as Omit<Lead, "conversation_id">[];

  return (
    <>
      <PageHeader title="Overview" description="What needs attention across the site." />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-white/[0.08] bg-surface/60 px-4 py-4 transition-colors hover:border-white/[0.16] focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none"
          >
            <dt className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{stat.label}</dt>
            <dd
              className={`mt-2 text-3xl font-semibold tabular-nums tracking-tight ${
                stat.highlight && stat.value > 0 ? "text-accent" : "text-fg"
              }`}
            >
              {stat.value}
            </dd>
          </Link>
        ))}
      </dl>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">Latest leads</h2>
          <Link href="/admin/leads" className="text-xs text-muted transition-colors hover:text-fg">
            View inbox →
          </Link>
        </div>

        {leads.length === 0 ? (
          <EmptyState>No leads yet. Contact form and chatbot submissions will appear here.</EmptyState>
        ) : (
          <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.08] bg-surface/60">
            {leads.map((lead) => (
              <li key={lead.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lead.name}</p>
                  <p className="truncate text-xs text-muted">{lead.email}</p>
                </div>
                <p className="truncate text-sm text-fg/70">{excerpt(lead.message, 120)}</p>
                <div className="flex items-center gap-2 sm:justify-end">
                  <Badge tone="dim">{lead.source}</Badge>
                  <Badge tone={LEAD_STATUS_TONE[lead.status]}>{lead.status}</Badge>
                  <time dateTime={lead.created_at} className="font-mono text-[11px] whitespace-nowrap text-muted">
                    {formatDateTime(lead.created_at)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
