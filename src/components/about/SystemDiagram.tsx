const CATEGORIES = ["Frontend", "AI", "Backend", "Data", "Cloud"];

// Pentagon around the centre, in % of the square container.
const NODES = CATEGORIES.map((label, i) => {
  const angle = ((-90 + i * 72) * Math.PI) / 180;
  return {
    label,
    x: 50 + 37 * Math.cos(angle),
    y: 50 + 37 * Math.sin(angle),
  };
});

export function SystemDiagram() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.08),transparent)]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        <circle cx="50" cy="50" r="37" fill="none" stroke="rgb(255 255 255 / 0.06)" vectorEffect="non-scaling-stroke" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="rgb(255 255 255 / 0.04)" vectorEffect="non-scaling-stroke" />
        {NODES.map((node, i) => (
          <g key={node.label}>
            <line x1="50" y1="50" x2={node.x} y2={node.y} stroke="rgb(255 255 255 / 0.08)" vectorEffect="non-scaling-stroke" />
            <line
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke="rgb(86 199 255 / 0.55)"
              strokeDasharray="3 9"
              vectorEffect="non-scaling-stroke"
              className="animate-dash"
              style={{ animationDelay: `${i * -0.3}s` }}
            />
          </g>
        ))}
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent/40" />
        <div className="relative flex size-24 items-center justify-center rounded-full border border-accent/30 bg-surface font-mono text-xs font-medium tracking-[0.2em] text-fg shadow-[0_0_40px_-8px_rgb(56_189_248/0.35)] sm:size-28">
          ISMAIL
        </div>
      </div>

      {NODES.map((node) => (
        <div
          key={node.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.1] bg-surface/90 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase sm:text-[11px]"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}
