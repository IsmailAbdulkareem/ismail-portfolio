import { Button } from "@/components/ui/Button";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { Reveal } from "@/components/ui/Reveal";
import { PROFILE } from "@/data/profile";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SkillGroup } from "@/lib/types";
import { ABOUT_TITLE } from "./AboutTitle";
import { Skills } from "./Skills";
import { SystemDiagram } from "./SystemDiagram";

const APPROACH = ["Understand the problem.", "Build the system.", "Ship the solution."];

type AboutProps = {
  skillGroups: SkillGroup[];
  as?: "h1" | "h2";
  className?: string;
};

export function About({ skillGroups, as, className }: AboutProps) {
  return (
    <Section
      id="about"
      className={className}
      backdrop={
        <div className="absolute top-1/3 left-[-15%] size-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.05),transparent)]" />
      }
    >
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <SectionHeading as={as} label="About" title={ABOUT_TITLE} />
          <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {PROFILE.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-fg/90">My approach is simple:</p>
          </div>
          <ol className="mt-5 space-y-3">
            {APPROACH.map((step, i) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent/80">
                  0{i + 1}
                </span>
                <span className="text-lg font-medium tracking-tight text-fg">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact">Start a project</Button>
            <ResumeLink />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SystemDiagram />
        </Reveal>
      </div>

      {skillGroups.length > 0 && (
        <Reveal className="mt-24">
          <p className="mb-6 font-mono text-[11px] tracking-[0.24em] text-muted uppercase">
            Toolkit
          </p>
          <Skills groups={skillGroups} />
        </Reveal>
      )}
    </Section>
  );
}
