"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/motion/RevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Workshops, references, audits. Everything I need to understand the brief and where the bar should sit.",
  },
  {
    n: "02",
    title: "Design",
    body: "Type system, color, motion language, layouts. Decisions made in Figma and prototypes, not waterfall reviews.",
  },
  {
    n: "03",
    title: "Build",
    body: "I ship the design. Next.js, Tailwind, GSAP. Pixel-grade attention from production code, not hand-off.",
  },
  {
    n: "04",
    title: "Refine",
    body: "Two weeks of polish after launch. Real data, real performance, real iteration based on what's actually shipping.",
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
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
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="process"
      data-section="process"
      aria-label="Process"
      className="relative px-6 py-32 md:px-12 md:py-48 lg:px-20"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-10 bg-ink" />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
                Process
              </span>
            </div>
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
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {STEPS.map((s) => (
            <article
              key={s.n}
              data-process-card
              className="glass hover-lift relative flex flex-col gap-4 rounded-3xl p-7 md:p-8"
              style={{ willChange: "transform, opacity" }}
            >
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
                {s.n}
              </span>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
