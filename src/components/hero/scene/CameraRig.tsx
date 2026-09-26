import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { pointer } from "./pointer";

export function CameraRig({ animate }: { animate: boolean }) {
  useFrame(({ camera }, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 0.05);
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.3, 2, dt);
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * 0.2, 2, dt);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
