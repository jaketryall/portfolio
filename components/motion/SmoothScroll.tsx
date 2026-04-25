"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionBus } from "@/lib/motionBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Warm up the motion bus so early subscribers see valid state
    const warm = motionBus.subscribe(() => {});

    if (reduce) {
      return () => warm();
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recompute Lenis's cached page dimensions whenever layout changes
    // (FloatingPortrait morphs dimensions on scroll, fonts load, images
    // resolve, etc.). Without this, Lenis can clamp scroll to a stale
    // 'max scroll' and the page feels stuck before the real bottom.
    const refreshLenis = () => lenis.resize();
    const ro = new ResizeObserver(refreshLenis);
    ro.observe(document.body);
    window.addEventListener("load", refreshLenis);
    if ("fonts" in document) {
      document.fonts.ready.then(refreshLenis);
    }
    // Tie ScrollTrigger refreshes to a Lenis resize too
    ScrollTrigger.addEventListener("refresh", refreshLenis);

    return () => {
      warm();
      gsap.ticker.remove(raf);
      ro.disconnect();
      window.removeEventListener("load", refreshLenis);
      ScrollTrigger.removeEventListener("refresh", refreshLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
