import type { Metadata } from "next";
import Link from "next/link";
import { deleteConversation } from "@/app/admin/actions/chats";
import { Badge } from "@/components/admin/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { formatDateTime } from "@/components/admin/format";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { Table, Td, Th } from "@/components/admin/Table";
import { requireAdmin } from "@/lib/auth";
import type { ChatConversation } from "@/lib/types";

export const metadata: Metadata = { title: "Chats" };

const PAGE_SIZE = 100;

type Row = ChatConversation & {
  chat_messages: { count: number }[];
  leads: { id: string; name: string }[];
};

export default async function ChatsPage() {
  const { supabase } = await requireAdmin();

  const { data, count, error } = await supabase
    .from("chat_conversations")
    .select("id, visitor_id, started_at, last_message_at, chat_messages(count), leads(id, name)", { count: "exact" })
    .order("last_message_at", { ascending: false })
    .limit(PAGE_SIZE);
  if (error) throw new Error(`Failed to load conversations: ${error.message}`);
  const conversations = data as Row[];
  const total = count ?? conversations.length;

  return (
    <>
      <PageHeader
        title="Chats"
        description={
          total > conversations.length
            ? `Showing the latest ${conversations.length} of ${total} chatbot conversations.`
            : "Chatbot conversations, most recent activity first."
        }
      />

      {conversations.length === 0 ? (
        <EmptyState>No conversations yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Last message</Th>
              <Th>Started</Th>
              <Th className="text-right">Messages</Th>
              <Th>Lead</Th>
              <Th>
                <span className="sr-only">Open</span>
              </Th>
              <Th>
                <span className="sr-only">Delete</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => {
              const lead = conversation.leads[0];
              return (
                <tr key={conversation.id} className="transition-colors hover:bg-white/[0.02]">
                  <Td className="font-mono text-xs whitespace-nowrap">
                    <time dateTime={conversation.last_message_at}>{formatDateTime(conversation.last_message_at)}</time>
                  </Td>
                  <Td className="font-mono text-xs whitespace-nowrap text-muted">
                    <time dateTime={conversation.started_at}>{formatDateTime(conversation.started_at)}</time>
                  </Td>
                  <Td className="text-right font-mono text-xs tabular-nums">
                    {conversation.chat_messages[0]?.count ?? 0}
                  </Td>
                  <Td>{lead ? <Badge tone="accent">{lead.name}</Badge> : <span className="text-muted">—</span>}</Td>
                  <Td className="text-right">
                    <Link
                      href={`/admin/chats/${conversation.id}`}
                      className="text-xs whitespace-nowrap text-muted transition-colors hover:text-fg"
                    >
                      Open transcript →
                    </Link>
                  </Td>
                  <Td className="text-right">
                    <ConfirmDeleteButton
                      action={deleteConversation}
                      id={conversation.id}
                      confirmMessage={`Delete this conversation and all its messages? This cannot be undone.`}
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}
