import { useRef, useEffect, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";

const EYE_HEIGHT = 1.6;
const PLAYER_RADIUS = 0.32;
const SPEED = 2.4; // m/s — small room, no run/sprint needed
const LOOK_SENSITIVITY = 0.0035;
const PITCH_LIMIT = Math.PI / 2 - 0.2;

/**
 * PlayerController — adapted from Phoenix Stoneworks' PlayerController.jsx,
 * deliberately simplified per SPEC.md §6: no pointer-lock FPS feel (drag-to-
 * look via Pointer Events instead — friendlier for a marketing-site visitor
 * who didn't expect to click-to-lock their cursor), no gravity/jumping, no
 * Octree mesh collision — movement is clamped to a simple bounding box plus
 * a basic radius push-out per cabinet so the player can't clip through one.
 *
 * `room` = { minX, maxX, minZ, maxZ } interior bounds (already inset by
 * PLAYER_RADIUS by the caller).
 * `cabinets` = [{ x, z, radius }] for push-out collision.
 * `litCabinet` = { x, z } — the one interactive cabinet; `interactRadius` is
 * how close the player must be for onProximityChange(true) to fire.
 */
export default function PlayerController({
  room,
  cabinets = [],
  litCabinet,
  interactRadius = 1.8,
  spawn,
  getMoveVector,
  onProximityChange,
}) {
  const { camera, gl } = useThree();
  const yaw = useRef(Math.PI); // faces +Z on spawn — default camera forward is -Z
  const pitch = useRef(0);
  const pos = useRef({ x: spawn[0], z: spawn[2] });
  const wasNear = useRef(false);

  useLayoutEffect(() => {
    camera.rotation.set(0, Math.PI, 0, "YXZ");
    camera.position.set(spawn[0], EYE_HEIGHT, spawn[2]);
  }, [camera, spawn]);

  // Drag-to-look: Pointer Events unify mouse-drag and touch-drag into one
  // code path, and (deliberately, per spec) skip native Pointer Lock —
  // lower-commitment than PSW's full FPS feel, appropriate for a marketing
  // moment a visitor didn't necessarily mean to "enter."
  useEffect(() => {
    const el = gl.domElement;
    let dragId = null;
    let lastX = 0;
    let lastY = 0;

    function onDown(e) {
      if (dragId !== null) return;
      dragId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onMove(e) {
      if (e.pointerId !== dragId) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw.current -= dx * LOOK_SENSITIVITY;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current - dy * LOOK_SENSITIVITY));
    }
    function onUp(e) {
      if (e.pointerId === dragId) dragId = null;
    }

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, [gl]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { x: strafe, y: forward } = getMoveVector();

    if (strafe !== 0 || forward !== 0) {
      // Forward/side vectors derived directly from yaw (horizontal-only,
      // matches PSW's zeroing of the Y component so looking up/down never
      // changes movement direction).
      const fx = -Math.sin(yaw.current);
      const fz = -Math.cos(yaw.current);
      const sx = -Math.sin(yaw.current + Math.PI / 2);
      const sz = -Math.cos(yaw.current + Math.PI / 2);

      let dx = (fx * forward + sx * strafe) * SPEED * delta;
      let dz = (fz * forward + sz * strafe) * SPEED * delta;

      let nx = pos.current.x + dx;
      let nz = pos.current.z + dz;

      // Simple AABB clamp to the room interior.
      nx = Math.max(room.minX, Math.min(room.maxX, nx));
      nz = Math.max(room.minZ, Math.min(room.maxZ, nz));

      // Basic radius push-out so the player can't clip through a cabinet.
      for (const c of cabinets) {
        const ddx = nx - c.x;
        const ddz = nz - c.z;
        const dist = Math.hypot(ddx, ddz);
        const minDist = c.radius + PLAYER_RADIUS;
        if (dist < minDist && dist > 0.0001) {
          const push = (minDist - dist) / dist;
          nx += ddx * push;
          nz += ddz * push;
        }
      }

      pos.current.x = nx;
      pos.current.z = nz;
    }

    camera.position.set(pos.current.x, EYE_HEIGHT, pos.current.z);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    if (litCabinet && onProximityChange) {
      const dist = Math.hypot(pos.current.x - litCabinet.x, pos.current.z - litCabinet.z);
      const isNear = dist <= interactRadius;
      if (isNear !== wasNear.current) {
        wasNear.current = isNear;
        onProximityChange(isNear);
      }
    }
  });

  return null;
}
