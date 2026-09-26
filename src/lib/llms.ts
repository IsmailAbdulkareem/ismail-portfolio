import "server-only";
import { PROFILE, RESUME_PATH } from "@/data/profile";
import { SITE_URL } from "@/data/site";
import { getProjects, getServices, getSkillGroups } from "@/lib/queries";

// Builds /llms.txt (concise index, llmstxt.org format) and /llms-full.txt
// (the complete profile) from the same sources the website renders.

const url = (path: string) => `${SITE_URL}${path}`;

async function loadContent() {
  const [projects, services, skillGroups] = await Promise.all([getProjects(), getServices(), getSkillGroups()]);
  return { projects, services, skillGroups };
}

function header() {
  return [
    `# ${PROFILE.name}`,
    "",
    `> ${PROFILE.headline} based in ${PROFILE.location.city}, ${PROFILE.location.country}. ${PROFILE.summary[0]}`,
    "",
    `${PROFILE.availability} Contact: ${PROFILE.email} · Résumé: ${url(RESUME_PATH)}`,
  ];
}

export async function buildLlmsTxt() {
  const { projects, services } = await loadContent();
  return [
    ...header(),
    "",
    "## Pages",
    `- [About](${url("/about")}): Background, experience, education, and skills.`,
    `- [Projects](${url("/projects")}): Selected work with case studies.`,
    `- [Services](${url("/services")}): What I build for clients.`,
    `- [Contact](${url("/contact")}): Start a project.`,
    `- [Résumé (PDF)](${url(RESUME_PATH)}): Full CV.`,
    `- [Full profile for LLMs](${url("/llms-full.txt")}): Everything on this site in one plain-text file.`,
    "",
    "## Services",
    ...services.map((s) => `- ${s.title}: ${s.description}`),
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.name}](${url(`/projects/${p.slug}`)}): ${p.summary}`),
    "",
    "## Optional",
    `- [GitHub](${PROFILE.github})`,
    `- [LinkedIn](${PROFILE.linkedin})`,
    `- [X](${PROFILE.x})`,
    "",
  ].join("\n");
}

export async function buildLlmsFullTxt() {
  const { projects, services, skillGroups } = await loadContent();
  const lines = [
    ...header(),
    "",
    "## Contact",
    `- Email: ${PROFILE.email}`,
    `- Phone: ${PROFILE.phone}`,
    `- Location: ${PROFILE.location.city}, ${PROFILE.location.country}`,
    `- Website: ${SITE_URL}`,
    `- GitHub: ${PROFILE.github}`,
    `- LinkedIn: ${PROFILE.linkedin}`,
    `- X: ${PROFILE.x}`,
    `- WhatsApp: ${PROFILE.whatsapp}`,
    `- ${PROFILE.responseTime}`,
    `- Contact form: ${url("/contact")}`,
    `- Languages: ${PROFILE.languages.join(", ")}`,
    "",
    "## Summary",
    ...PROFILE.summary.flatMap((p) => [p, ""]),
    "## Experience",
    ...PROFILE.experience.flatMap((job) => [
      `### ${job.role} — ${job.company} (${job.period}, ${job.location})`,
      ...job.highlights.map((h) => `- ${h}`),
      "",
    ]),
    "## Skills",
    ...PROFILE.skillTiers.map((tier) => `- ${tier.level}: ${tier.skills.join(", ")}`),
    ...skillGroups.map((g) => `- ${g.category}: ${g.skills.map((s) => s.name).join(", ")}`),
    "",
    "## Services",
    ...services.flatMap((s) => [`### ${s.title}`, s.description, `Typical flow: ${s.flow.join(" → ")}`, ""]),
    "## Projects",
  ];

  for (const p of projects) {
    lines.push(`### ${p.name}`, `Case study: ${url(`/projects/${p.slug}`)}`, `Live: ${p.url}`);
    if (p.repo_url) lines.push(`Source: ${p.repo_url}`);
    lines.push("", p.description ?? p.summary);
    if (p.features.length) lines.push("", "Features:", ...p.features.map((f) => `- ${f}`));
    if (p.technologies.length) lines.push("", `Technologies: ${p.technologies.join(", ")}`);
    lines.push("");
  }

  lines.push(
    "## Education & training",
    ...PROFILE.education.map((e) => `- ${e.title}, ${e.institution}${"period" in e && e.period ? ` — ${e.period}` : ""}`),
    "",
    "## Industries served",
    ...PROFILE.industries.map((i) => `- ${i}`),
    "",
  );
  return lines.join("\n");
}
