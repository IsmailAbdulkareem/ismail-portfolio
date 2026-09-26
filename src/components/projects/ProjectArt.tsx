import Image from "next/image";
import type { Project, ProjectArtKind } from "@/lib/types";

// Abstract compositions hinting at each product's purpose. Deliberately not
// mock screenshots: bars and shapes only, no invented UI copy.

const bar = "rounded-full bg-white/[0.08]";

function Tools() {
  return (
    <div className="grid h-full grid-cols-3 gap-3 p-6 sm:gap-4 sm:p-8">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between rounded-2xl border p-3 sm:p-4 ${
            i === 1
              ? "border-accent/40 bg-accent/[0.06]"
              : "border-white/[0.07] bg-white/[0.02]"
          }`}
        >
          <span
            className={`size-5 rounded-lg sm:size-6 ${i === 1 ? "bg-accent/70" : "bg-white/[0.12]"}`}
          />
          <div className="space-y-1.5">
            <div className={`h-1.5 w-3/4 ${bar}`} />
            <div className={`h-1.5 w-1/2 ${bar}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MapArt() {
  const pins = [
    [22, 34],
    [48, 58],
    [64, 26],
    [36, 74],
    [72, 66],
  ];
  return (
    <div className="flex h-full">
      <div className="relative flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <path d="M-5 70 C 25 60, 40 85, 70 55 S 100 30, 105 35" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <path d="M30 -5 C 35 30, 20 60, 45 105" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M-5 25 L 105 40" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {pins.map(([x, y], i) => (
          <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/30" style={{ animationDelay: `${i * 0.6}s` }} />
            <span className="relative block size-2.5 rounded-full border border-accent/80 bg-accent/40" />
          </span>
        ))}
      </div>
      <div className="w-[38%] space-y-2.5 border-l border-white/[0.06] bg-black/20 p-4 sm:p-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] p-2.5">
            <span className="size-2 shrink-0 rounded-full bg-accent/60" />
            <div className="flex-1 space-y-1.5">
              <div className={`h-1.5 w-4/5 ${bar}`} />
              <div className="h-1 w-1/2 rounded-full bg-white/[0.05]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="flex h-full gap-4 p-6 sm:p-8">
      <div className="flex flex-1 flex-col justify-end gap-3">
        <div className="max-w-[70%] self-start rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.03] p-3">
          <div className={`h-1.5 w-28 ${bar}`} />
          <div className={`mt-1.5 h-1.5 w-16 ${bar}`} />
        </div>
        <div className="max-w-[70%] self-end rounded-2xl rounded-br-md border border-accent/30 bg-accent/[0.07] p-3">
          <div className="h-1.5 w-32 rounded-full bg-accent/40" />
          <div className="mt-1.5 h-1.5 w-24 rounded-full bg-accent/25" />
          <div className="mt-1.5 h-1.5 w-12 rounded-full bg-accent/25" />
        </div>
        <div className="max-w-[70%] self-start rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.03] p-3">
          <div className={`h-1.5 w-20 ${bar}`} />
        </div>
        <div className="mt-2 h-9 rounded-full border border-white/[0.07] bg-white/[0.02]" />
      </div>
      <div className="hidden w-[34%] rounded-2xl border border-white/[0.07] bg-black/20 p-3 sm:block">
        <div className={`h-1.5 w-1/2 ${bar}`} />
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className={`aspect-square rounded-md ${
                i === 9 ? "border border-accent/60 bg-accent/30" : "bg-white/[0.04]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Blueprint() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 bg-[linear-gradient(rgb(86_199_255/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(86_199_255/0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <svg viewBox="0 0 200 125" className="absolute inset-0 size-full p-6 sm:p-10">
        <g fill="none" stroke="rgb(86 199 255 / 0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M30 110 V55 L70 30 L110 55 V110 Z" />
          <path d="M110 110 V45 H165 V110" />
          <path d="M50 110 V80 H70 V110 M125 60 H150 V78 H125 Z M125 88 H150 V106 H125 Z M85 65 H100 V80 H85 Z" />
        </g>
        <g stroke="rgb(255 255 255 / 0.18)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M20 118 H175 M20 114 V122 M175 114 V122" />
          <path d="M180 45 V110 M176 45 H184 M176 110 H184" />
        </g>
      </svg>
    </div>
  );
}

function Book() {
  return (
    <div className="flex h-full">
      <div className="w-[28%] space-y-3 border-r border-white/[0.06] bg-black/20 p-4 sm:p-5">
        {[70, 55, 80, 45, 65, 50].map((w, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full ${i === 2 ? "bg-accent/50" : "bg-white/[0.07]"}`}
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="flex-1 space-y-3 p-5 sm:p-7">
        <div className="h-3 w-2/5 rounded-full bg-white/[0.14]" />
        <div className={`h-1.5 w-full ${bar}`} />
        <div className={`h-1.5 w-11/12 ${bar}`} />
        <div className={`h-1.5 w-4/5 ${bar}`} />
        <div className="mt-4 space-y-2 rounded-xl border border-white/[0.07] bg-black/30 p-4 font-mono">
          <div className="h-1.5 w-1/3 rounded-full bg-accent/40" />
          <div className="ml-4 h-1.5 w-1/2 rounded-full bg-white/[0.1]" />
          <div className="ml-4 h-1.5 w-2/5 rounded-full bg-white/[0.1]" />
          <div className="h-1.5 w-1/4 rounded-full bg-accent/40" />
        </div>
      </div>
    </div>
  );
}

function Tasks() {
  const rows = [true, true, false, true, false];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-8 sm:px-14">
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-3/5 rounded-full bg-accent/60" />
      </div>
      {rows.map((done, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
          <span
            className={`flex size-4 shrink-0 items-center justify-center rounded-[5px] border ${
              done ? "border-accent/60 bg-accent/25" : "border-white/20"
            }`}
          >
            {done && <span className="size-1.5 rounded-[2px] bg-accent" />}
          </span>
          <div
            className={`h-1.5 rounded-full ${done ? "bg-white/[0.06]" : "bg-white/[0.12]"}`}
            style={{ width: `${[60, 45, 70, 38, 55][i]}%` }}
          />
        </div>
      ))}
    </div>
  );
}

const ART = {
  tools: Tools,
  map: MapArt,
  chat: Chat,
  blueprint: Blueprint,
  book: Book,
  tasks: Tasks,
} satisfies Record<ProjectArtKind, () => React.JSX.Element>;

type ProjectArtProps = {
  project: Pick<Project, "name" | "art_kind" | "cover_image_url">;
  // Rendered width hint for the cover image; defaults to the editorial card column.
  sizes?: string;
  preload?: boolean;
};

// A real cover image wins; otherwise the project's abstract art, then a generic one.
export function ProjectArt({
  project,
  sizes = "(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw",
  preload,
}: ProjectArtProps) {
  if (project.cover_image_url) {
    return (
      <Image
        src={project.cover_image_url}
        alt={`${project.name} preview`}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    );
  }
  const Art = ART[project.art_kind ?? "tools"];
  return <Art />;
}
