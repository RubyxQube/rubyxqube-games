import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useGameInput — one hook wired to both inputs simultaneously:
 * - keydown/keyup on e.code === 'Space', preventDefault(), guard e.repeat.
 * - pointerdown/up/cancel/leave on a single always-visible "hold to charge"
 *   button (Pointer Events unify mouse + touch — one code path).
 * matchMedia('(pointer: coarse)') is used only to pick instruction copy
 * ("hold spacebar" vs "hold the button below"), not to fork logic.
 */
export default function useGameInput({ enabled, onChargeStart, onChargeEnd }) {
  const [isTouch] = useState(
    () => typeof window !== "undefined" && (window.matchMedia?.("(pointer: coarse)").matches ?? false)
  );
  const chargingRef = useRef(false);

  const startCharge = useCallback(() => {
    if (chargingRef.current) return;
    chargingRef.current = true;
    onChargeStart?.();
  }, [onChargeStart]);

  const endCharge = useCallback(() => {
    if (!chargingRef.current) return;
    chargingRef.current = false;
    onChargeEnd?.();
  }, [onChargeEnd]);

  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(e) {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (e.repeat) return;
      startCharge();
    }
    function onKeyUp(e) {
      if (e.code !== "Space") return;
      e.preventDefault();
      endCharge();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled, startCharge, endCharge]);

  // Also release charge if input becomes disabled mid-hold (e.g. house
  // collapsing pause), so a held key/pointer doesn't get "stuck."
  useEffect(() => {
    if (!enabled) endCharge();
  }, [enabled, endCharge]);

  const buttonHandlers = {
    onPointerDown: (e) => { e.preventDefault(); startCharge(); },
    onPointerUp: (e) => { e.preventDefault(); endCharge(); },
    onPointerCancel: endCharge,
    onPointerLeave: endCharge,
  };

  return { isTouch, buttonHandlers };
}
