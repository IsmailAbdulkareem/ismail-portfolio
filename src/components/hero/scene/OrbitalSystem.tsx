import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SHELL_RADIUS } from "./FloatingCore";
import { pointer } from "./pointer";

type OrbitNode = { offset: number; speed: number; color: string };

type Ring = {
  radius: number;
  tilt: [number, number, number];
  phase: number;
  precession: number;
  opacity: number;
  nodes: OrbitNode[];
};

// Four nodes in total — AI, web, data, automation — spread across the rings.
const RINGS: Ring[] = [
  {
    radius: 1.4,
    tilt: [1.2, 0, 0.35],
    phase: 0,
    precession: 0.12,
    opacity: 0.22,
    nodes: [{ offset: 0, speed: 0.5, color: "#7dd3fc" }],
  },
  {
    radius: 1.75,
    tilt: [1.05, 0, -0.5],
    phase: 1.1,
    precession: -0.08,
    opacity: 0.15,
    nodes: [
      { offset: 0.6, speed: -0.32, color: "#60a5fa" },
      { offset: 0.6 + Math.PI, speed: -0.32, color: "#e2e8f0" },
    ],
  },
  {
    radius: 2.05,
    tilt: [1.45, 0.2, 0.9],
    phase: 2.3,
    precession: 0.05,
    opacity: 0.1,
    nodes: [{ offset: 1.2, speed: 0.22, color: "#5eead4" }],
  },
];

const nodePosition = new THREE.Vector3();
const linkStart = new THREE.Vector3();

type OrbitalSystemProps = {
  rings: number;
  links: boolean;
  animate: boolean;
};

export function OrbitalSystem({ rings, links, animate }: OrbitalSystemProps) {
  const systemRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const linksRef = useRef<THREE.LineSegments>(null);
  const time = useRef(0);

  const activeRings = RINGS.slice(0, rings);
  const nodes = useMemo(
    () =>
      RINGS.slice(0, rings).flatMap((ring, ringIndex) =>
        ring.nodes.map((node) => ({ ...node, ringIndex, radius: ring.radius })),
      ),
    [rings],
  );
  const linkPositions = useMemo(
    () => new Float32Array(nodes.length * 6),
    [nodes.length],
  );

  useFrame((_, delta) => {
    const system = systemRef.current;
    if (!system) return;
    const dt = Math.min(delta, 0.05);

    if (animate) {
      time.current += dt;
      system.rotation.x = THREE.MathUtils.damp(system.rotation.x, -pointer.y * 0.12, 2.5, dt);
      system.rotation.y = THREE.MathUtils.damp(system.rotation.y, pointer.x * 0.18, 2.5, dt);

      ringRefs.current.forEach((ring, i) => {
        if (ring) ring.rotation.y += activeRings[i].precession * dt;
      });

      nodes.forEach((node, i) => {
        const angle = node.offset + node.speed * time.current;
        nodeRefs.current[i]?.position.set(
          Math.cos(angle) * node.radius,
          Math.sin(angle) * node.radius,
          0,
        );
      });
    }

    // Faint beams from the core's shell to each node.
    const lines = linksRef.current;
    if (!links || !lines) return;
    nodes.forEach((_, i) => {
      const node = nodeRefs.current[i];
      if (!node) return;
      node.getWorldPosition(nodePosition);
      system.worldToLocal(nodePosition);
      linkStart.copy(nodePosition).setLength(SHELL_RADIUS);
      linkStart.toArray(linkPositions, i * 6);
      nodePosition.toArray(linkPositions, i * 6 + 3);
    });
    lines.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={systemRef}>
      {activeRings.map((ring, ringIndex) => (
        <group
          key={ringIndex}
          ref={(element) => {
            ringRefs.current[ringIndex] = element;
          }}
          rotation={[0, ring.phase, 0]}
        >
          <group rotation={ring.tilt}>
            <mesh>
              <torusGeometry args={[ring.radius, 0.005, 6, 200]} />
              <meshBasicMaterial
                color="#8ec5ff"
                transparent
                opacity={ring.opacity}
                depthWrite={false}
              />
            </mesh>

            {nodes.map((node, i) =>
              node.ringIndex === ringIndex ? (
                <group
                  key={i}
                  ref={(element) => {
                    nodeRefs.current[i] = element;
                  }}
                  position={[
                    Math.cos(node.offset) * node.radius,
                    Math.sin(node.offset) * node.radius,
                    0,
                  ]}
                >
                  <mesh>
                    <icosahedronGeometry args={[0.045, 0]} />
                    <meshBasicMaterial color={node.color} toneMapped={false} />
                  </mesh>
                  <mesh>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshBasicMaterial
                      color={node.color}
                      transparent
                      opacity={0.1}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                    />
                  </mesh>
                </group>
              ) : null,
            )}
          </group>
        </group>
      ))}

      {links && (
        <lineSegments ref={linksRef} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#7cc8ff" transparent opacity={0.14} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  );
}
