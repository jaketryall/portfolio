"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealLetters } from "@/lib/reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Echo of HeroNameBackdrop / AboutGhostBackdrop. The word "WORK" rises out
 * of the About section and lands behind the WorkGrid header as the section
 * docks. The cohesion handoff between About → Work — same idea as the
 * shared FloatingPortrait between Hero → About, expressed as a typographic
 * element traveling between sections.
 */
export function WorkGhostBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  // letter reveal — fires once when the ghost target is in view
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

  // scroll-driven rise — ghost element starts overflowing UP into the About
  // visual area (top: -100vh) and tweens down to its target top position as
  // user scrolls from late-About into docked-Work.
  useEffect(() => {
    const root = rootRef.current;
    const ghost = ghostRef.current;
    if (!root || !ghost) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(ghost, { top: "11rem" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ghost,
        { top: "-100vh" },
        {
          top: "11rem",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            // begin while user is still scrolling through About
            start: "top 200%",
            // settle by the time WorkGrid docks at the viewport top
            end: "top top",
            scrub: 0.8,
            invalidateOnRefresh: true,
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
      <div className="relative mx-auto h-full max-w-[1600px]">
        <div
          ref={ghostRef}
          className="absolute right-0 overflow-hidden text-right"
          style={{
            top: "-100vh",
            width: "min(700px, 55%)",
            fontFamily: "var(--font-sans)",
            color: "#e4e1d7",
            fontWeight: 800,
            letterSpacing: "-0.07em",
            lineHeight: 0.85,
            fontSize: "clamp(5rem, 14vw, 13rem)",
            willChange: "top",
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
