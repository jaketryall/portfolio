"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AvailabilityPill } from "@/components/ui/AvailabilityPill";

const LINKS = [
  { label: "Index", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "mailto:hello@jakeryall.com" },
];

export function Nav() {
  const rootRef = useRef<HTMLElement>(null);

  // entrance reveal
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { yPercent: -120, opacity: 0 });
      gsap.to(el, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.6,
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
      {/* logotype */}
      <Link
        href="/"
        aria-label="Jake Ryall — home"
        className="group inline-flex items-center gap-2 text-[13px] font-mono tracking-[0.18em] uppercase text-ink"
        data-cursor="hover"
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-125"
          style={{ backgroundColor: "var(--color-ink)" }}
        />
        <span className="nav-link relative inline-flex overflow-hidden">
          <span className="nav-link-inner">Jake Ryall</span>
          <span className="nav-link-clone">Jake Ryall</span>
        </span>
      </Link>

      {/* center links — glass capsule */}
      <nav
        aria-label="Primary"
        className="glass pointer-events-auto hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex"
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="nav-link group relative inline-flex items-center rounded-full px-4 py-2 text-[13px] font-mono tracking-[0.18em] uppercase text-ink"
            data-cursor="hover"
          >
            <span className="nav-link-inner">{l.label}</span>
            <span className="nav-link-clone">{l.label}</span>
          </Link>
        ))}
      </nav>

      {/* right side — availability */}
      <div className="hidden md:block">
        <AvailabilityPill>Available · Q3 2026</AvailabilityPill>
      </div>

      {/* mobile — simple label */}
      <span className="md:hidden">
        <AvailabilityPill>Available</AvailabilityPill>
      </span>
    </header>
  );
}
