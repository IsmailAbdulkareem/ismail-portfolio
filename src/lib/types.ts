// Row shapes for the Supabase tables in supabase/migrations/0001_init.sql.

export type ProjectArtKind = "tools" | "map" | "chat" | "blueprint" | "book" | "tasks";

export const PROJECT_ART_KINDS: ProjectArtKind[] = ["tools", "map", "chat", "blueprint", "book", "tasks"];

export type Project = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string | null;
  url: string;
  repo_url: string | null;
  technologies: string[];
  features: string[];
  art_kind: ProjectArtKind | null;
  cover_image_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  flow: string[];
  core: number;
  sort_order: number;
};

export type Skill = {
  id: string;
  name: string;
  icon_slug: string | null;
  sort_order: number;
};

export type SkillGroup = {
  id: string;
  category: string;
  sort_order: number;
  skills: Skill[];
};

export type LeadSource = "contact" | "chatbot";
export type LeadStatus = "new" | "read" | "replied" | "archived";

export const LEAD_STATUSES: LeadStatus[] = ["new", "read", "replied", "archived"];

export type Lead = {
  id: string;
  source: LeadSource;
  name: string;
  email: string;
  message: string;
  status: LeadStatus;
  conversation_id: string | null;
  created_at: string;
};

export type ChatConversation = {
  id: string;
  visitor_id: string | null;
  started_at: string;
  last_message_at: string;
};

export type ChatMessage = {
  id: number;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};
