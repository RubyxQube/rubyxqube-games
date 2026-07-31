import { useState, useEffect } from "react";

/**
 * useReducedMotion — wraps matchMedia('(prefers-reduced-motion: reduce)').
 * Consumed by Home.jsx (picks LobbyScene vs LobbyReducedMotion) and
 * BlowTheHouseDown.jsx (skips particle bursts only, game stays fully playable).
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
