"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Ghost word "ABOUT" behind the About section — echoes the hero's JAKE/RYALL
 * backdrop using the same treatment (canvas-2 color, 800 weight, scroll-linked
 * kinetic storm). Creates motif continuity across sections.
 */
export function AboutGhostBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = root.querySelectorAll<HTMLSpanElement>("[data-letter]");
    if (!letters.length) return;

    if (reduce) {
      gsap.set(letters, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(letters, { yPercent: 110, opacity: 0, fontWeight: 180 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 85%",
        once: true,
      },
    });

    tl.to(letters, {
      yPercent: 0,
      opacity: 1,
      duration: 1.3,
      ease: "expo.out",
      stagger: { each: 0.04, from: "start" },
    }).to(
      letters,
      {
        fontWeight: 800,
        duration: 1.6,
        ease: "power2.out",
        stagger: { each: 0.035, from: "start" },
      },
      "<"
    );

    // velocity pulse: letters flex their weight on scroll velocity
    const velocityTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity());
        const w = gsap.utils.clamp(400, 900, 500 + v / 20);
        gsap.to(letters, {
          fontWeight: w,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      },
      onLeave: () => {
        gsap.to(letters, { fontWeight: 800, duration: 0.8, ease: "power3.out" });
      },
      onLeaveBack: () => {
        gsap.to(letters, { fontWeight: 800, duration: 0.8, ease: "power3.out" });
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      velocityTrigger.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 select-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      <div
        className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="text-right"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-ghost)",
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 0.8,
            fontSize: "clamp(6rem, 20vw, 22rem)",
          }}
        >
          <span className="block overflow-hidden">
            {Array.from("ABOUT").map((ch, i) => (
              <span
                key={i}
                data-letter
                className="inline-block"
                style={{
                  fontVariationSettings: '"wght" 800',
                  willChange: "transform, font-weight, opacity",
                }}
              >
                {ch}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
