"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroNameBackdrop, type HeroBackdropHandle } from "./HeroNameBackdrop";
import { RevealText } from "@/components/motion/RevealText";
import { motionBus } from "@/lib/motionBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLSpanElement>(null);
  const backdropRef = useRef<HeroBackdropHandle>(null);

  // page-load cascade + kinetic storm trigger
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(scrollHintRef.current, { opacity: 0, y: 10 });
        gsap.to(scrollHintRef.current, {
          opacity: 0.9,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 1.8,
        });
      } else {
        gsap.set(scrollHintRef.current, { opacity: 0.9 });
      }

      // kinetic storm driven by scroll through hero
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => backdropRef.current?.kineticStorm(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Meaningful scroll hint — bar shrinks with scroll progress; hides past hero
  useEffect(() => {
    const bar = scrollBarRef.current;
    const hint = scrollHintRef.current;
    if (!bar || !hint) return;

    const unsub = motionBus.subscribe(({ scrollY }) => {
      const vh = window.innerHeight;
      // local 0..1 progress through hero specifically (not whole doc)
      const heroP = gsap.utils.clamp(0, 1, scrollY / vh);
      bar.style.transform = `scaleY(${1 - heroP})`;
      hint.style.opacity = String(Math.max(0, 0.9 - heroP * 1.6));
    });
    return unsub;
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative min-h-svh"
      aria-label="Introduction"
    >
      {/* ghost name backdrop — centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HeroNameBackdrop ref={backdropRef} first="JAKE" last="RYALL" />
      </div>

      {/* portrait slot — invisible; floating portrait reads its dimensions */}
      <div className="relative mx-auto flex min-h-svh max-w-[1600px] items-center justify-center px-6 md:px-12">
        <div
          ref={slotRef}
          data-portrait-target="hero"
          data-cursor="view"
          data-cursor-label="JAKE"
          className="relative w-[min(78vw,520px)] aspect-4/5"
          aria-hidden
        />
      </div>

      {/* tagline + scroll hint */}
      <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between gap-6 md:bottom-12 md:left-12 md:right-12">
        <div className="max-w-md">
          <RevealText
            as="p"
            splitBy="word"
            stagger={0.04}
            delay={1.1}
            className="text-pretty text-base leading-snug font-medium text-ink-soft md:text-lg"
          >
            Web designer based in Scottsdale, AZ.
          </RevealText>
          <br />
          <RevealText
            as="span"
            splitBy="word"
            stagger={0.05}
            delay={1.4}
            className="text-ink font-semibold md:text-lg"
          >
            I design interfaces that move.
          </RevealText>
        </div>

        <div
          ref={scrollHintRef}
          className="hidden items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ink font-semibold md:flex"
          style={{ willChange: "opacity" }}
        >
          <span>Scroll</span>
          <span
            ref={scrollBarRef}
            className="inline-block h-8 w-px origin-top bg-ink"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>
    </section>
  );
}
