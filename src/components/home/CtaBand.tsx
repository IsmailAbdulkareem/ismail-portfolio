import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ArrowRight } from "./ArrowRight";

type CtaBandProps = {
  title?: ReactNode;
  description?: string;
};

const DEFAULT_TITLE = (
  <>
    Have a project in mind?
    <br />
    <span className="bg-linear-to-r from-fg via-sky-100 to-sky-300/70 bg-clip-text text-transparent">
      Let&apos;s build it.
    </span>
  </>
);

// Closing call to action shared by the public pages: every page ends on /contact.
export function CtaBand({
  title = DEFAULT_TITLE,
  description = "Tell me what you want to build — a website, an AI assistant, an automation, or something new. I'll reply with next steps.",
}: CtaBandProps) {
  return (
    <Section
      id="start-a-project"
      backdrop={
        <div className="absolute top-1/2 left-1/2 size-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.07),transparent)]" />
      }
    >
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-surface/50 p-6 backdrop-blur-sm sm:p-10 lg:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.025)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_85%_50%,black,transparent_60%)] bg-[size:48px_48px]"
        />
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-accent/90 uppercase sm:tracking-[0.28em]">
              <span className="h-px w-8 bg-accent/60" />
              Start a project
            </p>
            <h2 className="mt-6 text-3xl leading-[1.05] font-semibold tracking-[-0.03em] uppercase sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          </div>
          <Button href="/contact" className="shrink-0 self-start lg:self-auto">
            Start a project
            <ArrowRight />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
