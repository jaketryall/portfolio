"use client";

import { useEffect, useRef } from "react";
import { revealLetters } from "@/lib/reveal";

/**
 * Echo of HeroNameBackdrop / AboutGhostBackdrop — the word "WORK" sits
 * behind the project grid as a section anchor. Same treatment, same motif.
 */
export function WorkGhostBackdrop() {
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
      scrollTrigger: { trigger: root, start: "top 85%", once: true },
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
        <div
          className="absolute right-0 top-32 overflow-hidden text-right md:top-40"
          style={{
            width: "min(700px, 55%)",
            fontFamily: "var(--font-sans)",
            color: "#e4e1d7",
            fontWeight: 800,
            letterSpacing: "-0.07em",
            lineHeight: 0.85,
            fontSize: "clamp(5rem, 14vw, 13rem)",
          }}
        >
          <span className="block overflow-hidden whitespace-nowrap">
            {Array.from("WORK").map((ch, i) => (
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
