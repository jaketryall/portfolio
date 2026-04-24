"use client";

/**
 * Single implementation of the site's signature reveal:
 * letters rise from a clip mask + variable-weight morph from thin → bold.
 * Used by RevealText, HeroNameBackdrop, AboutGhostBackdrop — one source of
 * timing truth.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealOptions = {
  letters: HTMLElement[];
  weightFrom?: number;
  weightTo?: number;
  stagger?: number;
  delay?: number;
  /** If provided, the reveal fires on scroll instead of immediately. */
  scrollTrigger?: ScrollTrigger.Vars;
  /** If true and reduced motion is on, letters are set to their final state instantly. */
  respectReducedMotion?: boolean;
};

export function revealLetters(opts: RevealOptions): gsap.core.Timeline | null {
  const {
    letters,
    weightFrom = 200,
    weightTo = 800,
    stagger = 0.04,
    delay = 0,
    scrollTrigger,
    respectReducedMotion = true,
  } = opts;

  if (!letters.length) return null;

  const reduce =
    respectReducedMotion &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    gsap.set(letters, {
      yPercent: 0,
      opacity: 1,
      fontVariationSettings: `"wght" ${weightTo}`,
    });
    return null;
  }

  gsap.set(letters, {
    yPercent: 115,
    opacity: 0,
    fontVariationSettings: `"wght" ${weightFrom}`,
  });

  const tl = gsap.timeline({
    delay,
    scrollTrigger,
  });

  tl.to(letters, {
    yPercent: 0,
    opacity: 1,
    duration: 1.1,
    ease: "expo.out",
    stagger: { each: stagger, from: "start" },
  }).to(
    letters,
    {
      fontVariationSettings: `"wght" ${weightTo}`,
      duration: 1.4,
      ease: "power2.out",
      stagger: { each: stagger * 0.7, from: "start" },
    },
    "<"
  );

  return tl;
}

/**
 * Subscribe the letters' weight axis to a velocity signal (0..1 scalar).
 * Used for ghost-text backdrops that "flex" with scroll velocity.
 */
export function bindWeightToVelocity(
  letters: HTMLElement[],
  velocity: number,
  baseline = 800
) {
  const absV = Math.abs(velocity);
  const w = gsap.utils.clamp(300, 900, baseline - absV * 450);
  gsap.to(letters, {
    fontVariationSettings: `"wght" ${w}`,
    duration: 0.4,
    ease: "power3.out",
    overwrite: "auto",
  });
}
