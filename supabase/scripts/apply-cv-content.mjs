// Adds the CV's project details and skills to Supabase. Idempotent: projects
// upsert on slug, skills are only added when missing. Content editors can keep
// changing everything afterwards in /admin.
//
//   node --env-file=.env.local supabase/scripts/apply-cv-content.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

// Source: public/Ismail_Abdul_Kareem.pdf, verified GitHub repos, and the
// previous portfolio (Mustafa Builder and Developer).
const projects = [
  {
    slug: "dental-clinic-ai",
    description:
      "AI-powered dental clinic platform featuring a conversational AI chatbot and automated appointment-booking workflow, built to improve patient lead engagement and streamline front-desk scheduling for healthcare clients.",
    features: ["Conversational AI chatbot", "Automated appointment booking", "Patient lead capture"],
    featured: true,
    sort_order: 1,
  },
  {
    slug: "google-maps-lead-generator",
    description:
      "AI-assisted lead-generation tool built with Google Maps API integration to discover, filter, and export local business leads — combining web development and API engineering to automate a manual prospecting workflow.",
    featured: true,
    sort_order: 2,
  },
  {
    slug: "ai-chatbot-website-platform",
    name: "AI Chatbot Website Platform",
    summary:
      "SaaS-style, multi-tenant chatbot platform for SMBs across real estate, restaurants, and law firms — covering UI, RAG pipeline, LLM integration, and payment/subscription handling.",
    url: "https://buildwithismail.xyz/",
    repo_url: "https://github.com/IsmailAbdulkareem/ISMAIL_AI_PORTFOLIO",
    technologies: ["Next.js", "Claude API", "RAG", "Stripe"],
    features: ["Multi-tenant chatbot platform", "RAG pipeline & LLM integration", "Stripe payments & subscriptions", "Built for real estate, restaurants & law firms"],
    art_kind: "chat",
    featured: true,
    sort_order: 3,
  },
  {
    slug: "personal-ai-employee",
    name: "Personal AI Employee",
    summary:
      "Autonomous social-media AI agent that posts to LinkedIn and WhatsApp unattended, with multi-platform watchers and a vault-based task-queue architecture.",
    description:
      "Autonomous social-media AI agent (Python, OpenAI Agents SDK, Playwright, MCP) that posts to LinkedIn and WhatsApp unattended, with multi-platform watchers and a vault-based task-queue architecture.\n\nThe Gold Tier is an advanced autonomous AI Employee system built with structured agent skills, workflow orchestration, and production-ready automation — designed to operate like a real digital team member, not just a prompt-based assistant.",
    url: "https://github.com/IsmailAbdulkareem/Personal_AI_Employee_Gold_Tier",
    repo_url: "https://github.com/IsmailAbdulkareem/Personal_AI_Employee_Gold_Tier",
    technologies: ["Python", "OpenAI Agents SDK", "Playwright", "MCP"],
    features: ["Posts to LinkedIn & WhatsApp unattended", "Multi-platform watchers", "Vault-based task queue", "Structured agent skills"],
    art_kind: "tasks",
    featured: false,
    sort_order: 4,
  },
  {
    slug: "murtaza-builders",
    summary:
      "Real estate & construction website developed for a live client — full-stack build, animated property/listing showcase, and responsive UI/UX designed to drive inbound leads for a home-sales business.",
    features: ["Animated property & listing showcase", "Responsive UI/UX", "Built to drive inbound leads"],
    featured: false,
    sort_order: 5,
  },
  { slug: "speedtoolshub", featured: false, sort_order: 6 },
  {
    slug: "mustafa-builder-and-developer",
    name: "Mustafa Builder and Developer",
    summary:
      "Construction company website where visitors can explore services, view projects, and submit inquiries — with a responsive design and user-friendly interface.",
    description:
      "As a full-stack developer, I contributed to this construction company website over two months. The platform lets visitors explore services, view projects, and submit inquiries, with a responsive design and user-friendly interface.",
    url: "https://www.mustafabuilderanddeveloper.com.pk/",
    repo_url: "https://github.com/IsmailAbdulkareem/MCB",
    technologies: ["React", "Next.js", "MongoDB", "Tailwind CSS"],
    features: ["Services & project showcase", "Inquiry form", "Responsive design"],
    art_kind: "blueprint",
    featured: false,
    sort_order: 7,
  },
  { slug: "ai-native-book", sort_order: 8 },
  { slug: "hackathon-todo", sort_order: 9 },
];

// Skills from the CV that the site doesn't list yet, with simple-icons slugs.
const skills = {
  AI: [["OpenAI Agents SDK", null], ["MCP", "modelcontextprotocol"]],
  Backend: [["MongoDB", "mongodb"], ["Sanity CMS", "sanity"], ["Kafka", "apachekafka"], ["Dapr", "dapr"]],
  Infrastructure: [["GitHub Actions", "githubactions"]],
  "Data Science": [["Pandas", "pandas"], ["NumPy", "numpy"], ["SQL", null], ["ML Fundamentals", null], ["Jupyter", "jupyter"]],
};

for (const { slug, ...fields } of projects) {
  const { data: existing } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
  const { error } = existing
    ? await supabase.from("projects").update(fields).eq("id", existing.id)
    : await supabase.from("projects").insert({ slug, published: true, ...fields });
  console.log(existing ? "updated" : "inserted", slug, error ? `ERROR ${error.message}` : "");
}

const { data: groups } = await supabase.from("skill_groups").select("id, category, sort_order, skills(name)");
for (const [category, entries] of Object.entries(skills)) {
  let group = groups.find((g) => g.category === category);
  if (!group) {
    const next = Math.max(0, ...groups.map((g) => g.sort_order)) + 1;
    const { data, error } = await supabase.from("skill_groups").insert({ category, sort_order: next }).select().single();
    if (error) throw error;
    group = { ...data, skills: [] };
    groups.push(group);
    console.log("added group", category);
  }
  const have = new Set(group.skills.map((s) => s.name));
  const missing = entries.filter(([name]) => !have.has(name));
  if (!missing.length) continue;
  const start = group.skills.length + 1;
  const { error } = await supabase.from("skills").insert(
    missing.map(([name, icon_slug], i) => ({ group_id: group.id, name, icon_slug, sort_order: start + i })),
  );
  console.log(`added to ${category}:`, missing.map(([n]) => n).join(", "), error ? `ERROR ${error.message}` : "");
}
