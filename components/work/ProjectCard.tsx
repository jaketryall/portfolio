"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Six distinct duotone/wash treatments. Each card pulls one based on its
 * index so the same placeholder source image renders as visually unique
 * compositions across the grid.
 */
const COVER_TREATMENTS = [
  // 1. graphite + cream typeblock (Atlas)
  {
    bg: "#0e0e0e",
    filter: "grayscale(1) contrast(1.05) brightness(0.55)",
    blend: "luminosity" as const,
    opacity: 0.55,
    wash: "linear-gradient(135deg, rgba(14,14,14,0.55), rgba(14,14,14,0.15))",
    titleColor: "#fcfcfb",
    titleShadow: "none",
    metaColor: "rgba(252,252,251,0.9)",
  },
  // 2. soft cream + sage tint (North)
  {
    bg: "#dbe6dc",
    filter: "grayscale(0.7) contrast(0.95) brightness(1.05)",
    blend: "multiply" as const,
    opacity: 0.45,
    wash: "linear-gradient(180deg, rgba(43,182,115,0.18), rgba(14,14,14,0.04))",
    titleColor: "#0e0e0e",
    titleShadow: "none",
    metaColor: "#0e0e0e",
  },
  // 3. high-contrast b&w (Folio)
  {
    bg: "#fcfcfb",
    filter: "grayscale(1) contrast(1.4) brightness(0.95)",
    blend: "normal" as const,
    opacity: 0.85,
    wash: "linear-gradient(180deg, rgba(252,252,251,0.0) 60%, rgba(14,14,14,0.4))",
    titleColor: "#fcfcfb",
    titleShadow: "0 2px 30px rgba(14,14,14,0.45)",
    metaColor: "#fcfcfb",
  },
  // 4. warm clay (Sundial)
  {
    bg: "#caa581",
    filter: "grayscale(0.9) sepia(0.3) contrast(1) brightness(0.95)",
    blend: "multiply" as const,
    opacity: 0.65,
    wash: "linear-gradient(135deg, rgba(202,165,129,0.35), rgba(14,14,14,0.18))",
    titleColor: "#0e0e0e",
    titleShadow: "none",
    metaColor: "#0e0e0e",
  },
  // 5. cool slate (Orbit)
  {
    bg: "#1a2330",
    filter: "grayscale(0.95) contrast(1.05) brightness(0.6)",
    blend: "luminosity" as const,
    opacity: 0.5,
    wash: "linear-gradient(135deg, rgba(26,35,48,0.6), rgba(26,35,48,0.2))",
    titleColor: "#fcfcfb",
    titleShadow: "none",
    metaColor: "rgba(252,252,251,0.9)",
  },
  // 6. paper-white minimal (Quill)
  {
    bg: "#f4f2ee",
    filter: "grayscale(1) contrast(0.85) brightness(1.1)",
    blend: "multiply" as const,
    opacity: 0.35,
    wash: "linear-gradient(180deg, rgba(244,242,238,0.0), rgba(14,14,14,0.06))",
    titleColor: "#0e0e0e",
    titleShadow: "none",
    metaColor: "#0e0e0e",
  },
];

type Props = {
  project: Project;
  /** index in the grid — used for offset stagger */
  index: number;
};

export function ProjectCard({ project, index }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // scroll-linked subtle parallax on the cover image
  useEffect(() => {
    const card = cardRef.current;
    const cover = coverRef.current;
    if (!card || !cover) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.set(cover, { yPercent: -6 });
      gsap.to(cover, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // entrance reveal — fades in as it enters viewport
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          delay: (index % 2) * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  // hover affordance on the cover scale + title weight bump
  const handleEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(coverRef.current, {
      scale: 1.04,
      duration: 0.6,
      ease: "expo.out",
    });
    if (titleRef.current) {
      titleRef.current.style.fontVariationSettings = '"wght" 800';
    }
  };
  const handleLeave = () => {
    gsap.to(coverRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "expo.out",
    });
    if (titleRef.current) {
      titleRef.current.style.fontVariationSettings = '"wght" 600';
    }
  };

  // alternate column offset for staggered grid feel (azizkhaldi inspiration)
  const offsetClass = index % 2 === 1 ? "md:translate-y-24" : "";

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor="view"
      data-cursor-label="VIEW"
      className={cn(
        "group relative block",
        offsetClass
      )}
      style={{ willChange: "transform, opacity" }}
    >
      {/* cover with parallax + view-transition name */}
      <div
        className="relative aspect-4/5 w-full overflow-hidden rounded-[24px] glass"
        style={{
          boxShadow:
            "0 30px 80px -30px rgba(14,14,14,0.22), inset 0 0 0 1px rgba(14,14,14,0.06)",
          background: COVER_TREATMENTS[index % COVER_TREATMENTS.length].bg,
        }}
      >
        <div
          ref={coverRef}
          className="absolute inset-[-6%]"
          style={{
            viewTransitionName: `cover-${project.slug}`,
            willChange: "transform",
          }}
        >
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
            style={{
              filter: COVER_TREATMENTS[index % COVER_TREATMENTS.length].filter,
              mixBlendMode: COVER_TREATMENTS[index % COVER_TREATMENTS.length].blend,
              opacity: COVER_TREATMENTS[index % COVER_TREATMENTS.length].opacity,
            }}
          />
        </div>
        {/* tonal wash on top — varies per card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background: COVER_TREATMENTS[index % COVER_TREATMENTS.length].wash,
          }}
        />
        {/* big title overlay — visible until hover */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
          <span
            aria-hidden
            className="text-center"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: COVER_TREATMENTS[index % COVER_TREATMENTS.length].titleColor,
              textShadow: COVER_TREATMENTS[index % COVER_TREATMENTS.length].titleShadow,
            }}
          >
            {project.title.split(" — ")[0]}
          </span>
        </div>
        {/* meta strip — bottom of card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-5 py-4">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold" style={{ color: COVER_TREATMENTS[index % COVER_TREATMENTS.length].metaColor }}>
            {project.year}
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold" style={{ color: COVER_TREATMENTS[index % COVER_TREATMENTS.length].metaColor }}>
            {project.role}
          </span>
        </div>
      </div>

      {/* title block below cover */}
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3
          ref={titleRef}
          className="text-ink"
          style={{
            fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontVariationSettings: '"wght" 600',
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            transition: "font-variation-settings 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {project.title}
        </h3>
        <span
          aria-hidden
          className="shrink-0 font-mono text-[12px] tracking-[0.16em] uppercase text-ink-soft transition-transform duration-500 group-hover:translate-x-1"
        >
          ↗
        </span>
      </div>
      <p className="mt-2 max-w-md text-pretty text-sm font-medium leading-relaxed text-ink-soft">
        {project.summary}
      </p>
    </Link>
  );
}
