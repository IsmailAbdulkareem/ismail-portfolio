import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Ismail Abdul Kareem — Freelance Full-Stack AI Engineer";
const DESCRIPTION =
  "Freelance Full-Stack AI Engineer building modern web applications, AI-powered products, automation systems, RAG systems, and intelligent digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — Ismail Abdul Kareem" },
  description: DESCRIPTION,
  applicationName: "ISMAIL.DEV",
  authors: [{ name: "Ismail Abdul Kareem", url: SITE_URL }],
  creator: "Ismail Abdul Kareem",
  publisher: "Ismail Abdul Kareem",
  keywords: [
    "Ismail Abdul Kareem",
    "freelance AI engineer",
    "full-stack developer",
    "AI chatbot developer",
    "RAG developer",
    "AI agents",
    "AI automation",
    "Next.js developer",
    "FastAPI developer",
    "Claude API",
    "OpenAI Agents SDK",
    "hire AI engineer",
    "freelance developer Karachi",
    "AI engineer Pakistan",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ISMAIL.DEV",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
