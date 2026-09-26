-- Portfolio schema: content (projects, services, skills), leads, chat transcripts.
-- Run once in the Supabase SQL editor (or `supabase db push`).

-- ─── Admins ──────────────────────────────────────────────────────────────
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Content ─────────────────────────────────────────────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  summary text not null,
  description text, -- optional long-form copy for the detail page
  url text not null,
  repo_url text, -- only real repositories, never guessed
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  art_kind text check (art_kind in ('tools', 'map', 'chat', 'blueprint', 'book', 'tasks')),
  cover_image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  flow text[] not null default '{}',
  core integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  category text not null unique,
  sort_order integer not null default 0
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups (id) on delete cascade,
  name text not null,
  icon_slug text, -- simple-icons slug, e.g. "nextdotjs"
  sort_order integer not null default 0
);

-- ─── Leads & chat ────────────────────────────────────────────────────────
create table public.chat_conversations (
  id uuid primary key,
  visitor_id text,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table public.chat_messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_conversation_idx on public.chat_messages (conversation_id, created_at);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact', 'chatbot')),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  conversation_id uuid references public.chat_conversations (id) on delete set null,
  created_at timestamptz not null default now()
);

create index leads_created_idx on public.leads (created_at desc);

-- ─── Row level security ──────────────────────────────────────────────────
-- Public visitors can only read published content. Leads and chat rows are
-- inserted exclusively by server routes using the secret key (bypasses RLS).
alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skills enable row level security;
alter table public.leads enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

create policy "admins read own row" on public.admins
  for select using (user_id = auth.uid());

create policy "read published projects" on public.projects
  for select using (published or public.is_admin());
create policy "admin writes projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

create policy "read services" on public.services for select using (true);
create policy "admin writes services" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "read skill groups" on public.skill_groups for select using (true);
create policy "admin writes skill groups" on public.skill_groups
  for all using (public.is_admin()) with check (public.is_admin());

create policy "read skills" on public.skills for select using (true);
create policy "admin writes skills" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin manages leads" on public.leads
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manages conversations" on public.chat_conversations
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manages messages" on public.chat_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ─── Storage ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "admin uploads project images" on storage.objects
  for insert with check (bucket_id = 'project-images' and public.is_admin());
create policy "admin updates project images" on storage.objects
  for update using (bucket_id = 'project-images' and public.is_admin());
create policy "admin deletes project images" on storage.objects
  for delete using (bucket_id = 'project-images' and public.is_admin());
