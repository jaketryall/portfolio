"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealLetters } from "@/lib/reveal";

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
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostLettersRef = useRef<HTMLSpanElement[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // ghost reveal
  useEffect(() => {
    const root = ghostRef.current;
    if (!root) return;
    const tl = revealLetters({
      letters: ghostLettersRef.current,
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
      className="relative overflow-hidden px-6 py-32 md:px-12 md:py-44 lg:px-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ghost word — same motif */}
      <div
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
        style={{ zIndex: 0 }}
      >
        <div className="relative mx-auto h-full max-w-[1600px]">
          <div
            className="absolute left-0 top-32 overflow-hidden md:top-44"
            style={{
              width: "min(900px, 70%)",
              fontFamily: "var(--font-sans)",
              color: "#e4e1d7",
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.85,
              fontSize: "clamp(5rem, 14vw, 13rem)",
            }}
          >
            <span className="block overflow-hidden whitespace-nowrap">
              {Array.from("WORDS").map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) ghostLettersRef.current[i] = el;
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

      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-10 bg-ink" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              Words
            </span>
          </div>
          <h2
            className="display-black max-w-3xl text-ink"
            style={{ fontSize: "clamp(2.25rem, 4vw, 4rem)" }}
          >
            What clients say.
          </h2>
        </div>

        {/* Big decorative open quote */}
        <span
          aria-hidden
          className="block leading-none text-ink"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(5rem, 10vw, 10rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            transform: "translateY(0.15em)",
          }}
        >
          “
        </span>

        <div ref={quoteRef} className="-mt-8 min-h-[260px] md:min-h-[300px]">
          <blockquote
            className="display max-w-5xl text-pretty text-ink"
            style={{
              fontSize: "clamp(1.65rem, 3.2vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            {current.body}
          </blockquote>
          <div className="mt-12 flex items-center gap-4">
            <span aria-hidden className="inline-block h-px w-8 bg-ink" />
            <div>
              <div
                className="text-ink"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "1rem",
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

        {/* progress bars — visual anchor + click-to-jump */}
        <div className="mt-12 flex gap-2">
          {QUOTES.map((_, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1}`}
                data-cursor="hover"
                className="group relative h-1 w-20 overflow-hidden rounded-full bg-line transition-all hover:h-1.5"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 origin-left bg-ink"
                  key={`fill-${active}-${i}`}
                  style={{
                    width: "100%",
                    transform: isActive
                      ? "scaleX(1)"
                      : i < active
                      ? "scaleX(1)"
                      : "scaleX(0)",
                    transition: isActive
                      ? `transform ${paused ? 0 : ROTATE_MS}ms linear`
                      : "transform 0.3s",
                    transformOrigin: "left center",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
