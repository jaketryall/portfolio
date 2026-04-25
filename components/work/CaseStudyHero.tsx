"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/motion/RevealText";
import type { CoverTreatment } from "@/lib/coverTreatments";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  slug: string;
  title: string;
  client: string;
  year: number;
  role: string;
  cover: string;
  summary: string;
  treatment: CoverTreatment;
};

export function CaseStudyHero({ slug, title, client, year, role, cover, summary, treatment }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // scroll-linked: cover scales down + parallaxes slightly as user scrolls into the body
  useEffect(() => {
    const section = sectionRef.current;
    const cover = coverRef.current;
    const inner = innerRef.current;
    if (!section || !cover || !inner) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.to(inner, {
        yPercent: 14,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 pt-32 md:px-12 md:pt-44 lg:px-20"
      aria-label={`${title} — case study`}
    >
      <div className="mx-auto max-w-[1600px]">
        {/* meta header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-10 bg-ink" />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
                {client} · {year}
              </span>
            </div>
            <h1
              className="display-black mt-4 max-w-4xl text-ink"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)" }}
            >
              <RevealText
                as="span"
                splitBy="char"
                stagger={0.012}
                weightFrom={200}
                weightTo={800}
                delay={0.2}
                start="top 95%"
              >
                {title}
              </RevealText>
            </h1>
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft font-semibold">
              Role
            </span>
            <span
              className="text-ink"
              style={{
                fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                fontWeight: 600,
              }}
            >
              {role}
            </span>
          </div>
        </div>

        {/* cover — view-transition target from the project card. The
            view-transition-name lives on the rounded outer container, AND
            the same per-slug duotone treatment is applied so the morph is
            visually continuous (rounded shape + same tinted look). */}
        <div
          ref={coverRef}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] glass"
          style={{
            boxShadow:
              "0 40px 100px -40px rgba(14,14,14,0.28), inset 0 0 0 1px rgba(14,14,14,0.06)",
            background: treatment.bg,
            viewTransitionName: `cover-${slug}`,
          }}
        >
          <div ref={innerRef} className="absolute inset-[-7%]">
            <Image
              src={cover}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{
                filter: treatment.filter,
                mixBlendMode: treatment.blend,
                opacity: treatment.opacity,
              }}
            />
          </div>
          {/* tonal wash matching the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ background: treatment.wash }}
          />
        </div>

        {/* summary below cover */}
        <p className="mt-10 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-ink-soft md:mt-14 md:text-xl">
          {summary}
        </p>
      </div>
    </section>
  );
}
