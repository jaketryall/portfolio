"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";
import { revealLetters } from "@/lib/reveal";

// kept for backwards-compat — Hero still calls kineticStorm(progress),
// but the storm is a no-op now (weight-on-scroll was disorienting).
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

    // initial reveal — bold letters rise with variable-weight morph, then settle
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

    useImperativeHandle(ref, () => ({ kineticStorm: () => {} }), []);

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
