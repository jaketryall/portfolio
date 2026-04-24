"use client";

import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Huge ghost-name sitting behind the portrait.
 * - On initial load: each letter reveals from clip-mask with variable-weight morph (wght 180 → 500).
 * - On signature gesture (triggered via ref.kineticStorm()): each letter briefly animates to a random
 *   weight in [200..800] and settles back to the target weight — runs during the hero→about scroll.
 */
export type HeroBackdropHandle = {
  kineticStorm: (progress: number) => void;
};

type Props = {
  first: string;
  last: string;
  className?: string;
};

export const HeroNameBackdrop = forwardRef<HeroBackdropHandle, Props>(
  function HeroNameBackdrop({ first, last, className }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const lettersRef = useRef<HTMLSpanElement[]>([]);
    const stormStateRef = useRef<{ running: boolean; lastP: number }>({
      running: false,
      lastP: 0,
    });

    // initial reveal on mount
    useEffect(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(lettersRef.current, {
          yPercent: 0,
          opacity: 1,
          fontWeight: 500,
        });
        return;
      }

      gsap.set(lettersRef.current, {
        yPercent: 110,
        opacity: 0,
        fontWeight: 180,
      });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(lettersRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.3,
        ease: "expo.out",
        stagger: { each: 0.055, from: "start" },
      }).to(
        lettersRef.current,
        {
          fontWeight: 800,
          duration: 1.8,
          ease: "power2.out",
          stagger: { each: 0.04, from: "start" },
        },
        "<"
      );
    }, []);

    // expose the storm fn
    useEffect(() => {
      if (!ref) return;
      const handle: HeroBackdropHandle = {
        kineticStorm: (progress) => {
          // progress 0 → 1 during hero pin
          // only trigger storm pulses as progress crosses 0.15, 0.4, 0.7 thresholds
          const state = stormStateRef.current;
          const last = state.lastP;
          state.lastP = progress;
          const thresholds = [0.2, 0.5, 0.8];
          for (const t of thresholds) {
            if (last < t && progress >= t && !state.running) {
              state.running = true;
              const letters = lettersRef.current;
              const targets = letters.map(
                () => 200 + Math.random() * 600
              );
              gsap.to(letters, {
                fontWeight: (i: number) => targets[i],
                duration: 0.45,
                ease: "power3.out",
                stagger: { each: 0.02, from: "random" },
                onComplete: () => {
                  gsap.to(letters, {
                    fontWeight: 800,
                    duration: 0.9,
                    ease: "power3.inOut",
                    stagger: { each: 0.02, from: "random" },
                    onComplete: () => {
                      state.running = false;
                    },
                  });
                },
              });
              break;
            }
          }
        },
      };
      if (typeof ref === "function") ref(handle);
      else ref.current = handle;
    }, [ref]);

    const renderLetters = (word: string, offset: number) =>
      Array.from(word).map((ch, i) => (
        <span
          key={`${offset}-${i}`}
          ref={(el) => {
            if (el) lettersRef.current[offset + i] = el;
          }}
          className="inline-block"
          style={{
            fontVariationSettings: '"wght" 800',
            willChange: "transform, font-weight, opacity",
          }}
        >
          {ch}
        </span>
      ));

    return (
      <div
        ref={rootRef}
        aria-hidden
        className={cn(
          "pointer-events-none select-none text-center",
          className
        )}
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-canvas-2)",
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 0.8,
          fontSize: "clamp(7rem, 26vw, 28rem)",
        }}
      >
        <span className="block overflow-hidden">
          <span className="inline-block">{renderLetters(first, 0)}</span>
        </span>
        <span className="block overflow-hidden">
          <span className="inline-block">{renderLetters(last, first.length)}</span>
        </span>
      </div>
    );
  }
);
