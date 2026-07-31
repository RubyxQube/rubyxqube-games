import { useRef, useEffect, useCallback } from "react";

/**
 * useLobbyInput — normalizes WASD/arrow keydown state + joystick vector into
 * one movement direction per frame, decoupled from the specific input
 * method. Mirrors useGameInput.js's "one hook, multiple input sources"
 * pattern from §7.
 *
 * Returns:
 *   joystickRef   — ref for MobileJoystick to write {x, y} into (-1..1 each)
 *   getMoveVector — call once per frame, returns {x, y} (x = strafe, y = forward)
 */
export default function useLobbyInput() {
  const keysRef = useRef({});
  const joystickRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onKeyDown(e) { keysRef.current[e.code] = true; }
    function onKeyUp(e) { keysRef.current[e.code] = false; }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const getMoveVector = useCallback(() => {
    const k = keysRef.current;
    let x = 0;
    let y = 0;
    if (k.KeyW || k.ArrowUp) y += 1;
    if (k.KeyS || k.ArrowDown) y -= 1;
    if (k.KeyD || k.ArrowRight) x += 1;
    if (k.KeyA || k.ArrowLeft) x -= 1;

    const j = joystickRef.current;
    if (j.x || j.y) {
      x += j.x;
      y += j.y;
    }

    const mag = Math.hypot(x, y);
    if (mag > 1) {
      x /= mag;
      y /= mag;
    }
    return { x, y };
  }, []);

  return { joystickRef, getMoveVector };
}
