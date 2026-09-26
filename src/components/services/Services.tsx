import { Fragment, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

// Vertical stage diagram; the connector pulses only while the card is hovered.
function FlowDiagram({ flow, core }: Pick<Service, "flow" | "core">) {
  return (
    <div aria-hidden className="flex flex-col items-center">
      {flow.map((stage, i) => (
        <Fragment key={stage}>
          {i > 0 && (
            <div className="relative h-5 w-px bg-white/10">
              <span
                className="absolute left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent opacity-0 group-hover:animate-travel"
                style={{ animationDelay: `${(i - 1) * 0.35}s` }}
              />
            </div>
          )}
          <span
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-500",
              i === core
                ? "border-accent/40 bg-accent/[0.08] text-accent group-hover:border-accent/70"
                : "border-white/[0.1] text-muted group-hover:text-fg/80",
            )}
          >
            {stage}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

type ServicesProps = {
  services: Service[];
  as?: "h1" | "h2";
  className?: string;
  // Rendered below the grid, e.g. a link to /services on the home page.
  children?: ReactNode;
};

export function Services({ services, as, className, children }: ServicesProps) {
  return (
    <Section
      id="services"
      className={className}
      backdrop={
        <div className="absolute top-1/2 right-[-15%] size-[40rem] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.05),transparent)]" />
      }
    >
      <Reveal>
        <SectionHeading
          as={as}
          label="Services"
          title="What I build"
          description="I turn ideas and business problems into practical software and AI systems."
        />
      </Reveal>

      <Reveal className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, i) => (
          <article
            key={service.id}
            className="group flex flex-col rounded-3xl border border-white/[0.08] bg-surface/60 p-6 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1 hover:border-accent/25 hover:bg-surface sm:p-7"
          >
            <span className="font-mono text-[11px] tracking-[0.24em] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] uppercase">
              {service.title}
            </h3>

            <div className="my-8 flex h-48 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.01] py-6">
              <FlowDiagram flow={service.flow} core={service.core} />
            </div>

            <p className="text-[15px] leading-relaxed text-muted transition-colors duration-500 group-hover:text-fg/85">
              {service.description}
            </p>
          </article>
        ))}
      </Reveal>

      {children}
    </Section>
  );
}
