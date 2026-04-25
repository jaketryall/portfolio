"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/motion/RevealText";
import { revealLetters } from "@/lib/reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Workshops, references, audits. Everything I need to understand the brief and where the bar should sit.",
    duration: "1 week",
  },
  {
    n: "02",
    title: "Design",
    body: "Type system, color, motion language, layouts. Decisions made in Figma and prototypes, not waterfall reviews.",
    duration: "2–3 weeks",
  },
  {
    n: "03",
    title: "Build",
    body: "I ship the design. Next.js, Tailwind, GSAP. Pixel-grade attention from production code, not hand-off.",
    duration: "4–8 weeks",
  },
  {
    n: "04",
    title: "Refine",
    body: "Two weeks of polish after launch. Real data, real performance, real iteration based on what's actually shipping.",
    duration: "2 weeks +",
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostLettersRef = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLSpanElement>(null);

  // ghost reveal
  useEffect(() => {
    const root = ghostRef.current;
    if (!root) return;
    const tl = revealLetters({
      letters: ghostLettersRef.current,
      weightFrom: 180,
      weightTo: 800,
      stagger: 0.045,
      scrollTrigger: { trigger: root, start: "top 85%" },
    });
    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  // card stagger entrance + line draw
  useEffect(() => {
    const el = ref.current;
    const line = lineRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll("[data-process-card]");
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play reverse play reverse" },
        }
      );
      // connecting line draws across the cards
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play reverse play reverse" },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="process"
      data-section="process"
      aria-label="Process"
      className="relative -mt-16 overflow-hidden rounded-t-[32px] rounded-b-[32px] px-6 py-24 md:-mt-24 md:rounded-t-[56px] md:rounded-b-[56px] md:px-12 md:py-40 lg:px-20"
      style={{
        background: "var(--color-canvas-2)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(14,14,14,0.05)",
      }}
    >
      <div className="contents">
        {/* ghost word — same motif as JAKE / RYALL / ABOUT / WORK */}
        <div
          ref={ghostRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none"
          style={{ zIndex: 0 }}
        >
          <div className="relative mx-auto h-full max-w-[1600px]">
            <div
              className="absolute right-0 top-32 overflow-hidden text-right md:top-40"
              style={{
                width: "min(900px, 70%)",
                fontFamily: "var(--font-sans)",
                color: "#ddd9cb",
                fontWeight: 800,
                letterSpacing: "-0.07em",
                lineHeight: 0.85,
                fontSize: "clamp(5rem, 13vw, 12rem)",
              }}
            >
              <span className="block overflow-hidden whitespace-nowrap">
                {Array.from("PROCESS").map((ch, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) ghostLettersRef.current[i] = el;
                    }}
                    className="inline-block"
                    style={{
                      color: "#ddd9cb",
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

        <div className="relative mx-auto max-w-[1600px]">
          <div className="mb-16 flex flex-col gap-8 md:mb-24">
            <h2
              className="display-black max-w-3xl text-ink"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)" }}
            >
              <RevealText
                as="span"
                splitBy="char"
                stagger={0.012}
                weightFrom={200}
                weightTo={800}
                className="block"
                start="top 85%"
              >
                A small team. A clear plan. Real output.
              </RevealText>
            </h2>
          </div>

        {/* connecting line between cards */}
        <div className="relative">
          <span
            ref={lineRef}
            aria-hidden
            className="absolute left-0 right-0 top-[44%] hidden h-px bg-ink lg:block"
            style={{ willChange: "transform" }}
          />

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {STEPS.map((s) => (
              <article
                key={s.n}
                data-process-card
                data-cursor="hover"
                className="group hover-lift relative flex flex-col gap-5 rounded-3xl bg-canvas p-7 md:p-8"
                style={{
                  willChange: "transform, opacity",
                  boxShadow:
                    "0 20px 60px -30px rgba(14,14,14,0.18), inset 0 0 0 1px rgba(14,14,14,0.06)",
                }}
              >
                {/* big step number */}
                <div className="flex items-baseline justify-between">
                  <span
                    className="text-ink"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(2.5rem, 4vw, 4rem)",
                      fontWeight: 700,
                      fontVariationSettings: '"wght" 700',
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      transition:
                        "font-variation-settings 0.45s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {s.n}
                  </span>
                  {/* dot anchor on the connecting line */}
                  <span
                    aria-hidden
                    className="hidden h-3 w-3 rounded-full bg-ink lg:block"
                    style={{ marginRight: "-1.75rem" }}
                  />
                </div>
                <h3
                  className="text-ink"
                  style={{
                    fontSize: "clamp(1.4rem, 2vw, 1.85rem)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {s.title}
                </h3>
                <p className="text-pretty text-base font-medium leading-relaxed text-ink-soft">
                  {s.body}
                </p>
                {/* duration micro-label */}
                <span
                  aria-hidden
                  className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold transition-transform duration-500 group-hover:translate-x-1"
                >
                  <span className="inline-block h-px w-6 bg-ink-soft transition-all duration-500 group-hover:w-10" />
                  {s.duration}
                </span>
              </article>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
