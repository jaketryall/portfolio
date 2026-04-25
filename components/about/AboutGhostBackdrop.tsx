"use client";

import { useEffect, useRef } from "react";
import { revealLetters } from "@/lib/reveal";

/**
 * Huge "ABOUT" cradling the portrait from behind. Positioned to sit only
 * in the portrait column area (left 5/12 of the grid), so it peeks
 * around the portrait's edges without colliding with the copy.
 */
export function AboutGhostBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tl = revealLetters({
      letters: lettersRef.current,
      weightFrom: 180,
      weightTo: 800,
      stagger: 0.05,
      scrollTrigger: { trigger: root, start: "top 85%" },
    });
    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none"
      style={{ zIndex: 0 }}
    >
      <div className="relative mx-auto h-full max-w-[1600px]">
        {/* Anchored to the left column width (roughly col-span-5 of a 12-col
            grid = ~41%), with overflow hidden so letters bleed off the left
            edge behind the portrait without crossing into the copy column. */}
        <div
          className="absolute top-4 left-0 overflow-hidden"
          style={{
            width: "min(600px, 50%)",
            fontFamily: "var(--font-sans)",
            color: "#e4e1d7",
            fontWeight: 800,
            letterSpacing: "-0.07em",
            lineHeight: 0.85,
            fontSize: "clamp(5rem, 12vw, 11rem)",
          }}
        >
          <span className="block overflow-hidden whitespace-nowrap">
            {Array.from("ABOUT").map((ch, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) lettersRef.current[i] = el;
                }}
                className="inline-block"
                style={{
                  color: "#e4e1d7",
                  fontVariationSettings: '"wght" 800',
                  willChange: "transform, font-variation-settings, opacity",
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
