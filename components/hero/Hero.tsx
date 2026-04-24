"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroNameBackdrop, type HeroBackdropHandle } from "./HeroNameBackdrop";
import { RevealText } from "@/components/motion/RevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HeroBackdropHandle>(null);

  // orchestrated page-load cascade + kinetic storm trigger
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(scrollHintRef.current, { opacity: 0.85 });
        return;
      }

      gsap.set(scrollHintRef.current, { opacity: 0, y: 10 });
      gsap.to(scrollHintRef.current, {
        opacity: 0.85,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        delay: 1.8,
      });

      // scroll-hint bar loop
      gsap.to(scrollHintRef.current?.querySelector("[data-bar]") ?? null, {
        scaleY: 0.3,
        transformOrigin: "top",
        duration: 1.4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Kinetic storm: triggered by scroll through the hero section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => backdropRef.current?.kineticStorm(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative min-h-svh"
      aria-label="Introduction"
    >
      {/* ghost name backdrop — absolute, centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HeroNameBackdrop ref={backdropRef} first="JAKE" last="RYALL" />
      </div>

      {/* portrait slot — invisible, provides the size/position the floating portrait reads */}
      <div className="relative mx-auto flex min-h-svh max-w-[1600px] items-center justify-center px-6 md:px-12">
        <div
          ref={slotRef}
          data-portrait-target="hero"
          className="relative w-[min(78vw,520px)] aspect-4/5"
          aria-hidden
        />
      </div>

      {/* tagline — bottom-left, with char-stagger reveal */}
      <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between gap-6 md:bottom-12 md:left-12 md:right-12">
        <div className="max-w-md">
          <RevealText
            as="p"
            splitBy="char"
            stagger={0.012}
            weightFrom={300}
            weightTo={500}
            delay={1.1}
            className="text-pretty text-base leading-snug font-medium text-ink-soft md:text-lg"
          >
            Web designer based in Scottsdale, AZ.
          </RevealText>
          <br />
          <RevealText
            as="span"
            splitBy="char"
            stagger={0.014}
            weightFrom={400}
            weightTo={700}
            delay={1.4}
            className="text-ink md:text-lg"
          >
            I design interfaces that move.
          </RevealText>
        </div>

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
