import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Discover",
    description:
      "We talk through the problem, your users, and what success looks like. I come back with a clear scope and a plan.",
  },
  {
    title: "Build",
    description:
      "I design and build the system in small, reviewable steps, sharing progress as it takes shape so feedback lands early.",
  },
  {
    title: "Ship",
    description:
      "The product goes live on solid infrastructure, tested and documented, with a handover you can actually use.",
  },
  {
    title: "Support",
    description:
      "After launch I help with fixes, improvements, and next features, so the system keeps up with the business.",
  },
];

export function Process() {
  return (
    <Section id="process">
      <Reveal>
        <SectionHeading
          label="Process"
          title="How I work"
          description="A simple, transparent process from first conversation to a system in production."
        />
      </Reveal>

      <Reveal className="mt-16 sm:mt-20">
        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-white/[0.08] bg-surface/60 p-6 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.24em] text-accent/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px flex-1 bg-linear-to-r from-accent/40 to-transparent" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] uppercase">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
