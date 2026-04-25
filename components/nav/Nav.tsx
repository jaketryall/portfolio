"use client";

import { Link } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { AvailabilityPill } from "@/components/ui/AvailabilityPill";
import { motionBus } from "@/lib/motionBus";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const rootRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [logoHover, setLogoHover] = useState(false);
  const pathname = usePathname();

  // entrance reveal — top bar drops in, mobile dock rises from below
  useEffect(() => {
    const top = rootRef.current;
    const dock = dockRef.current;
    if (!top) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.set(top, { yPercent: -120, opacity: 0 });
      gsap.to(top, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.6,
      });
      if (dock) {
        gsap.set(dock, { yPercent: 140, opacity: 0 });
        gsap.to(dock, {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          delay: 0.85,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // scroll response via motion bus
  useEffect(() => {
    const capsule = capsuleRef.current;
    const dot = dotRef.current;
    if (!capsule || !dot) return;

    const unsub = motionBus.subscribe(({ scrollProgress, scrollY }) => {
      const compact = scrollY > window.innerHeight * 0.6 ? 1 : 0;
      const pad = 6 - compact * 2;
      capsule.style.paddingTop = `${pad}px`;
      capsule.style.paddingBottom = `${pad}px`;
      capsule.style.boxShadow = compact
        ? "0 10px 40px -20px rgba(14,14,14,0.18)"
        : "none";

      const p = logoHover ? 1 : scrollProgress;
      dot.style.background = `conic-gradient(var(--color-ink) ${p * 360}deg, rgba(14,14,14,0.15) 0)`;
    });
    return unsub;
  }, [logoHover]);

  // helper — current route highlighting in the dock
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Top fade mask — mobile only. Fades scroll content into the canvas
          before it reaches the nav so big marquees / display text don't bleed
          through the glass dock. Desktop has enough room to let the page
          scroll under the glass cleanly without a white shelf. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--color-canvas) 0%, var(--color-canvas) 55%, rgba(252,252,251,0) 100%)",
        }}
      />

      {/* TOP BAR — logo + availability pill (visible on all sizes) */}
      <header
        ref={rootRef}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 md:py-5"
        style={{ willChange: "transform, opacity" }}
      >
        <Link
          href="/"
          className="glass group inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-mono tracking-[0.18em] uppercase text-ink font-semibold"
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
          <span className="nav-link relative inline-flex">
            <span className="nav-link-mask">
              <span className="nav-link-stack">
                <span className="nav-link-inner">Jake Ryall</span>
                <span className="nav-link-clone" aria-hidden>
                  Jake Ryall
                </span>
              </span>
            </span>
          </span>
        </Link>

        {/* Desktop center capsule — links live here on md+ */}
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
                <span className="nav-link-mask">
                  <span className="nav-link-stack">
                    <span className="nav-link-inner">{l.label}</span>
                    <span className="nav-link-clone" aria-hidden>
                      {l.label}
                    </span>
                  </span>
                </span>
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

      {/* MOBILE DOCK — bottom-anchored glass capsule with the 4 links.
          Same visual language as the desktop center capsule, but pinned
          to the bottom of viewport for thumb-reach. Hidden on md+. */}
      <nav
        ref={dockRef}
        aria-label="Primary mobile"
        className="fixed bottom-0 left-1/2 z-40 -translate-x-1/2 px-4 md:hidden"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="glass flex items-center gap-1 rounded-full p-1.5"
          style={{
            boxShadow:
              "0 12px 40px -12px rgba(14,14,14,0.28), 0 0 0 1px rgba(14,14,14,0.06)",
          }}
        >
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link group relative inline-flex min-h-[44px] items-center rounded-full px-4 py-3 font-mono text-[12px] tracking-[0.18em] uppercase text-ink font-semibold transition-colors"
                style={{
                  background: active
                    ? "var(--color-ink)"
                    : "transparent",
                  color: active ? "var(--color-canvas)" : "var(--color-ink)",
                }}
                data-cursor="hover"
              >
                <span className="nav-link-mask">
                  <span className="nav-link-stack">
                    <span className="nav-link-inner">{l.label}</span>
                    <span className="nav-link-clone" aria-hidden>
                      {l.label}
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
