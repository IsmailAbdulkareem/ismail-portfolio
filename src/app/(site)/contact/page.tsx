import type { Metadata } from "next";
import { Contact } from "@/components/contact/Contact";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description:
    "Start a project with Ismail Abdul Kareem — tell me about your idea, business problem, or product and I'll get back to you.",
};

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <main>
      <Contact as="h1" className="pt-32 sm:pt-40" />
    </main>
  );
}
