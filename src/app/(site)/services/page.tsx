import type { Metadata } from "next";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/services/Faq";
import { Process } from "@/components/services/Process";
import { Services } from "@/components/services/Services";
import { FAQS } from "@/data/faq";
import { getServices } from "@/lib/queries";
import { faqSchema, servicesSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "AI Chatbot, Automation & Full-Stack Development Services",
  description:
    "Hire a freelance AI engineer for AI-powered websites, AI chatbots, AI automation, and RAG & AI agents — built with Next.js, FastAPI, Claude, OpenAI and Gemini. Free first consultation.",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      <JsonLd data={[servicesSchema(services), faqSchema(FAQS)]} />
      <Services as="h1" services={services} className="pt-32 sm:pt-40" />
      <Process />
      <Faq />
      <CtaBand />
    </main>
  );
}
