"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// WebGL is client-only; keep three.js out of the server bundle and initial JS.
const SceneCanvas = dynamic(
  () => import("./scene/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false },
);

export function HeroScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Stop the render loop while the hero is scrolled out of view.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none animate-fade [animation-delay:300ms]",
        className,
      )}
    >
      <SceneCanvas active={inView} />
    </div>
  );
}
