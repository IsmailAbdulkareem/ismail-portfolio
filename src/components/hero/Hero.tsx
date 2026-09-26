import { Button } from "@/components/ui/Button";
import { RESUME_PATH } from "@/data/profile";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 lg:justify-center lg:pt-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-[-12%] size-[52rem] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.09),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.025)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_65%)] bg-[size:72px_72px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-xl lg:max-w-[40rem]">
          <p className="flex animate-rise items-center gap-3 font-mono text-[11px] tracking-[0.2em] sm:tracking-[0.28em] text-accent/90 uppercase">
            <span className="h-px w-8 bg-accent/60" />
            Freelance Full-Stack AI Engineer
          </p>

          <h1 className="mt-6 animate-rise text-[2.125rem] leading-[1.04] font-semibold tracking-[-0.035em] uppercase [animation-delay:100ms] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]">
            <span className="block">Building intelligent</span>
            <span className="block bg-linear-to-r from-fg via-sky-100 to-sky-300/70 bg-clip-text text-transparent">
              digital experiences.
            </span>
          </h1>

          <p className="mt-6 max-w-md animate-rise text-base leading-relaxed text-muted [animation-delay:200ms] sm:text-lg">
            I build modern web applications, AI-powered products, automation
            systems, and intelligent experiences that solve real-world
            problems.
          </p>

          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:300ms]">
            <Button href="/projects">
              View My Work
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                fill="none"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M3 8h10m0 0L9 4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            <Button href="/contact" variant="secondary">
              Let&apos;s Talk
            </Button>
          </div>

          <a
            href={RESUME_PATH}
            download="Ismail_Abdul_Kareem_CV.pdf"
            className="mt-6 inline-flex animate-rise items-center gap-2 text-sm text-muted transition-colors [animation-delay:400ms] hover:text-fg"
          >
            Download CV
            <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-3.5">
              <path d="M8 3v8m0 0 3.5-3.5M8 11 4.5 7.5M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <HeroScene className="relative min-h-[360px] w-full flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent,black_30%)] xl:w-[60%] 2xl:w-[62%]" />
    </section>
  );
}
