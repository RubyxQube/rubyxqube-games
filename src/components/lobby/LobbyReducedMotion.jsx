import { Suspense, useState, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import LobbyRoom from "./LobbyRoom";
import CabinetLit from "./CabinetLit";
import CabinetLocked from "./CabinetLocked";
import { LOCKED_CABINETS, LIT_CABINET } from "./LobbyScene";

// Fixed vantage point: pulled back near the entrance, elevated slightly,
// angled to frame both the locked cabinets (left wall) and the lit Huff &
// Puff cabinet (right wall) in one static shot.
const CAM_POS = [0, 2.3, -0.6];
const CAM_LOOK_AT = [0.4, 1.35, 5.6];

function StaticCamera() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...CAM_POS);
    camera.lookAt(...CAM_LOOK_AT);
  }, [camera]);
  return null;
}

// Projects each cabinet's 3D screen position to a 2D percentage so the DOM
// hotspot buttons line up with the fixed camera framing, recomputed on
// mount and on resize (camera itself never moves under reduced motion).
function HotspotProjector({ points, onProject }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const v = new THREE.Vector3();
    const result = {};
    for (const p of points) {
      v.set(p.x, p.y, p.z);
      v.project(camera);
      result[p.key] = {
        left: (v.x * 0.5 + 0.5) * 100,
        top: (1 - (v.y * 0.5 + 0.5)) * 100,
      };
    }
    onProject(result);
  }, [camera, size.width, size.height, points, onProject]);
  return null;
}

/**
 * LobbyReducedMotion — used when useReducedMotion() is true. Same room/
 * cabinets rendered once with a fixed static camera (no PlayerController,
 * no walk loop, no pulse animation), plus DOM hotspot buttons overlaid at
 * each cabinet's screen position so the same content and the same route
 * (/games/huff-and-puff) is reachable without requiring movement input.
 */
export default function LobbyReducedMotion() {
  const navigate = useNavigate();
  const [hotspots, setHotspots] = useState({});

  const goToHuffAndPuff = useCallback(() => navigate("/games/huff-and-puff"), [navigate]);

  // Stable reference — LIT_CABINET/LOCKED_CABINETS never change, but a
  // fresh array literal every render would otherwise re-trigger
  // HotspotProjector's effect -> setHotspots -> re-render, forever.
  const points = useMemo(
    () => [
      { key: "lit", x: LIT_CABINET.x, y: 1.55, z: LIT_CABINET.z },
      ...LOCKED_CABINETS.map((c, i) => ({ key: `locked-${i}`, x: c.x, y: 1.55, z: c.z })),
    ],
    []
  );

  return (
    <div className="lobby-static">
      <Canvas dpr={[1, 1.5]} camera={{ fov: 62, near: 0.1, far: 40 }}>
        <Suspense fallback={null}>
          <StaticCamera />
          <ambientLight intensity={0.3} />
          <hemisphereLight intensity={0.22} groundColor="#101314" color="#3A4A3E" />
          <pointLight position={[0, 2.9, 2.2]} color="#e8c9a0" intensity={0.5} distance={6} />
          <pointLight position={[0, 2.9, 6]} color="#e8c9a0" intensity={0.5} distance={6} />

          <LobbyRoom />
          {LOCKED_CABINETS.map((c, i) => (
            <CabinetLocked key={i} position={[c.x, 0, c.z]} rotationY={c.rotationY} />
          ))}
          <CabinetLit
            position={[LIT_CABINET.x, 0, LIT_CABINET.z]}
            rotationY={LIT_CABINET.rotationY}
            animate={false}
          />

          <HotspotProjector points={points} onProject={setHotspots} />
        </Suspense>
      </Canvas>

      {hotspots.lit && (
        <button
          type="button"
          className="lobby-hotspot"
          style={{ left: `${hotspots.lit.left}%`, top: `${hotspots.lit.top}%` }}
          onClick={goToHuffAndPuff}
        >
          Play Huff & Puff
        </button>
      )}
      {LOCKED_CABINETS.map((c, i) =>
        hotspots[`locked-${i}`] ? (
          <span
            key={i}
            className="lobby-hotspot locked"
            style={{ left: `${hotspots[`locked-${i}`].left}%`, top: `${hotspots[`locked-${i}`].top}%` }}
          >
            Coming soon
          </span>
        ) : null
      )}
    </div>
  );
}
