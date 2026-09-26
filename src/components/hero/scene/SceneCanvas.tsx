import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useState } from "react";
import { CameraRig } from "./CameraRig";
import { FloatingCore } from "./FloatingCore";
import { OrbitalSystem } from "./OrbitalSystem";
import { Particles } from "./Particles";
import { pointer } from "./pointer";
import { getQuality } from "./quality";

// Loaded with ssr: false, so window is available during the first render.
export function SceneCanvas({ active }: { active: boolean }) {
  const [quality] = useState(getQuality);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [maxDpr, setMaxDpr] = useState(quality.maxDpr);
  const animate = !reducedMotion;

  useEffect(() => {
    if (!animate) return;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      pointer.x = 0;
      pointer.y = 0;
    };
  }, [animate]);

  // Reduced motion renders a single static frame on demand.
  const frameloop = !active ? "never" : animate ? "always" : "demand";

  return (
    <Canvas
      // Absolute so it fills flex-sized wrappers that have no definite height.
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 8.5], fov: 35, near: 0.1, far: 50 }}
      dpr={[1, maxDpr]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={frameloop}
      fallback={null}
    >
      {animate && <PerformanceMonitor onDecline={() => setMaxDpr(1)} />}

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} />
      <pointLight position={[-3, -1.5, 2.5]} color="#38bdf8" intensity={12} />

      {/* Procedural studio reflections for the metallic core — no HDR download. */}
      <Environment resolution={quality.envResolution} frames={1}>
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 4, -2]} scale={[8, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#38bdf8" position={[-5, 0, 1]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#7dd3fc" position={[4, -2, 3]} scale={2} />
      </Environment>

      <CameraRig animate={animate} />
      <group scale={quality.scale}>
        <FloatingCore detail={quality.coreDetail} animate={animate} />
        <OrbitalSystem rings={quality.rings} links={quality.links} animate={animate} />
      </group>
      <Particles count={quality.particles} animate={animate} />
    </Canvas>
  );
}
