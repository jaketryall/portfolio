"use client";

import { useEffect, useRef } from "react";
import { motionBus } from "@/lib/motionBus";

/**
 * Local atmosphere — subtle drifting radial-gradient blobs scoped to a slab
 * section. Same technique as AtmosphereLayer (the global fixed one) but
 * absolute-positioned inside its parent so the effect lives inside the
 * slab's rounded shape rather than getting hidden behind its opaque bg.
 *
 * Drop directly inside any rounded-section parent (About / Process / Footer
 * slabs). Subscribes to motionBus so its drift is part of the same heartbeat.
 */
export function SlabAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const shapes = Array.from(el.querySelectorAll<HTMLElement>("[data-shape]"));

    const unsub = motionBus.subscribe(
      ({ scrollProgress, scrollVelocity, time }) => {
        shapes.forEach((s, i) => {
          const depth = Number(s.dataset.depth ?? 0.3);
          const driftY = Math.sin(time * 0.18 + i * 1.7) * 30 * depth;
          const driftX =
            Math.cos(time * 0.12 + i * 0.9) * 40 * depth +
            scrollVelocity * 50 * depth;
          const scale = 1 + Math.abs(scrollVelocity) * 0.05 * depth;
          // light scroll-progress phase shift so blobs slowly recompose as page scrolls
          const phaseOffset = scrollProgress * 60 * depth;
          s.style.transform = `translate3d(${driftX + phaseOffset}px, ${driftY}px, 0) scale(${scale})`;
        });
      }
    );
    return unsub;
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        data-shape
        data-depth="0.7"
        className="absolute top-[-20%] left-[-10%] h-[55vmax] w-[55vmax] rounded-full opacity-60 blur-[100px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(220,215,200,0.9), rgba(220,215,200,0) 70%)",
          willChange: "transform",
        }}
      />
      <div
        data-shape
        data-depth="0.4"
        className="absolute bottom-[-15%] right-[-15%] h-[60vmax] w-[60vmax] rounded-full opacity-45 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(220,215,200,0.85), rgba(220,215,200,0) 70%)",
          willChange: "transform",
        }}
      />
      <div
        data-shape
        data-depth="0.9"
        className="absolute top-[30%] left-[40%] h-[40vmax] w-[40vmax] rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(220,215,200,0.7), rgba(220,215,200,0) 70%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
