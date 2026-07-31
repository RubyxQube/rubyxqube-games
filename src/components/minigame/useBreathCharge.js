import { useState, useRef, useCallback, useEffect } from "react";

const CHARGE_MS = 900;
const MIN_RELEASE_THRESHOLD = 0.25;

/**
 * useBreathCharge — drives the 0..1 charge value (HUD feedback + whiff-gate,
 * not a damage multiplier). Release below MIN_RELEASE_THRESHOLD counts as a
 * whiff (no hit); at or above it counts as exactly one hit, regardless of
 * how close to full charge — keeps v1 buildable without balancing.
 */
export default function useBreathCharge({ onRelease }) {
  const [charge, setCharge] = useState(0);
  const chargingRef = useRef(false);
  const startTimeRef = useRef(0);
  const rafRef = useRef(null);

  const tick = useCallback(() => {
    if (!chargingRef.current) return;
    const elapsed = performance.now() - startTimeRef.current;
    setCharge(Math.min(1, elapsed / CHARGE_MS));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    chargingRef.current = true;
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const release = useCallback(() => {
    if (!chargingRef.current) return;
    chargingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setCharge((current) => {
      onRelease?.(current >= MIN_RELEASE_THRESHOLD);
      return 0;
    });
  }, [onRelease]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return { charge, start, release };
}
