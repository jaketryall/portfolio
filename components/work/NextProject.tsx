"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import type { CoverTreatment } from "@/lib/coverTreatments";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function NextProject({
  project,
  treatment,
}: {
  project: Project;
  treatment: CoverTreatment;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cover = coverRef.current;
    if (!cover) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cover,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Next project"
      className="relative px-6 py-32 md:px-12 md:py-48 lg:px-20"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-10 bg-ink" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
            Next case
          </span>
        </div>

        <Link
          href={`/work/${project.slug}`}
          data-cursor="view"
          data-cursor-label="NEXT"
          className="group relative block"
        >
          <div
            className="relative aspect-[16/8] w-full overflow-hidden rounded-[28px] glass"
            style={{
              boxShadow:
                "0 40px 100px -40px rgba(14,14,14,0.28), inset 0 0 0 1px rgba(14,14,14,0.06)",
              background: treatment.bg,
              viewTransitionName: `cover-${project.slug}`,
            }}
          >
            <div
              ref={coverRef}
              className="absolute inset-[-8%]"
            >
              <Image
                src={project.cover}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
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
            {/* title overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-end p-8 md:p-14">
              <h3
                className="display-black max-w-3xl text-canvas"
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
              >
                {project.title}
              </h3>
            </div>
            {/* meta strip */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-10">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-canvas/90 font-semibold">
                {project.client} · {project.year}
              </span>
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-canvas/90 font-semibold">
                {project.role}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
