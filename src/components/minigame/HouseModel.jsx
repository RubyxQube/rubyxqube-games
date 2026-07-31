import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import HouseGeometry from "./HouseGeometry";

// Per-stage target transforms (tilt/drop/scale) — index 0 is the idle pose,
// the last index (== maxStage) is the fully-collapsed pose. No physics
// simulation — a pre-built collapse animation per house type, per BRIEF.md.
const STAGE_TARGETS = {
  straw: [
    { tilt: 0, drop: 0, scale: 1 },
    { tilt: 0.55, drop: -0.7, scale: 0.35 },
  ],
  sticks: [
    { tilt: 0, drop: 0, scale: 1 },
    { tilt: 0.16, drop: -0.05, scale: 0.97 },
    { tilt: 0.55, drop: -0.7, scale: 0.32 },
  ],
  bricks: [
    { tilt: 0, drop: 0, scale: 1 },
    { tilt: 0.08, drop: -0.02, scale: 0.99 },
    { tilt: 0.2, drop: -0.08, scale: 0.94 },
    { tilt: 0.55, drop: -0.7, scale: 0.28 },
  ],
};

function StickBundle() {
  const sticks = Array.from({ length: 10 });
  return (
    <group position={[0, 0.5, 0]}>
      {sticks.map((_, i) => {
        const angle = (i / sticks.length) * Math.PI * 2;
        const r = 0.55;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.15, 6]} />
            <meshStandardMaterial color="#a9793f" roughness={0.85} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.85, 0.7, 4]} />
        <meshStandardMaterial color="#8a6636" roughness={0.85} />
      </mesh>
    </group>
  );
}

function BrickBlock() {
  return (
    <group position={[0, 0.5, 0]}>
      {[0, 1, 2].map((row) => (
        <mesh key={row} position={[0, -0.35 + row * 0.34, 0]} castShadow>
          <boxGeometry args={[1.45 - row * 0.03, 0.3, 1.45 - row * 0.03]} />
          <meshStandardMaterial color="#8C4A3A" roughness={0.92} />
        </mesh>
      ))}
      <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.1, 0.8, 4]} />
        <meshStandardMaterial color="#5c2f24" roughness={0.85} />
      </mesh>
    </group>
  );
}

/**
 * HouseModel — props { type, stage, maxStage }. Straw reuses HouseGeometry;
 * sticks = cylinder-lattice bundle; bricks = box construction, flat
 * Brickrust color. Transform lerps toward a per-stage target table each
 * frame. Parent (MinigameCanvas) sets key={houseIndex} for clean remounts
 * between houses.
 */
export default function HouseModel({ type, stage }) {
  const groupRef = useRef();
  const targets = STAGE_TARGETS[type] || STAGE_TARGETS.straw;
  const target = targets[Math.min(stage, targets.length - 1)];

  useFrame(() => {
    const g = groupRef.current;
    if (!g || !target) return;
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, target.tilt, 0.09);
    g.position.y = THREE.MathUtils.lerp(g.position.y, target.drop, 0.09);
    const s = THREE.MathUtils.lerp(g.scale.x, target.scale, 0.09);
    g.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef}>
      {type === "straw" && <HouseGeometry wallColor="#E3A857" roofColor="#c9924a" />}
      {type === "sticks" && <StickBundle />}
      {type === "bricks" && <BrickBlock />}
    </group>
  );
}
