"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motionBus } from "@/lib/motionBus";
import { MagneticButton } from "@/components/motion/MagneticButton";

const EMAIL = "hello@jakeryall.com";

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/jakeryall" },
  { label: "Twitter", href: "https://twitter.com/jakeryall" },
  { label: "Dribbble", href: "https://dribbble.com/jakeryall" },
  { label: "Read.cv", href: "https://read.cv/jakeryall" },
];

export function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // marquee speed couples to scroll velocity (same signal as ToolsMarquee)
  useEffect(() => {
    const track = marqueeRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: reduce ? 0 : 28,
      repeat: reduce ? 0 : -1,
    });
    if (reduce) base.progress(0).pause();

    const unsub = motionBus.subscribe(({ scrollVelocity }) => {
      const v = Math.abs(scrollVelocity) * 5;
      gsap.to(base, {
        timeScale: 1 + v,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    return () => {
      unsub();
      base.kill();
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const items = ["JAKE RYALL", "JAKE RYALL", "JAKE RYALL", "JAKE RYALL"];
  const doubled = [...items, ...items];

  return (
    <footer
      id="contact"
      data-section="contact"
      aria-label="Contact"
      className="relative -mt-16 overflow-hidden rounded-t-[32px] px-6 pb-10 pt-32 md:-mt-24 md:rounded-t-[56px] md:px-12 md:pb-12 md:pt-44 lg:px-20"
      style={{
        background: "var(--color-canvas-2)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(14,14,14,0.05)",
      }}
    >
      <div className="relative mx-auto max-w-[1600px]">
        {/* CTA */}
        <div className="mb-20 flex flex-col items-start gap-10 md:mb-28 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6">
            <h2
              className="display-black max-w-4xl text-ink"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
            >
              Have a project in mind? <br />
              <span className="text-ink-soft">Let&rsquo;s talk.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <MagneticButton
              as="a"
              href={`mailto:${EMAIL}`}
              data-cursor="view"
              data-cursor-label="WRITE"
              className="rounded-full bg-ink px-8 py-5 font-mono text-[13px] tracking-[0.2em] uppercase text-canvas font-semibold"
            >
              {EMAIL}
            </MagneticButton>
            <button
              type="button"
              onClick={handleCopy}
              data-cursor="hover"
              className="nav-link relative inline-flex overflow-hidden font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft hover:text-ink font-semibold"
            >
              <span className="nav-link-inner">
                {copied ? "Copied ✓" : "Copy email"}
              </span>
              <span className="nav-link-clone">
                {copied ? "Copied ✓" : "Copy email"}
              </span>
            </button>
          </div>
        </div>

        {/* socials */}
        <div className="mb-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8 md:mb-28">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="nav-link relative inline-flex overflow-hidden font-mono text-[12px] tracking-[0.18em] uppercase text-ink font-semibold"
              >
                <span className="nav-link-inner">{s.label}</span>
                <span className="nav-link-clone">{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* full-bleed name marquee */}
      <div className="relative -mx-6 overflow-hidden md:-mx-12 lg:-mx-20">
        <div
          ref={marqueeRef}
          className="flex w-max will-change-transform"
          style={{ gap: 0 }}
          aria-hidden
        >
          {doubled.map((label, i) => (
            <span
              key={i}
              className="flex items-center gap-12 px-12 font-sans text-ink"
              style={{
                fontSize: "clamp(4rem, 14vw, 14rem)",
                fontWeight: 800,
                fontVariationSettings: '"wght" 800',
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}
            >
              {label}
              <span
                aria-hidden
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ background: "var(--color-ink)" }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* tiny footer bottom row */}
      <div className="mt-12 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
        <span>© {new Date().getFullYear()} Jake Ryall</span>
        <span>Crafted in Scottsdale</span>
      </div>
    </footer>
  );
}
