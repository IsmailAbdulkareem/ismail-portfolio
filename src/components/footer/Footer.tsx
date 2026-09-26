import Link from "next/link";
import { RESUME_PATH } from "@/data/profile";
import { PAGE_LINKS, SOCIAL_LINKS } from "@/data/site";

const linkClass = "text-sm text-muted transition-colors hover:text-fg";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 sm:grid-cols-3 lg:px-10">
        <div>
          <Link href="/" className="font-mono text-[13px] font-medium tracking-[0.18em] text-fg">
            ISMAIL<span className="text-muted">.DEV</span>
          </Link>
          <p className="mt-4 text-sm text-muted">Freelance Full-Stack AI Engineer</p>
          <p className="mt-1 text-sm text-muted/70">Karachi, Pakistan · Available worldwide</p>
          <a href={RESUME_PATH} download="Ismail_Abdul_Kareem_CV.pdf" className={`mt-5 inline-block ${linkClass}`}>
            Download CV ↓
          </a>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-3">
            {PAGE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="space-y-3">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                className={linkClass}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <p className="border-t border-white/[0.06] py-6 text-xs text-muted/70">
          © {new Date().getFullYear()} Ismail Abdul Kareem
        </p>
      </div>
    </footer>
  );
}
