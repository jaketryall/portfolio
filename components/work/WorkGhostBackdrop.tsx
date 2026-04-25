"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealLetters } from "@/lib/reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Echo of HeroNameBackdrop / AboutGhostBackdrop — the word "WORK" sits
 * behind the project grid as a section anchor. Plus a parallax rise as
 * the user approaches it, so the section transition feels earned.
 */
export function WorkGhostBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
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

  // parallax rise — letters start lower and rise into position as user scrolls in
  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: 35 },
        {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "top top",
            scrub: 0.6,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none"
      style={{ zIndex: 0 }}
    >
      <div className="relative mx-auto h-full max-w-[1600px]" ref={innerRef} style={{ willChange: "transform" }}>
        <div
          className="absolute right-0 top-44 overflow-hidden text-right md:top-56"
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
