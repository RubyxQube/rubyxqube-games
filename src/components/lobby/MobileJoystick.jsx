import { useEffect, useRef } from "react";

const BASE_RADIUS = 58; // px — how far the knob can travel from center

/**
 * MobileJoystick — bottom-left virtual joystick for movement on touch
 * devices. Writes a normalized {x, y} vector into the shared ref that
 * PlayerController reads every frame — x = strafe, y = forward.
 * Pattern reused from Phoenix Stoneworks' walkthrough MobileJoystick.jsx.
 */
export default function MobileJoystick({ vectorRef }) {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const touchIdRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    function setKnob(dx, dy) {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    function onTouchStart(e) {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      const rect = base.getBoundingClientRect();
      originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      e.preventDefault();
    }

    function onTouchMove(e) {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== touchIdRef.current) continue;
        let dx = touch.clientX - originRef.current.x;
        let dy = touch.clientY - originRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist > BASE_RADIUS) {
          dx = (dx / dist) * BASE_RADIUS;
          dy = (dy / dist) * BASE_RADIUS;
        }
        setKnob(dx, dy);
        vectorRef.current = { x: dx / BASE_RADIUS, y: -dy / BASE_RADIUS };
        e.preventDefault();
      }
    }

    function onTouchEnd(e) {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== touchIdRef.current) continue;
        touchIdRef.current = null;
        setKnob(0, 0);
        vectorRef.current = { x: 0, y: 0 };
      }
    }

    base.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
    return () => {
      base.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [vectorRef]);

  return (
    <div ref={baseRef} className="lobby-joystick-base">
      <div ref={knobRef} className="lobby-joystick-knob" />
    </div>
  );
}
