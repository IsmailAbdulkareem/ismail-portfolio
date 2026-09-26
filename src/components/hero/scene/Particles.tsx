import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { pointer } from "./pointer";

// Seeded PRNG so the field is stable across renders and remounts.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A wide, shallow shell around the core that avoids the camera.
function createParticlePositions(count: number) {
  const random = mulberry32(7);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.6 + random() * 6;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * 1.4;
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.8;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.6 - 1;
  }
  return positions;
}

// Soft round sprite so points don't render as squares.
function createDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

type ParticlesProps = {
  count: number;
  animate: boolean;
};

export function Particles({ count, animate }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => createParticlePositions(count), [count]);
  const texture = useMemo(() => createDotTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!animate || !points) return;
    const dt = Math.min(delta, 0.05);

    points.rotation.y += dt * 0.015;
    // Drift opposite the camera for depth parallax.
    points.position.x = THREE.MathUtils.damp(points.position.x, -pointer.x * 0.35, 1.5, dt);
    points.position.y = THREE.MathUtils.damp(points.position.y, -pointer.y * 0.2, 1.5, dt);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.045}
        sizeAttenuation
        color="#9cc7ff"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
