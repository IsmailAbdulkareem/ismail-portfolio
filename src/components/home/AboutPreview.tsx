import { ABOUT_TITLE } from "@/components/about/AboutTitle";
import { Facts } from "@/components/about/Facts";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROFILE } from "@/data/profile";
import { ArrowRight } from "./ArrowRight";

export function AboutPreview() {
  return (
    <Section
      id="about"
      backdrop={
        <div className="absolute top-1/3 left-[-15%] size-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.05),transparent)]" />
      }
    >
      <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-12">
        <SectionHeading label="About" title={ABOUT_TITLE} />
        <div className="max-w-xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
          {PROFILE.bio.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="flex flex-wrap gap-3 pt-3">
            <Button href="/about" variant="secondary">
              More about me
              <ArrowRight />
            </Button>
            <ResumeLink />
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <Facts className="mt-16" />
      </Reveal>
    </Section>
  );
}
