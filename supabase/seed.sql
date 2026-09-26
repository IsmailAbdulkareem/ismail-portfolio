-- Initial content, taken from the site's previous hard-coded data.
-- Safe to run once after 0001_init.sql.

insert into public.projects
  (slug, name, summary, url, repo_url, technologies, features, art_kind, featured, sort_order)
values
  ('speedtoolshub', 'SpeedToolsHub',
   'A collection of fast browser-based productivity and utility tools designed to solve small everyday problems without unnecessary friction.',
   'https://speedtoolshub.com/', null,
   '{Next.js,TypeScript,Tailwind CSS,Vercel}', '{}', 'tools', true, 1),
  ('google-maps-lead-generator', 'Google Maps Lead Generator',
   'A lead-generation platform that helps businesses discover potential customers from Google Maps and export structured lead data for outreach.',
   'https://google-maps-lead-generator.vercel.app/',
   'https://github.com/IsmailAbdulkareem/google-maps-lead-generator',
   '{Next.js,TypeScript,Google Places API,Vercel}',
   '{Google Places API,Lead extraction,Website filtering,"CSV, PDF, Word & JSON export"}',
   'map', true, 2),
  ('dental-clinic-ai', 'Dental Clinic AI',
   'An AI-powered dental clinic assistant concept for patient interaction, appointment booking, and lead capture.',
   'https://dental-clinic-ai-iota.vercel.app/',
   'https://github.com/IsmailAbdulkareem/dental-clinic-ai',
   '{AI,Next.js,Groq,Supabase}', '{}', 'chat', true, 3),
  ('murtaza-builders', 'Murtaza Builders',
   'A modern business website built for a real-world construction company use case.',
   'https://murtaza-builders.vercel.app/', null,
   '{Next.js,TypeScript,Tailwind CSS,Vercel}', '{}', 'blueprint', false, 4),
  ('ai-native-book', 'AI Native Book',
   'An AI-native learning project exploring modern AI-assisted software development workflows and agentic development.',
   'https://ismailabdulkareem.github.io/AI_Book/',
   'https://github.com/IsmailAbdulkareem/AI_Book',
   '{Docusaurus,AI,Claude,Spec-driven development}', '{}', 'book', false, 5),
  ('hackathon-todo', 'Hackathon Todo',
   'A full-stack task management project exploring authentication, APIs, databases, and modern frontend/backend architecture.',
   'https://hackathon-ii-todo-cli.vercel.app/', null,
   '{Next.js,FastAPI,SQLModel,Neon,Better Auth}', '{}', 'tasks', false, 6);

insert into public.services (title, description, flow, core, sort_order) values
  ('AI-Powered Websites',
   'Modern websites enhanced with AI features, intelligent interactions, and automation.',
   '{Visitor,Website,AI Layer}', 2, 1),
  ('AI Chatbots',
   'AI assistants for websites and businesses that can answer questions, qualify leads, and help customers.',
   '{User,AI,Business}', 1, 2),
  ('AI Automation',
   'Automated workflows that connect APIs, AI models, databases, and business processes.',
   '{Trigger,AI + APIs,Action}', 1, 3),
  ('RAG & AI Agents',
   'Knowledge-aware AI systems using retrieval, tools, APIs, and agentic workflows.',
   '{Question,Retrieval,Agent,Answer}', 2, 4);

with groups as (
  insert into public.skill_groups (category, sort_order) values
    ('Frontend', 1), ('AI', 2), ('Backend', 3), ('Infrastructure', 4)
  returning id, category
)
insert into public.skills (group_id, name, icon_slug, sort_order)
select g.id, s.name, s.icon_slug, s.sort_order
from groups g
join (values
  ('Frontend', 'Next.js', 'nextdotjs', 1),
  ('Frontend', 'React', 'react', 2),
  ('Frontend', 'TypeScript', 'typescript', 3),
  ('Frontend', 'JavaScript', 'javascript', 4),
  ('Frontend', 'Tailwind CSS', 'tailwindcss', 5),
  ('Frontend', 'Three.js', 'threedotjs', 6),
  ('AI', 'OpenAI', null, 1),
  ('AI', 'Claude', 'claude', 2),
  ('AI', 'Gemini', 'googlegemini', 3),
  ('AI', 'Groq', null, 4),
  ('AI', 'AI Agents', null, 5),
  ('AI', 'RAG', null, 6),
  ('AI', 'LangChain', 'langchain', 7),
  ('Backend', 'Python', 'python', 1),
  ('Backend', 'FastAPI', 'fastapi', 2),
  ('Backend', 'SQLModel', null, 3),
  ('Backend', 'Supabase', 'supabase', 4),
  ('Backend', 'PostgreSQL', 'postgresql', 5),
  ('Backend', 'REST APIs', null, 6),
  ('Infrastructure', 'Docker', 'docker', 1),
  ('Infrastructure', 'Kubernetes', 'kubernetes', 2),
  ('Infrastructure', 'Vercel', 'vercel', 3),
  ('Infrastructure', 'Git', 'git', 4),
  ('Infrastructure', 'GitHub', 'github', 5)
) as s (category, name, icon_slug, sort_order) on s.category = g.category;
