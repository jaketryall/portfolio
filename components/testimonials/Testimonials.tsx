"use client";

import { useEffect, useRef } from "react";
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

/**
 * Three monumental statements, stacked vertically. No carousel, no headline,
 * no kicker. Each quote is a sustained moment — set huge, attribution treated
 * as typography (the name BECOMES a display element). Differentiates this
 * section from the card-grid pattern used everywhere else on the page.
 */
export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  // Per-quote letter reveal on the attribution name. Re-uses the shared
  // revealLetters primitive so motion vocabulary stays consistent with hero
  // / about / work / contact.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const groups = root.querySelectorAll<HTMLElement>("[data-quote-name]");
      groups.forEach((g) => {
        const letters = Array.from(
          g.querySelectorAll<HTMLElement>("[data-name-letter]")
        );
        revealLetters({
          letters,
          weightFrom: 200,
          weightTo: 800,
          stagger: 0.04,
          scrollTrigger: { trigger: g, start: "top 95%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Quote body fades in word-by-word via a lightweight stagger. We don't use
  // RevealText here because the body sits inline-block per word for control
  // over the open-quote glyph alignment.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const blocks = root.querySelectorAll<HTMLElement>("[data-quote-block]");
      blocks.forEach((block) => {
        const words = block.querySelectorAll<HTMLElement>("[data-word]");
        gsap.fromTo(
          words,
          { y: "60%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.018,
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Testimonials"
      className="relative overflow-hidden px-6 py-40 md:px-12 md:py-56 lg:px-20"
    >
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-32 md:gap-56">
        {QUOTES.map((q, i) => {
          // Right-align is a desktop affordance only — on mobile every quote
          // sits left so attribution can't slide under the bottom dock.
          const right = i % 2 === 1;
          return (
            <figure
              key={q.name}
              className={
                right
                  ? "max-w-4xl text-left md:ml-auto md:text-right"
                  : "max-w-4xl text-left"
              }
            >
              {/* Quote body — display-scale, words rise from a mask line.
                  Open-quote glyph is part of the body, not a decoration. */}
              <blockquote
                data-quote-block
                className="text-pretty text-ink"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(1.85rem, 4.2vw, 4.25rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                }}
              >
                {q.body.split(" ").map((w, wi) => (
                  <span
                    key={wi}
                    className="inline-block overflow-hidden align-bottom"
                    style={{
                      paddingTop: "0.18em",
                      paddingBottom: "0.18em",
                      marginTop: "-0.18em",
                      marginBottom: "-0.18em",
                    }}
                  >
                    <span data-word className="inline-block">
                      {w}
                      {wi < q.body.split(" ").length - 1 ? " " : ""}
                    </span>
                  </span>
                ))}
              </blockquote>

              {/* Attribution — name is set big and revealed letter-by-letter,
                  treated as a typographic element. Role drops to mono below. */}
              <figcaption
                className={
                  "mt-10 flex flex-col gap-1 items-start md:mt-14 " +
                  (right ? "md:items-end" : "")
                }
              >
                <span
                  data-quote-name
                  aria-label={q.name}
                  className="overflow-hidden"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "var(--color-ink)",
                    fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
                  }}
                >
                  {Array.from(q.name).map((ch, ci) => (
                    <span
                      key={ci}
                      data-name-letter
                      aria-hidden
                      className="inline-block whitespace-pre"
                      style={{ fontVariationSettings: '"wght" 200' }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft font-semibold">
                  {q.role}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
