"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AvailabilityPill } from "@/components/ui/AvailabilityPill";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINKS = [
  { label: "Index", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "mailto:hello@jakeryall.com" },
];

export function Nav() {
  const rootRef = useRef<HTMLElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // entrance reveal + scroll response
  useEffect(() => {
    const el = rootRef.current;
    const capsule = capsuleRef.current;
    const dot = dotRef.current;
    if (!el || !capsule || !dot) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(el, { yPercent: -120, opacity: 0 });
        gsap.to(el, {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          delay: 0.6,
        });
      }

      // scroll response — nav tightens past hero and dot morphs into a
      // scroll-progress indicator (same motion-system signal as the marquee
      // velocity and ghost-name storm).
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // compact capsule past first viewport
          const compact = self.scroll() > window.innerHeight * 0.6;
          gsap.to(capsule, {
            paddingTop: compact ? 4 : 6,
            paddingBottom: compact ? 4 : 6,
            boxShadow: compact
              ? "0 10px 40px -20px rgba(14,14,14,0.18)"
              : "none",
            duration: 0.4,
            ease: "power2.out",
          });
          // dot becomes a conic progress ring
          const p = gsap.utils.clamp(0, 1, self.progress);
          dot.style.background = `conic-gradient(var(--color-ink) ${p * 360}deg, rgba(14,14,14,0.15) 0)`;
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={rootRef}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 md:py-5"
      style={{ willChange: "transform, opacity" }}
    >
      {/* logotype — dot becomes scroll-progress ring */}
      <Link
        href="/"
        aria-label="Jake Ryall — home"
        className="group inline-flex items-center gap-2.5 text-[13px] font-mono tracking-[0.18em] uppercase text-ink font-semibold"
        data-cursor="hover"
      >
        <span
          ref={dotRef}
          aria-hidden
          className="inline-block h-2.5 w-2.5 rounded-full transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
          style={{ backgroundColor: "var(--color-ink)" }}
        />
        <span className="nav-link relative inline-flex overflow-hidden">
          <span className="nav-link-inner">Jake Ryall</span>
          <span className="nav-link-clone">Jake Ryall</span>
        </span>
      </Link>

      {/* center glass capsule */}
      <div
        ref={capsuleRef}
        className="glass pointer-events-auto hidden items-center gap-1 rounded-full px-2 md:flex"
        style={{ paddingTop: 6, paddingBottom: 6 }}
      >
        <nav aria-label="Primary" className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link group relative inline-flex items-center rounded-full px-4 py-2 text-[13px] font-mono tracking-[0.18em] uppercase text-ink font-semibold"
              data-cursor="hover"
            >
              <span className="nav-link-inner">{l.label}</span>
              <span className="nav-link-clone">{l.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="hidden md:block">
        <AvailabilityPill>Available · Q3 2026</AvailabilityPill>
      </div>
      <span className="md:hidden">
        <AvailabilityPill>Available</AvailabilityPill>
      </span>
    </header>
  );
}
