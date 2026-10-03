import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteConversation } from "@/app/admin/actions/chats";
import { isUuid } from "@/app/admin/actions/form-utils";
import { Badge, LEAD_STATUS_TONE } from "@/components/admin/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { formatDateTime } from "@/components/admin/format";
import { LeadStatusSelect } from "@/components/admin/leads/LeadStatusSelect";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import type { ChatConversation, ChatMessage, Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Chat transcript" };

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ supabase }, { id }] = await Promise.all([requireAdmin(), params]);
  if (!isUuid(id)) notFound();

  const [conversationResult, messagesResult, leadsResult] = await Promise.all([
    supabase.from("chat_conversations").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("chat_messages")
      .select("id, conversation_id, role, content, created_at")
      .eq("conversation_id", id)
      .order("created_at")
      .order("id"),
    supabase.from("leads").select("*").eq("conversation_id", id).order("created_at", { ascending: false }),
  ]);

  const failed = [conversationResult, messagesResult, leadsResult].find((r) => r.error);
  if (failed?.error) throw new Error(`Failed to load conversation: ${failed.error.message}`);
  if (!conversationResult.data) notFound();

  const conversation = conversationResult.data as ChatConversation;
  const messages = (messagesResult.data ?? []) as ChatMessage[];
  const leads = (leadsResult.data ?? []) as Lead[];

  return (
    <>
      <Link href="/admin/chats" className="text-xs text-muted transition-colors hover:text-fg">
        ← Chats
      </Link>
      <div className="mt-2">
        <PageHeader
          title="Transcript"
          description={
            <>
              Started {formatDateTime(conversation.started_at)} · {messages.length}{" "}
              {messages.length === 1 ? "message" : "messages"}
            </>
          }
          actions={
            <ConfirmDeleteButton
              action={deleteConversation}
              id={conversation.id}
              confirmMessage="Delete this conversation and all its messages? This cannot be undone."
              label="Delete conversation"
              size="md"
            />
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <section aria-label="Messages" className="rounded-xl border border-white/[0.08] bg-surface/60 p-4 sm:p-5">
          {messages.length === 0 ? (
            <EmptyState>This conversation has no messages.</EmptyState>
          ) : (
            <ol className="grid gap-3">
              {messages.map((message) => {
                const fromUser = message.role === "user";
                return (
                  <li key={message.id} className={cn("flex flex-col", fromUser ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
                        fromUser
                          ? "rounded-br-md bg-accent/[0.12] text-fg"
                          : "rounded-bl-md border border-white/[0.08] bg-bg text-fg/85",
                      )}
                    >
                      {message.content}
                    </div>
                    <span className="mt-1 px-1 font-mono text-[10px] text-muted">
                      {fromUser ? "Visitor" : "Assistant"} · {formatDateTime(message.created_at)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <aside className="grid gap-3 lg:sticky lg:top-10">
          <h2 className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Linked lead</h2>
          {leads.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/[0.1] p-4 text-sm text-muted">
              No lead was captured in this conversation.
            </p>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="grid gap-2 rounded-xl border border-white/[0.08] bg-surface/60 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{lead.name}</p>
                  <Badge tone={LEAD_STATUS_TONE[lead.status]}>{lead.status}</Badge>
                </div>
                <a
                  href={`mailto:${encodeURIComponent(lead.email)}`}
                  className="text-xs break-all text-accent/90 hover:text-accent hover:underline"
                >
                  {lead.email}
                </a>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-fg/80">{lead.message}</p>
                <div className="border-t border-white/[0.06] pt-2">
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </div>
              </div>
            ))
          )}
          {conversation.visitor_id ? (
            <p className="font-mono text-[10px] break-all text-muted/70">Visitor {conversation.visitor_id}</p>
          ) : null}
        </aside>
      </div>
    </>
  );
}
