"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/chats", label: "Chats" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/skills", label: "Skills" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

// Horizontal scroller on mobile, vertical list in the desktop sidebar.
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="overflow-x-auto md:overflow-visible">
      <ul className="flex gap-1 px-3 pb-2 md:flex-col md:gap-0.5 md:px-3 md:pb-0">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center rounded-lg px-3 text-sm whitespace-nowrap transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:outline-none",
                  active ? "bg-white/[0.07] text-fg" : "text-muted hover:bg-white/[0.04] hover:text-fg",
                )}
              >
                {active ? <span aria-hidden className="mr-2 hidden size-1 rounded-full bg-accent md:block" /> : null}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
