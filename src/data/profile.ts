// Single source of truth for personal details, taken from the CV
// (public/Ismail_Abdul_Kareem.pdf). Used by the About page, structured data,
// llms.txt and the chatbot's system prompt. Projects/services/skills live in Supabase.
import { EMAIL, PHONE, WHATSAPP_URL } from "./site";

export const RESUME_PATH = "/Ismail_Abdul_Kareem.pdf";

export const PROFILE = {
  name: "Ismail Abdul Kareem",
  headline: "Freelance Full-Stack AI Engineer",
  roles: ["AI Engineer", "Full-Stack Web Developer", "Data Science"],
  location: { city: "Karachi", country: "Pakistan", countryCode: "PK" },
  email: EMAIL,
  phone: PHONE,
  github: "https://github.com/IsmailAbdulkareem",
  linkedin: "https://linkedin.com/in/ismail-abdul-kareem-233b302b3",
  x: "https://x.com/IsmailKare63834",
  whatsapp: WHATSAPP_URL,
  responseTime: "I reply within 24 hours, and the first consultation is free.",
  languages: ["English (Professional)", "Urdu (Native)"],
  availability: "Available for freelance projects worldwide (remote).",

  // First-person version of the summary, for the website.
  bio: [
    "I'm Ismail Abdul Kareem, a freelance AI engineer and full-stack developer based in Karachi, Pakistan. I build and deploy AI-powered web applications, automation systems, and client projects across real estate, legal, food-service, and healthcare.",
    "I combine full-stack expertise — Next.js, React, TypeScript, and FastAPI — with AI/LLM engineering using the Claude API, OpenAI Agents SDK, Gemini, LangChain, and RAG pipelines to design AI chatbots, autonomous agents, and end-to-end automation that solve real business problems.",
    "I'm currently expanding into data science through Saylani Mass IT Training (SMIT), building hands-on ML and analysis projects to bring predictive modeling and data-driven decisions into real-world AI products.",
  ],

  summary: [
    "AI Engineer and Full-Stack Developer with hands-on experience building and deploying AI-powered web applications, automation systems, and client projects across real estate, legal, food-service, and healthcare verticals.",
    "Combines Full-Stack expertise (Next.js, React, TypeScript, FastAPI) with AI/LLM engineering (Claude API, OpenAI Agents SDK, Gemini, LangChain, RAG pipelines) to design AI chatbots, autonomous agents, and end-to-end automation systems that solve real business problems for clients.",
    "Currently expanding into Data Science through Saylani Mass IT Training (SMIT), building hands-on ML and analysis projects to bring predictive modeling and data-driven decision-making into real-world AI products.",
  ],

  skillTiers: [
    {
      level: "Strong / hands-on",
      skills: [
        "Next.js", "React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Sanity CMS",
        "OpenAI Agents SDK", "Claude API", "Gemini API", "RAG Pipelines", "REST API Design",
      ],
    },
    {
      level: "Working knowledge",
      skills: [
        "Docker", "Kubernetes", "LangChain", "MCP", "MongoDB", "Supabase", "Kafka", "Dapr",
        "GitHub Actions CI/CD", "Vercel",
      ],
    },
    {
      level: "Data Science (in progress)",
      skills: ["Python", "Pandas", "NumPy", "SQL", "ML Fundamentals"],
    },
  ],

  experience: [
    {
      role: "Freelance AI Engineer & Full-Stack Developer",
      company: "Self-Employed / Freelance",
      location: "Karachi, Pakistan",
      start: "2023-01",
      period: "Jan 2023 – Present",
      highlights: [
        "Delivered 5+ web applications for SMB clients across construction, food-service, healthcare, and personal-branding verticals using Next.js, TypeScript, and Tailwind CSS, integrating Sanity CMS to cut client content-management overhead.",
        "Built and deployed AI chatbot platforms for 3+ client verticals (real estate, restaurant, legal, dental) using the Claude API for natural-language Q&A, automated appointment booking, and lead capture — reducing post-launch support workload through automation.",
        "Engineered AI customer-support agents with Gemini API and OpenAI Agents SDK to handle FAQ resolution, intake forms, and task routing without human agents, reducing client support load.",
        "Shipped 2 agentic AI systems under hackathon deadlines: an event-driven microservices stack (Kafka, Dapr, FastAPI) deployed to Kubernetes with GitHub Actions CI/CD, and a multi-platform browser-automation system using Playwright and MCP.",
        "Improved page performance and Core Web Vitals across client projects via code splitting, lazy loading, and image optimization, improving load speed and organic search visibility.",
      ],
    },
  ],

  education: [
    { title: "AI & Data Science", institution: "Saylani Mass IT Training (SMIT)", period: "In progress, 2026" },
    {
      title: "Agentic Developer Program",
      institution: "Governor Sindh Initiative for GenAI, Web3 & Metaverse",
      period: "Feb 2023 – Present",
    },
    { title: "Google AI Professional Certificate", institution: "Coursera / TechValley Sindh", period: "In progress, 2026" },
    { title: "Intermediate in Commerce", institution: "National College of Business Administration & Economics, Karachi" },
  ],

  // Real figures from the CV, used as highlights.
  facts: [
    { value: "2023", label: "Freelancing since" },
    { value: "5+", label: "Client web applications delivered" },
    { value: "3+", label: "Industries served with AI chatbots" },
    { value: "2", label: "Agentic AI systems shipped at hackathons" },
  ],

  industries: ["Real estate & construction", "Healthcare (dental)", "Legal", "Restaurants & food service", "Personal branding"],
} as const;
