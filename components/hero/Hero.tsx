"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortraitFrame } from "./PortraitFrame";
import { HeroNameBackdrop, type HeroBackdropHandle } from "./HeroNameBackdrop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HeroBackdropHandle>(null);

  // page-load reveal
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([portraitRef.current, taglineRef.current, scrollHintRef.current], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
        });
        return;
      }

      gsap.set(portraitRef.current, {
        opacity: 0,
        scale: 1.08,
        filter: "blur(20px)",
      });
      gsap.set(taglineRef.current, { opacity: 0, y: 20 });
      gsap.set(scrollHintRef.current, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(portraitRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.6,
        ease: "expo.out",
      })
        .to(
          taglineRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=1.1"
        )
        .to(
          scrollHintRef.current,
          { opacity: 0.85, y: 0, duration: 0.7, ease: "expo.out" },
          "-=0.6"
        );

      // floating scroll hint loop
      gsap.to(scrollHintRef.current?.querySelector("[data-bar]") ?? null, {
        scaleY: 0.3,
        transformOrigin: "top",
        duration: 1.4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // scroll-linked hero → about morph
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        onUpdate: (self) => {
          backdropRef.current?.kineticStorm(self.progress);
        },
      });

      gsap.to(portraitRef.current, {
        scale: 0.42,
        xPercent: -34,
        yPercent: 85,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%",
          scrub: 0.8,
        },
      });

      gsap.to([taglineRef.current, scrollHintRef.current], {
        opacity: 0,
        y: -20,
        ease: "power2.in",
        stagger: 0.04,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=30%",
          scrub: true,
        },
      });

      return () => {
        trigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh overflow-hidden"
      aria-label="Introduction"
    >
      {/* ghost name backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HeroNameBackdrop ref={backdropRef} first="JAKE" last="RYALL" />
      </div>

      {/* foreground portrait */}
      <div className="relative mx-auto flex min-h-svh max-w-[1600px] items-center justify-center px-6 md:px-12">
        <div
          ref={portraitRef}
          className="relative w-[min(78vw,520px)] will-change-transform"
          style={{ transformOrigin: "50% 100%" }}
        >
          <PortraitFrame
            src="/images/hero-source.jpg"
            alt="Jake Ryall — portrait"
            priority
            aspect="4/5"
          />
        </div>
      </div>

      {/* tagline — bottom-left */}
      <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between gap-6 md:bottom-12 md:left-12 md:right-12">
        <p
          ref={taglineRef}
          className="max-w-md text-pretty text-base leading-snug font-medium text-ink-soft md:text-lg"
        >
          Web designer based in Scottsdale, AZ.
          <br />
          <span className="text-ink font-semibold">I design interfaces that move.</span>
        </p>

        {/* scroll hint */}
        <div
          ref={scrollHintRef}
          className="hidden items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ink md:flex"
        >
          <span>Scroll</span>
          <span
            data-bar
            className="inline-block h-8 w-px origin-top bg-ink"
          />
        </div>
      </div>
    </section>
  );
}
