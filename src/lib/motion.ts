import { useEffect, useState } from "react";

// FNV-1a: turns an id into a stable number, so each item always gets the same
// tilt and the same spot on the radar, without storing anything.
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

// A small, stable tilt between -3deg and 3deg.
export function tiltFor(id: string): string {
  return `${(hashString(id) % 7) - 3}deg`;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Counts from 0 up to `target` with an ease-out curve, one state update per frame.
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const total = prefersReducedMotion() ? 0 : duration;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = total === 0 ? 1 : Math.min(1, (now - start) / total);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
