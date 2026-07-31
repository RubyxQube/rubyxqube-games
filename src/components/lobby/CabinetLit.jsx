import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * CabinetLit — the one real entry (Huff & Puff). Marquee strip pulses
 * emissive intensity on a ~4s sine period (the one surviving piece of the
 * original "breathing" motif); screen shows a flat-shaded wolf-eyes glow,
 * not a nested 3D scene, to keep the lobby's render cost cheap.
 */
export default function CabinetLit({ position = [0, 0, 0], rotationY = 0, animate = true }) {
  const marqueeMatRef = useRef();
  const screenMatRef = useRef();
  const lightRef = useRef();

  // animate=false freezes the pulse mid-breath for LobbyReducedMotion's
  // static framing — "no ambient motion" applies to this loop too, not
  // just particle effects.
  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.getElapsedTime();
    const pulse = 0.5 + 0.5 * Math.sin((t / 4) * Math.PI * 2); // ~4s period
    if (marqueeMatRef.current) marqueeMatRef.current.emissiveIntensity = 1.1 + pulse * 1.5;
    if (screenMatRef.current) screenMatRef.current.emissiveIntensity = 0.5 + pulse * 0.7;
    if (lightRef.current) lightRef.current.intensity = 0.5 + pulse * 0.45;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* cabinet body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 2, 0.7]} />
        <meshStandardMaterial color="#1c2124" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* bezel */}
      <mesh position={[0, 1.55, 0.36]}>
        <boxGeometry args={[0.74, 0.62, 0.05]} />
        <meshStandardMaterial color="#0f1214" roughness={0.6} />
      </mesh>

      {/* screen — flat glow, not a nested render */}
      <mesh position={[0, 1.55, 0.39]}>
        <planeGeometry args={[0.6, 0.5]} />
        <meshStandardMaterial
          ref={screenMatRef}
          color="#0a0605"
          emissive="#DE0E44"
          emissiveIntensity={0.8}
          roughness={0.5}
        />
      </mesh>

      {/* wolf eyes */}
      <mesh position={[-0.1, 1.6, 0.4]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color="#ffd76b" emissive="#ffd76b" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.1, 1.6, 0.4]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color="#ffd76b" emissive="#ffd76b" emissiveIntensity={1.5} />
      </mesh>

      {/* marquee strip — the surviving "breathing" motif */}
      <mesh position={[0, 2.1, 0.2]}>
        <boxGeometry args={[0.96, 0.16, 0.5]} />
        <meshStandardMaterial
          ref={marqueeMatRef}
          color="#2a0812"
          emissive="#DE0E44"
          emissiveIntensity={1.6}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, 1.6, 0.6]} color="#DE0E44" intensity={0.7} distance={3} />
    </group>
  );
}
