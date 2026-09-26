import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQS } from "@/data/faq";

// Native <details> accordion: accessible and works without JavaScript.
export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            label="FAQ"
            title="Questions, answered"
            description="Straight answers about working together."
          />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-fg transition-colors hover:text-accent sm:text-lg [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="relative size-3 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                  />
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
