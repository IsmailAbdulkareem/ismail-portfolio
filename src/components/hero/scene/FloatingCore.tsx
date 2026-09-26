import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { pointer } from "./pointer";

const CORE_RADIUS = 0.82;
export const SHELL_RADIUS = CORE_RADIUS * 1.22;

// Icosahedron whose faces are each shrunk toward their centroid, leaving thin
// seams through which the emissive inner core shows.
function createFacetGeometry(radius: number, detail: number, inset: number) {
  const base = new THREE.IcosahedronGeometry(radius, detail);
  const positions = Float32Array.from(base.attributes.position.array);
  base.dispose();

  for (let i = 0; i < positions.length; i += 9) {
    for (let axis = 0; axis < 3; axis++) {
      const centroid =
        (positions[i + axis] + positions[i + 3 + axis] + positions[i + 6 + axis]) / 3;
      for (let vertex = 0; vertex < 9; vertex += 3) {
        const index = i + vertex + axis;
        positions[index] = centroid + (positions[index] - centroid) * inset;
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals(); // non-indexed, so normals stay flat per face
  return geometry;
}

type FloatingCoreProps = {
  detail: number;
  animate: boolean;
};

export function FloatingCore({ detail, animate }: FloatingCoreProps) {
  const tiltRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.LineSegments>(null);
  const time = useRef(0);

  const facets = useMemo(
    () => createFacetGeometry(CORE_RADIUS, detail, 0.95),
    [detail],
  );
  const edges = useMemo(() => {
    const shell = new THREE.IcosahedronGeometry(SHELL_RADIUS, detail);
    const geometry = new THREE.EdgesGeometry(shell);
    shell.dispose();
    return geometry;
  }, [detail]);

  useEffect(
    () => () => {
      facets.dispose();
      edges.dispose();
    },
    [facets, edges],
  );

  useFrame((_, delta) => {
    const tilt = tiltRef.current;
    const body = bodyRef.current;
    const shell = shellRef.current;
    if (!animate || !tilt || !body || !shell) return;

    const dt = Math.min(delta, 0.05);
    time.current += dt;

    body.rotation.y += dt * 0.14;
    body.rotation.x += dt * 0.05;
    shell.rotation.y -= dt * 0.06;
    shell.rotation.z += dt * 0.03;

    tilt.rotation.x = THREE.MathUtils.damp(tilt.rotation.x, -pointer.y * 0.22, 3, dt);
    tilt.rotation.y = THREE.MathUtils.damp(tilt.rotation.y, pointer.x * 0.32, 3, dt);
    tilt.position.y = Math.sin(time.current * 0.6) * 0.06;
  });

  return (
    <group ref={tiltRef}>
      <group ref={bodyRef} rotation={[0.35, 0.4, 0]}>
        <mesh geometry={facets}>
          <meshStandardMaterial color="#161c26" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[CORE_RADIUS * 0.8, detail]} />
          <meshBasicMaterial color="#2a8fd6" toneMapped={false} />
        </mesh>
      </group>
      <lineSegments ref={shellRef} geometry={edges}>
        <lineBasicMaterial color="#7cc8ff" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  );
}
