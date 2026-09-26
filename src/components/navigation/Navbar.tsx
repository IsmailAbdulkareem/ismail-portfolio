"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PAGE_LINKS } from "@/data/site";
import { cn } from "@/lib/utils";

const NAV_LINKS = [{ label: "Home", href: "/" }, ...PAGE_LINKS];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const elevated = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-500",
          elevated
            ? "border-white/[0.08] bg-surface/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="font-mono text-[13px] font-medium tracking-[0.18em] text-fg"
        >
          ISMAIL<span className="text-muted">.DEV</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors duration-300 hover:text-fg",
                  isActive(pathname, link.href) ? "text-fg" : "text-muted",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button href="/contact" size="sm" className="max-sm:hidden">
            Let&apos;s Talk
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="relative flex size-10 items-center justify-center rounded-full text-fg transition-colors hover:bg-white/[0.05] lg:hidden"
          >
            <span
              className={cn(
                "absolute h-px w-4 bg-current transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-[3px]",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-4 bg-current transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-[3px]",
              )}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl border border-white/[0.08] bg-surface/90 p-2 backdrop-blur-xl lg:hidden"
          >
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-[15px] transition-colors hover:bg-white/[0.04] hover:text-fg",
                      isActive(pathname, link.href) ? "text-fg" : "text-muted",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 w-full sm:hidden"
            >
              Let&apos;s Talk
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
