"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AtmosphereLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const shapes = el.querySelectorAll<HTMLElement>("[data-shape]");
    const ctx = gsap.context(() => {
      shapes.forEach((shape, i) => {
        const depth = Number(shape.dataset.depth ?? 0.3);
        gsap.to(shape, {
          yPercent: -30 * depth * 100,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
        gsap.to(shape, {
          x: i % 2 === 0 ? 60 : -60,
          duration: 12 + i * 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, ref);

    return () => ctx.revert();
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
        }}
      />
      <div
        data-shape
        data-depth="0.35"
        className="absolute top-[40%] right-[-20%] h-[60vmax] w-[60vmax] rounded-full opacity-45 blur-[100px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(227,220,196,0.9), rgba(227,220,196,0) 70%)",
        }}
      />
      <div
        data-shape
        data-depth="0.8"
        className="absolute bottom-[-10%] left-[30%] h-[45vmax] w-[45vmax] rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,242,238,0.7), rgba(244,242,238,0) 70%)",
        }}
      />
    </div>
  );
}
