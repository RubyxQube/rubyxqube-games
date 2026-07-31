import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import HouseModel from "./HouseModel";
import BreathParticles from "./BreathParticles";

const BASE_CAMERA_POS = [0, 1.3, 3.6];

function CameraRig({ shakeToken, reducedMotion }) {
  const { camera } = useThree();
  const shakeUntil = useRef(0);
  const lastToken = useRef(shakeToken);

  useEffect(() => {
    camera.position.set(...BASE_CAMERA_POS);
    camera.lookAt(0, 0.85, 0);
  }, [camera]);

  useEffect(() => {
    if (shakeToken !== lastToken.current) {
      lastToken.current = shakeToken;
      if (!reducedMotion) shakeUntil.current = performance.now() + 200; // ~200ms camera jitter
    }
  }, [shakeToken, reducedMotion]);

  useFrame(() => {
    const now = performance.now();
    if (now < shakeUntil.current) {
      const t = (shakeUntil.current - now) / 200;
      const mag = 0.05 * t;
      camera.position.set(
        BASE_CAMERA_POS[0] + (Math.random() - 0.5) * mag,
        BASE_CAMERA_POS[1] + (Math.random() - 0.5) * mag,
        BASE_CAMERA_POS[2]
      );
    } else {
      camera.position.set(...BASE_CAMERA_POS);
    }
  });

  return null;
}

/**
 * MinigameCanvas — separate lightweight Canvas, fixed camera (no orbit
 * controls), three-light rig only, no HDR (zero asset footprint, never
 * blocks on fetch).
 */
export default function MinigameCanvas({ houseType, stage, houseKey, shakeToken, reducedMotion }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 50, near: 0.1, far: 20 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} castShadow />
        <pointLight position={[-2.2, 2, 2]} color="#E3A857" intensity={0.4} />

        <CameraRig shakeToken={shakeToken} reducedMotion={reducedMotion} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.2, 32]} />
          <meshStandardMaterial color="#28331f" roughness={0.95} />
        </mesh>

        <HouseModel key={houseKey} type={houseType} stage={stage} />

        {!reducedMotion && <BreathParticles trigger={shakeToken} />}
      </Suspense>
    </Canvas>
  );
}
