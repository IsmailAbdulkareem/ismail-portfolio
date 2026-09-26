import type { Metadata } from "next";
import { About } from "@/components/about/About";
import { Experience } from "@/components/about/Experience";
import { CtaBand } from "@/components/home/CtaBand";
import { getSkillGroups } from "@/lib/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Freelance AI engineer and full-stack developer in Karachi, Pakistan, freelancing since 2023: 5+ client web apps and AI chatbots with the Claude API, OpenAI Agents SDK, Gemini, LangChain and RAG.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const skillGroups = await getSkillGroups();

  return (
    <main>
      <About as="h1" skillGroups={skillGroups} className="pt-32 sm:pt-40" />
      <Experience />
      <CtaBand />
    </main>
  );
}
