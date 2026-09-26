"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

type ProjectVisualProps = {
  href: string;
  host: string;
  children: ReactNode;
};

const MAX_TILT = 5; // degrees
const spring = { stiffness: 160, damping: 20, mass: 0.6 };

export function ProjectVisual({ href, host, children }: ProjectVisualProps) {
  const reduceMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, spring);
  const rotateY = useSpring(tiltY, spring);
  // The inner art drifts slightly against the tilt for a sense of depth.
  const artX = useTransform(rotateY, (v) => v * -1.2);
  const artY = useTransform(rotateX, (v) => v * 1.2);

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(x * MAX_TILT * 2);
    tiltX.set(-y * MAX_TILT * 2);
  };

  const reset = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", ...spring }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group block overflow-hidden rounded-3xl border border-white/[0.08] bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:border-accent/30"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-white/[0.12]" />
          <span className="size-2 rounded-full bg-white/[0.12]" />
          <span className="size-2 rounded-full bg-white/[0.12]" />
        </div>
        <span className="mx-auto min-w-0 truncate rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-wide text-muted">
          {host}
        </span>
        <span className="w-[42px]" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(ellipse_at_30%_0%,rgb(56_189_248/0.08),transparent_60%)]">
        <motion.div style={{ x: artX, y: artY }} className="absolute -inset-2">
          {children}
        </motion.div>
      </div>
    </motion.a>
  );
}
