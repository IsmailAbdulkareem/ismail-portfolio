import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROFILE } from "@/data/profile";
import { siWhatsapp } from "simple-icons";
import { PHONE, SOCIAL_LINKS, WHATSAPP_CHAT_URL } from "@/data/site";
import { ContactForm } from "./ContactForm";

type ContactProps = {
  as?: "h1" | "h2";
  className?: string;
};

export function Contact({ as, className }: ContactProps) {
  return (
    <Section
      id="contact"
      className={className}
      backdrop={
        <>
          <div className="absolute top-1/2 left-1/2 size-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.08),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.025)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_60%)] bg-[size:72px_72px]" />
        </>
      }
    >
      <Reveal className="grid gap-14 rounded-[2rem] border border-white/[0.08] bg-surface/50 p-6 backdrop-blur-sm sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
        <div className="flex flex-col">
          <SectionHeading
            as={as}
            label="Contact"
            title={
              <>
                Let&apos;s build
                <br />
                <span className="bg-linear-to-r from-fg via-sky-100 to-sky-300/70 bg-clip-text text-transparent">
                  something useful.
                </span>
              </>
            }
            description="Have an idea, business problem, or product you want to build? Let's turn it into something real."
          />

          <a
            href={WHATSAPP_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex h-12 w-full items-center justify-center gap-3 self-start rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-6 text-[15px] font-medium text-fg transition-colors duration-300 hover:border-[#25D366]/60 hover:bg-[#25D366]/20 focus-visible:ring-2 focus-visible:ring-[#25D366]/60 focus-visible:outline-none sm:w-auto"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-5 text-[#25D366]">
              <path d={siWhatsapp.path} />
            </svg>
            Message me on WhatsApp
            <span className="font-mono text-xs text-muted">{PHONE}</span>
          </a>

          <ul className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06] lg:mt-auto">
            {SOCIAL_LINKS.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-mono text-[11px] tracking-[0.24em] text-muted uppercase">
                      {link.label}
                    </span>
                    <span className="flex min-w-0 items-center gap-2 text-sm text-fg/85 transition-colors group-hover:text-accent">
                      <span className="truncate">{link.handle}</span>
                      <ArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-sm text-muted">{PROFILE.responseTime}</p>
        </div>

        <ContactForm />
      </Reveal>
    </Section>
  );
}
