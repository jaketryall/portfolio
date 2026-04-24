"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motionBus } from "@/lib/motionBus";

/**
 * Ambient glass shapes behind the page.
 * Drift and scale gently with the shared bus signals — scroll progress
 * drives parallax, velocity drives a subtle stretch. No independent loops.
 */
export function AtmosphereLayer() {
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
          const driftY = scrollProgress * -400 * depth;
          // very slow ambient drift tied to the shared ticker (not a separate loop)
          const driftX =
            Math.sin(time * 0.12 + i * 1.3) * 40 * depth +
            scrollVelocity * 60 * depth;
          const scale = 1 + Math.abs(scrollVelocity) * 0.06 * depth;
          s.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) scale(${scale})`;
        });
      }
    );
    return unsub;
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-shape
        data-depth="0.6"
        className="absolute top-[10%] left-[-15%] h-[55vmax] w-[55vmax] rounded-full opacity-60 blur-[80px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,242,238,0.9), rgba(244,242,238,0) 70%)",
          willChange: "transform",
        }}
      />
      <div
        data-shape
        data-depth="0.35"
        className="absolute top-[40%] right-[-20%] h-[60vmax] w-[60vmax] rounded-full opacity-45 blur-[100px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,242,238,0.9), rgba(244,242,238,0) 70%)",
          willChange: "transform",
        }}
      />
      <div
        data-shape
        data-depth="0.8"
        className="absolute bottom-[-10%] left-[30%] h-[45vmax] w-[45vmax] rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,242,238,0.7), rgba(244,242,238,0) 70%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
