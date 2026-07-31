import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const COUNT = 24;
const LIFE_MS = 500;

/**
 * BreathParticles — particle burst on a hit. `trigger` is a bump counter
 * (BlowTheHouseDown's shakeToken) — any change fires a new burst. Skipped
 * entirely under reduced-motion (not rendered by the parent at all).
 */
export default function BreathParticles({ trigger }) {
  const pointsRef = useRef();
  const velocities = useRef([]);
  const startTime = useRef(0);
  const active = useRef(false);
  const lastTrigger = useRef(trigger);

  const positions = useMemo(() => new Float32Array(COUNT * 3), []);

  useEffect(() => {
    if (trigger === lastTrigger.current || !trigger) return;
    lastTrigger.current = trigger;
    active.current = true;
    startTime.current = performance.now();
    velocities.current = Array.from({ length: COUNT }).map(() => ({
      x: (Math.random() - 0.5) * 2.2,
      y: Math.random() * 1.6 + 0.3,
      z: (Math.random() - 0.5) * 2.2,
    }));
  }, [trigger]);

  useFrame(() => {
    const pts = pointsRef.current;
    if (!pts) return;
    if (!active.current) {
      pts.visible = false;
      return;
    }
    const elapsed = (performance.now() - startTime.current) / LIFE_MS;
    if (elapsed >= 1) {
      active.current = false;
      pts.visible = false;
      return;
    }
    pts.visible = true;
    const pos = pts.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const v = velocities.current[i];
      pos[i * 3] = v.x * elapsed;
      pos[i * 3 + 1] = 0.6 + v.y * elapsed - elapsed * elapsed * 1.2;
      pos[i * 3 + 2] = v.z * elapsed;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.material.opacity = 1 - elapsed;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#E3A857" size={0.09} transparent opacity={1} sizeAttenuation depthWrite={false} />
    </points>
  );
}
