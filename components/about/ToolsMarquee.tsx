"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOOLS = [
  "Figma",
  "Framer",
  "Next.js",
  "Tailwind CSS",
  "GSAP",
  "Motion",
  "After Effects",
  "Rive",
  "Photoshop",
  "Blender",
  "Cursor",
  "TypeScript",
];

export function ToolsMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // base constant drift
      const base = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: reduce ? 0 : 40,
        repeat: reduce ? 0 : -1,
      });
      if (reduce) base.progress(0).pause();

      // scroll-linked speed boost
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 800, 4);
          gsap.to(base, {
            timeScale: 1 + v,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const items = [...TOOLS, ...TOOLS];

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      aria-label="Tools I use"
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
        style={{ gap: 0 }}
      >
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-10 px-10 font-sans text-ink"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {t}
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--color-ink)" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
