import { useEffect, useRef, useState } from "react";

/**
 * useSettleIn — IntersectionObserver hook -> { ref, inView }.
 * Pair with the `.settle-in` / `.settle-in.in-view` CSS classes.
 * Applied to: Home's studio-blurb, catalog-strip cards, Games page cards,
 * GameDetail content blocks. NOT applied to Studio, Press Kit, Contact
 * (DESIGN.md: "quiet by comparison").
 */
export default function useSettleIn(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
