"use client";

import { Link } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AvailabilityPill } from "@/components/ui/AvailabilityPill";
import { motionBus } from "@/lib/motionBus";

const LINKS = [
  { label: "Index", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const rootRef = useRef<HTMLElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [logoHover, setLogoHover] = useState(false);

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

  // scroll response via motion bus (shared signal)
  useEffect(() => {
    const capsule = capsuleRef.current;
    const dot = dotRef.current;
    if (!capsule || !dot) return;

    const unsub = motionBus.subscribe(({ scrollProgress, scrollY }) => {
      // capsule compacts past first viewport
      const compact = scrollY > window.innerHeight * 0.6 ? 1 : 0;
      const pad = 6 - compact * 2;
      capsule.style.paddingTop = `${pad}px`;
      capsule.style.paddingBottom = `${pad}px`;
      capsule.style.boxShadow = compact
        ? "0 10px 40px -20px rgba(14,14,14,0.18)"
        : "none";

      // dot → conic scroll-progress ring (snaps to 100% when logo hovered)
      const p = logoHover ? 1 : scrollProgress;
      dot.style.background = `conic-gradient(var(--color-ink) ${p * 360}deg, rgba(14,14,14,0.15) 0)`;
    });
    return unsub;
  }, [logoHover]);

  return (
    <header
      ref={rootRef}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 md:py-5"
      style={{ willChange: "transform, opacity" }}
    >
      <Link
        href="/"
        aria-label="Jake Ryall — home"
        className="group inline-flex items-center gap-2.5 text-[13px] font-mono tracking-[0.18em] uppercase text-ink font-semibold"
        data-cursor="hover"
        onMouseEnter={() => setLogoHover(true)}
        onMouseLeave={() => setLogoHover(false)}
      >
        <span
          ref={dotRef}
          aria-hidden
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: "var(--color-ink)",
            willChange: "transform, background",
            transition: "background 0.4s",
          }}
        />
        <span className="nav-link relative inline-flex overflow-hidden">
          <span className="nav-link-inner">Jake Ryall</span>
          <span className="nav-link-clone">Jake Ryall</span>
        </span>
      </Link>

      <div
        ref={capsuleRef}
        className="glass pointer-events-auto hidden items-center gap-1 rounded-full px-2 md:flex"
        style={{ paddingTop: 6, paddingBottom: 6, transition: "box-shadow 0.4s" }}
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
