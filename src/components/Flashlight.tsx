import { useEffect, useRef, type ReactNode } from "react";

// "Lights out" search: a dark overlay with a hole that follows the pointer. The overlay
// only ever moves with translate3d inside requestAnimationFrame, so it is GPU-composited.
export default function Flashlight({ on, children }: { on: boolean; children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    const beam = beamRef.current;
    if (!on || !area || !beam) return;

    let frame = 0;
    let x = area.clientWidth / 2;
    let y = 160;
    const paint = () => {
      frame = 0;
      beam.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (event: PointerEvent) => {
      const rect = area.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    area.addEventListener("pointermove", move);
    return () => {
      area.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [on]);

  return (
    // Only clip while the beam is on, so the tags' shadows are not cut off normally.
    <div ref={areaRef} className={`relative rounded-3xl ${on ? "overflow-hidden" : ""}`}>
      {children}
      {on ? <div ref={beamRef} className="flashlight-beam" aria-hidden="true" /> : null}
    </div>
  );
}
