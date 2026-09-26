import { PROFILE, RESUME_PATH } from "@/data/profile";
import { SITE_URL } from "@/data/site";
import type { Project, Service } from "@/lib/types";

// schema.org JSON-LD builders. Stable @ids let pages reference the same Person.
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PROFILE.name,
    jobTitle: PROFILE.headline,
    description: PROFILE.summary[0],
    url: SITE_URL,
    email: `mailto:${PROFILE.email}`,
    telephone: PROFILE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: PROFILE.location.city,
      addressCountry: PROFILE.location.countryCode,
    },
    sameAs: [PROFILE.github, PROFILE.linkedin, PROFILE.x],
    knowsAbout: PROFILE.skillTiers.flatMap((tier) => tier.skills),
    knowsLanguage: ["en", "ur"],
    hasOccupation: {
      "@type": "Occupation",
      name: PROFILE.headline,
      occupationLocation: { "@type": "City", name: PROFILE.location.city },
    },
    alumniOf: PROFILE.education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    subjectOf: { "@type": "DigitalDocument", name: "Résumé", url: `${SITE_URL}${RESUME_PATH}` },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: `${PROFILE.name} — ${PROFILE.headline}`,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

export function servicesSchema(services: Service[]) {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/services#business`,
    name: `${PROFILE.name} — AI & Full-Stack Development`,
    url: `${SITE_URL}/services`,
    founder: { "@id": PERSON_ID },
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressLocality: PROFILE.location.city,
      addressCountry: PROFILE.location.countryCode,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title, description: service.description },
      })),
    },
  };
}

export function projectSchema(project: Project) {
  const url = `${SITE_URL}/projects/${project.slug}`;
  return [
    {
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: project.name,
      description: project.description ?? project.summary,
      url,
      sameAs: [project.url, ...(project.repo_url ? [project.repo_url] : [])],
      keywords: project.technologies.join(", "),
      creator: { "@id": PERSON_ID },
      ...(project.cover_image_url && { image: project.cover_image_url }),
      dateModified: project.updated_at,
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.name, path: `/projects/${project.slug}` },
    ]),
  ];
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
