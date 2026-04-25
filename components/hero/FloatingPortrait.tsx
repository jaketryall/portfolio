"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Single portrait element shared between Hero and About.
 * - Lives as an absolute child of [data-portrait-scrub="true"] (the Hero+About wrapper).
 * - Its initial position matches [data-portrait-target="hero"] (an invisible slot in Hero).
 * - Scroll-linked: tweens position/size to [data-portrait-target="about"] (slot in About).
 * - Cross-fades the image inside from hero-source to about-source mid-morph.
 */
export function FloatingPortrait({
  heroSrc,
  aboutSrc,
  alt,
}: {
  heroSrc: string;
  aboutSrc: string;
  alt: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const aboutImgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // page-load reveal
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(wrap, { opacity: 1, scale: 1, filter: "blur(0px)" });
      return;
    }
    gsap.set(wrap, { opacity: 0, scale: 1.08, filter: "blur(20px)" });
    gsap.to(wrap, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.6,
      ease: "expo.out",
      delay: 0.35,
    });
  }, []);

  // cursor tilt + rim-light follow
  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    const glow = glowRef.current;
    if (!wrap || !tilt || !glow) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const rX = gsap.quickTo(tilt, "rotateX", { duration: 0.6, ease: "power3.out" });
    const rY = gsap.quickTo(tilt, "rotateY", { duration: 0.6, ease: "power3.out" });
    const gX = gsap.quickTo(glow, "--mx", { duration: 0.3, ease: "power2.out" });
    const gY = gsap.quickTo(glow, "--my", { duration: 0.3, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      if (px < -0.2 || px > 1.2 || py < -0.2 || py > 1.2) return;
      rY((px - 0.5) * 12);
      rX(-(py - 0.5) * 10);
      gX(px * 100);
      gY(py * 100);
    };
    const onLeave = () => {
      rX(0); rY(0); gX(50); gY(50);
    };

    window.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // scroll-linked position morph + image crossfade
  useEffect(() => {
    const wrap = wrapRef.current;
    const hero = heroImgRef.current;
    const about = aboutImgRef.current;
    if (!wrap || !hero || !about) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let triggers: ScrollTrigger[] = [];
    let sizeTween: gsap.core.Tween | null = null;

    const applyInitial = (
      heroSlot: HTMLElement,
      scrubWrapper: HTMLElement
    ) => {
      const wrapperRect = scrubWrapper.getBoundingClientRect();
      const heroRect = heroSlot.getBoundingClientRect();
      const scrollY = window.scrollY;
      const wrapperDocTop = wrapperRect.top + scrollY;
      const wrapperDocLeft = wrapperRect.left;
      const heroTopRel = heroRect.top + scrollY - wrapperDocTop;
      const heroLeftRel = heroRect.left - wrapperDocLeft;
      gsap.set(wrap, {
        position: "absolute",
        top: heroTopRel,
        left: heroLeftRel,
        width: heroRect.width,
        height: heroRect.height,
      });
    };

    const setup = () => {
      const heroSlot = document.querySelector<HTMLElement>(
        '[data-portrait-target="hero"]'
      );
      const aboutSlot = document.querySelector<HTMLElement>(
        '[data-portrait-target="about"]'
      );
      const scrubWrapper = document.querySelector<HTMLElement>(
        '[data-portrait-scrub="true"]'
      );
      if (!heroSlot || !aboutSlot || !scrubWrapper) return;

      // kill prior
      triggers.forEach((t) => t.kill());
      triggers = [];
      sizeTween?.kill();
      sizeTween = null;

      applyInitial(heroSlot, scrubWrapper);

      if (reduce) return;

      const measure = () => {
        const wrapperRect = scrubWrapper.getBoundingClientRect();
        const heroRect = heroSlot.getBoundingClientRect();
        const aboutRect = aboutSlot.getBoundingClientRect();
        const scrollY = window.scrollY;
        const wrapperDocTop = wrapperRect.top + scrollY;
        const wrapperDocLeft = wrapperRect.left;
        return {
          heroTop: heroRect.top + scrollY - wrapperDocTop,
          heroLeft: heroRect.left - wrapperDocLeft,
          heroWidth: heroRect.width,
          heroHeight: heroRect.height,
          aboutTop: aboutRect.top + scrollY - wrapperDocTop,
          aboutLeft: aboutRect.left - wrapperDocLeft,
          aboutWidth: aboutRect.width,
          aboutHeight: aboutRect.height,
        };
      };

      const dims = measure();

      // ensure the wrap is at the hero slot initially
      gsap.set(wrap, {
        top: dims.heroTop,
        left: dims.heroLeft,
        width: dims.heroWidth,
        height: dims.heroHeight,
      });
      gsap.set(hero, { opacity: 1 });
      gsap.set(about, { opacity: 0 });

      // position/size tween — scroll-linked to the hero section's exit
      sizeTween = gsap.to(wrap, {
        top: dims.aboutTop,
        left: dims.aboutLeft,
        width: dims.aboutWidth,
        height: dims.aboutHeight,
        ease: "none",
        scrollTrigger: {
          trigger: heroSlot,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            const d = measure();
            // reset start
            self.animation?.invalidate();
            gsap.set(wrap, {
              top: d.heroTop,
              left: d.heroLeft,
              width: d.heroWidth,
              height: d.heroHeight,
            });
          },
        },
      });
      if (sizeTween.scrollTrigger) triggers.push(sizeTween.scrollTrigger);

      // image cross-fade — happens in the back half of the morph
      const tw1 = gsap.to(hero, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroSlot,
          start: "center top",
          end: "bottom top",
          scrub: true,
        },
      });
      const tw2 = gsap.to(about, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroSlot,
          start: "center top",
          end: "bottom top",
          scrub: true,
        },
      });
      if (tw1.scrollTrigger) triggers.push(tw1.scrollTrigger);
      if (tw2.scrollTrigger) triggers.push(tw2.scrollTrigger);
    };

    // setup runs on raf+timeout; then again after fonts/layout settle (300ms,
    // 800ms) so the about slot's final position is measured correctly
    // post-margin/padding shifts
    const raf = requestAnimationFrame(() => setTimeout(setup, 80));
    const t1 = window.setTimeout(setup, 300);
    const t2 = window.setTimeout(setup, 900);

    if ("fonts" in document) {
      document.fonts.ready.then(() => setup());
    }

    const ro = new ResizeObserver(() => setup());
    ro.observe(document.body);
    window.addEventListener("resize", setup);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", setup);
      ro.disconnect();
      triggers.forEach((t) => t.kill());
      sizeTween?.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto z-20"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 520,
        height: 650,
        opacity: 0,
        willChange: "transform, top, left, width, height, opacity, filter",
      }}
    >
      <div
        ref={tiltRef}
        className="relative h-full w-full rounded-[28px] transform-3d"
        style={{ transformOrigin: "50% 50%", willChange: "transform", perspective: 1400 }}
      >
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[29px] opacity-60"
          style={{
            ["--mx" as string]: "50",
            ["--my" as string]: "50",
            background:
              "radial-gradient(60% 60% at calc(var(--mx) * 1%) calc(var(--my) * 1%), rgba(255,255,255,0.85), rgba(255,255,255,0.06) 55%, transparent 70%)",
            filter: "blur(28px)",
          }}
        />
        <div
          className="glass relative h-full w-full overflow-hidden rounded-[28px]"
          style={{
            boxShadow:
              "0 30px 80px -30px rgba(14,14,14,0.28), 0 2px 8px rgba(14,14,14,0.06), inset 0 0 0 1px rgba(14,14,14,0.08)",
          }}
        >
          <div ref={heroImgRef} className="absolute inset-0">
            <Image
              src={heroSrc}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover transform-[scale(1.06)]"
            />
          </div>
          <div
            ref={aboutImgRef}
            className="absolute inset-0"
            style={{ opacity: 0 }}
          >
            <Image
              src={aboutSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover transform-[scale(1.06)]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 50%, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
