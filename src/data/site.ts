// Canonical origin for metadata, sitemap, structured data and llms.txt.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://buildwithismail.xyz").replace(/\/$/, "");

export const EMAIL = "ismail233290@gmail.com";

// Mobile / WhatsApp for direct contact (0327 9671138).
export const PHONE = "+92 327 9671138";
export const PHONE_TEL = "+923279671138";
export const WHATSAPP_URL = "https://wa.me/923279671138";
// Opens WhatsApp with a ready-to-send first message.
export const WHATSAPP_CHAT_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hi Ismail, I found your portfolio and I'd like to talk about a project.",
)}`;

export const SOCIAL_LINKS = [
  { label: "Email", href: `mailto:${EMAIL}`, handle: EMAIL },
  { label: "WhatsApp", href: WHATSAPP_CHAT_URL, handle: PHONE },
  { label: "Phone", href: `tel:${PHONE_TEL}`, handle: PHONE },
  { label: "LinkedIn", href: "https://linkedin.com/in/ismail-abdul-kareem-233b302b3", handle: "ismail-abdul-kareem" },
  { label: "GitHub", href: "https://github.com/IsmailAbdulkareem/", handle: "IsmailAbdulkareem" },
  { label: "X", href: "https://x.com/IsmailKare63834", handle: "@IsmailKare63834" },
];

export const PAGE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];
