"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Stat = { label: string; value: number; suffix?: string };

const STATS: Stat[] = [
  { label: "Yrs designing", value: 5 },
  { label: "Projects", value: 32 },
  { label: "Clients", value: 18 },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);

  // count-up on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nums = el.querySelectorAll<HTMLSpanElement>("[data-num]");

    const ctx = gsap.context(() => {
      nums.forEach((n) => {
        const target = Number(n.dataset.num ?? 0);
        if (reduce) {
          n.textContent = String(target);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "expo.out",
          onUpdate: () => {
            n.textContent = String(Math.round(obj.v));
          },
          scrollTrigger: { trigger: n, start: "top 85%", once: true },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-6 border-t border-line pt-8">
      {STATS.map((s, i) => (
        <div key={s.label} className="flex flex-col items-start gap-3">
          <span
            className="font-sans text-ink tabular-nums"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontVariationSettings: '"wght" 700',
            }}
          >
            <span data-num={s.value}>0</span>
            {s.suffix ?? ""}
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-ink"
            />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
              {s.label}
            </span>
            <span aria-hidden className="meta-spacer hidden md:inline-block">
              {i < 2 ? (
                <span className="ml-2 inline-block h-px w-6 bg-line" />
              ) : null}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
