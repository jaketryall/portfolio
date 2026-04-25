"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const QUOTES = [
  {
    body: "Jake doesn't just hand off Figmas. He owns the whole problem — design through ship — and the result feels like one cohesive product.",
    name: "Maya Chen",
    role: "Founder, Atlas Studio",
  },
  {
    body: "The level of polish on the motion is what you remember. Every interaction has intent, nothing is decorative.",
    name: "Daniel Park",
    role: "Head of Design, North",
  },
  {
    body: "We needed someone who could move fast without dropping taste. Jake was the only candidate that got both.",
    name: "Lena Ortiz",
    role: "CEO, Folio",
  },
];

const ROTATE_MS = 6500;

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // auto-rotate
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % QUOTES.length);
    }, ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  // animate the quote in/out on change
  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    gsap.fromTo(
      el,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }
    );
  }, [active]);

  const current = QUOTES[active];

  return (
    <section
      ref={ref}
      aria-label="Testimonials"
      className="relative px-6 py-28 md:px-12 md:py-40 lg:px-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-10 bg-ink" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
            Words
          </span>
        </div>

        <div ref={quoteRef} className="min-h-[260px] md:min-h-[320px]">
          <blockquote
            className="display-black max-w-5xl text-pretty text-ink"
            style={{
              fontSize: "clamp(1.75rem, 3.6vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            <span aria-hidden>“</span>
            {current.body}
            <span aria-hidden>”</span>
          </blockquote>
          <div className="mt-10 flex items-center gap-4">
            <span aria-hidden className="inline-block h-px w-8 bg-ink" />
            <div>
              <div
                className="text-ink"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {current.name}
              </div>
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft font-semibold">
                {current.role}
              </div>
            </div>
          </div>
        </div>

        {/* dots — click-to-jump + indicate active */}
        <div className="mt-12 flex gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show testimonial ${i + 1}`}
              data-cursor="hover"
              className="group relative h-1.5 w-12 overflow-hidden rounded-full bg-line"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: i === active ? "100%" : "0%" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
