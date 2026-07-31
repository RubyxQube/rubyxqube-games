import { Suspense, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import LobbyRoom from "./LobbyRoom";
import CabinetLit from "./CabinetLit";
import CabinetLocked from "./CabinetLocked";
import PlayerController from "./PlayerController";
import MobileJoystick from "./MobileJoystick";
import InteractionPrompt from "./InteractionPrompt";
import useLobbyInput from "./useLobbyInput";

// Shared room layout — a short, mostly-linear hallway of cabinets, not an
// open free-roam floor (SPEC.md §6). Exported so LobbyReducedMotion.jsx's
// static framing/hotspots can reference the same real positions.
export const ROOM = { minX: -1.88, maxX: 1.88, minZ: 0.3, maxZ: 8.2 };
export const SPAWN = [0, 1.6, 1.1];
export const LOCKED_CABINETS = [
  { x: -1.85, z: 2.3, radius: 0.55, rotationY: Math.PI / 2 },
  { x: -1.85, z: 5.1, radius: 0.55, rotationY: Math.PI / 2 },
];
export const LIT_CABINET = { x: 1.85, z: 6.5, radius: 0.55, rotationY: -Math.PI / 2 };
export const INTERACT_RADIUS = 1.8;

function LoadingOverlay() {
  const { progress, active } = useProgress();
  // This scene has no textures/GLB to load (primitive geometry only, per
  // SPEC.md §6), so useProgress's `total` stays 0 and `progress` never
  // reaches 100 — gating on `!active` alone correctly hides the overlay
  // immediately when there's nothing in flight, instead of stalling forever.
  if (!active) return null;
  return (
    <div className="lobby-loading">
      <div className="lobby-loading-bar">
        <div className="lobby-loading-fill" style={{ width: `${Math.round(progress)}%` }} />
      </div>
      <p>Loading the arcade… {Math.round(progress)}%</p>
    </div>
  );
}

export default function LobbyScene() {
  const navigate = useNavigate();
  const [isTouchDevice] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches || "ontouchstart" in window)
  );
  const [isNear, setIsNear] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const { joystickRef, getMoveVector } = useLobbyInput();

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const goToHuffAndPuff = useCallback(() => navigate("/games/huff-and-puff"), [navigate]);

  // Desktop: Enter/E confirms the interaction prompt.
  useEffect(() => {
    function onKeyDown(e) {
      if (!isNear) return;
      if (e.code === "KeyE" || e.code === "Enter") goToHuffAndPuff();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNear, goToHuffAndPuff]);

  const cabinetCollisions = [...LOCKED_CABINETS, LIT_CABINET];

  return (
    <div className="lobby-wrap">
      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 70, near: 0.1, far: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.28} />
          <hemisphereLight intensity={0.22} groundColor="#101314" color="#3A4A3E" />
          <pointLight position={[0, 2.9, 2.2]} color="#e8c9a0" intensity={0.5} distance={6} />
          <pointLight position={[0, 2.9, 6]} color="#e8c9a0" intensity={0.5} distance={6} />

          <LobbyRoom />

          {LOCKED_CABINETS.map((c, i) => (
            <CabinetLocked key={i} position={[c.x, 0, c.z]} rotationY={c.rotationY} />
          ))}
          <CabinetLit position={[LIT_CABINET.x, 0, LIT_CABINET.z]} rotationY={LIT_CABINET.rotationY} />

          <PlayerController
            room={ROOM}
            cabinets={cabinetCollisions}
            litCabinet={LIT_CABINET}
            interactRadius={INTERACT_RADIUS}
            spawn={SPAWN}
            getMoveVector={getMoveVector}
            onProximityChange={setIsNear}
          />
        </Suspense>
      </Canvas>

      <LoadingOverlay />

      <div className={`lobby-hint${showHint ? "" : " lobby-hint--hidden"}`}>
        <p>{isTouchDevice ? "Drag to look · joystick to walk · approach a cabinet to play" : "Drag to look · WASD to walk · approach a cabinet to play"}</p>
      </div>

      {isTouchDevice && <MobileJoystick vectorRef={joystickRef} />}

      <InteractionPrompt visible={isNear} isTouchDevice={isTouchDevice} onActivate={goToHuffAndPuff} />
    </div>
  );
}
