"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { revealLetters, bindWeightToVelocity } from "@/lib/reveal";
import { motionBus } from "@/lib/motionBus";

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

    // initial reveal — uses shared reveal primitive
    useEffect(() => {
      const tl = revealLetters({
        letters: lettersRef.current,
        weightFrom: 180,
        weightTo: 800,
        stagger: 0.055,
        delay: 0.15,
      });
      return () => {
        tl?.kill();
      };
    }, []);

    // velocity → weight flex (same signal as AboutGhost) via motion bus
    useEffect(() => {
      const letters = lettersRef.current;
      if (!letters.length) return;
      const unsub = motionBus.subscribe(({ scrollVelocity }) => {
        bindWeightToVelocity(letters, scrollVelocity, 800);
      });
      return unsub;
    }, []);

    // kinetic storm, exposed to parent (Hero) — triggered at scroll thresholds
    useImperativeHandle(
      ref,
      () => ({
        kineticStorm: (progress: number) => {
          const state = stormStateRef.current;
          const last = state.lastP;
          state.lastP = progress;
          const thresholds = [0.2, 0.5, 0.8];
          for (const t of thresholds) {
            if (last < t && progress >= t && !state.running) {
              state.running = true;
              const letters = lettersRef.current;
              const targets = letters.map(() => 200 + Math.random() * 600);
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
      }),
      []
    );

    const renderLetters = (word: string, offset: number) =>
      Array.from(word).map((ch, i) => (
        <span
          key={`${offset}-${i}`}
          ref={(el) => {
            if (el) lettersRef.current[offset + i] = el;
          }}
          className="inline-block"
          style={{
            color: "#e4e1d7",
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
          color: "#e4e1d7",
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
