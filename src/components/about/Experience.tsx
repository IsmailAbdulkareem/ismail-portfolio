import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROFILE } from "@/data/profile";
import { Facts } from "./Facts";

const eyebrow = "font-mono text-[11px] tracking-[0.24em] text-muted uppercase";

export function Experience() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHeading
          label="Experience"
          title="What I've shipped"
          description="Freelance work for real clients, plus the programs I'm training in."
        />
      </Reveal>

      <Reveal>
        <Facts className="mt-16" />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-7">
          {PROFILE.experience.map((job) => (
            <article key={job.role} className="rounded-3xl border border-white/[0.08] bg-surface/60 p-6 sm:p-8">
              <p className="font-mono text-[11px] tracking-[0.24em] text-accent/80 uppercase">{job.period}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{job.role}</h3>
              <p className="mt-1 text-sm text-muted">
                {job.company} · {job.location}
              </p>
              <ul className="mt-6 space-y-4">
                {job.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 leading-relaxed text-fg/80">
                    <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent/70" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="space-y-10 lg:col-span-5">
          <div>
            <h3 className={eyebrow}>Education &amp; training</h3>
            <ol className="mt-5 space-y-5 border-l border-white/[0.08] pl-5">
              {PROFILE.education.map((item) => (
                <li key={item.title} className="relative">
                  <span aria-hidden className="absolute top-2 -left-[23px] size-[7px] rounded-full border border-accent/60 bg-bg" />
                  <p className="font-medium text-fg">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.institution}</p>
                  {"period" in item && <p className="mt-1 font-mono text-[11px] tracking-wide text-accent/70">{item.period}</p>}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className={eyebrow}>Industries served</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PROFILE.industries.map((industry) => (
                <li key={industry} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[13px] text-fg/80">
                  {industry}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={eyebrow}>Languages</h3>
            <p className="mt-4 text-fg/80">{PROFILE.languages.join(" · ")}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
