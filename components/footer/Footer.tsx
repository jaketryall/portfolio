"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motionBus } from "@/lib/motionBus";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SlabAtmosphere } from "@/components/atmosphere/SlabAtmosphere";

const EMAIL = "hello@jakeryall.com";

type Social = { label: string; href: string; Icon: () => React.JSX.Element };

const SOCIALS: Social[] = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/jakeryall",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/jakeryall",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/jakeryall",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/jakeryall",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
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
      }}
    >
      <SlabAtmosphere />

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
              className="nav-link relative inline-flex py-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft hover:text-ink font-semibold"
            >
              <span className="nav-link-mask">
                <span className="nav-link-stack">
                  <span className="nav-link-inner">
                    {copied ? "Copied ✓" : "Copy email"}
                  </span>
                  <span className="nav-link-clone" aria-hidden>
                    {copied ? "Copied ✓" : "Copy email"}
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* socials — icon row, 44px hit targets, lift on hover */}
        <div className="mb-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8 md:mb-28">
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="hover"
                className="hover-lift inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                <span className="block h-[22px] w-[22px]">
                  <s.Icon />
                </span>
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
