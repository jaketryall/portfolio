"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NBSP = " ";

type RevealTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  splitBy?: "word" | "char" | "line";
  stagger?: number;
  delay?: number;
  start?: string;
  weightFrom?: number;
  weightTo?: number;
};

export function RevealText({
  children,
  as: Tag = "p",
  className,
  splitBy = "word",
  stagger = 0.04,
  delay = 0,
  start = "top 85%",
  weightFrom,
  weightTo,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pieces = el.querySelectorAll<HTMLElement>(".reveal-piece");

    if (reduce) {
      gsap.set(pieces, { yPercent: 0, opacity: 1 });
      return;
    }

    const animateWeight =
      typeof weightFrom === "number" && typeof weightTo === "number";

    gsap.set(pieces, {
      yPercent: 115,
      opacity: 0,
      ...(animateWeight
        ? { fontVariationSettings: `"wght" ${weightFrom}` }
        : {}),
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start, once: true },
      delay,
    });

    tl.to(pieces, {
      yPercent: 0,
      opacity: 1,
      duration: 0.95,
      ease: "expo.out",
      stagger,
    });

    if (animateWeight) {
      tl.to(
        pieces,
        {
          fontVariationSettings: `"wght" ${weightTo}`,
          duration: 1.2,
          ease: "power2.out",
          stagger: stagger * 0.6,
        },
        "<"
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [delay, stagger, start, weightFrom, weightTo]);

  const renderPiece = (displayChar: string, idx: number) => (
    <span
      key={idx}
      className="inline-block overflow-hidden align-bottom"
      aria-hidden={splitBy === "char"}
    >
      <span
        className="reveal-piece inline-block will-change-transform"
        style={{
          fontVariationSettings:
            typeof weightFrom === "number"
              ? `"wght" ${weightFrom}`
              : undefined,
        }}
      >
        {displayChar}
      </span>
    </span>
  );

  // char mode: group letters into non-breaking word spans so words don't wrap mid-letter
  if (splitBy === "char") {
    const words = children.split(" ");
    let running = 0;
    return (
      <Tag ref={ref as never} className={cn("inline-block", className)}>
        {words.map((word, wi) => {
          const wordChars = Array.from(word);
          const block = (
            <span
              key={`w-${wi}`}
              className="inline-block whitespace-nowrap align-bottom"
            >
              {wordChars.map((c) => renderPiece(c, running++))}
            </span>
          );
          const trailing =
            wi < words.length - 1 ? (
              <span key={`s-${wi}`}>{NBSP}</span>
            ) : null;
          return (
            <span key={wi} className="inline">
              {block}
              {trailing}
            </span>
          );
        })}
      </Tag>
    );
  }

  // word / line modes
  const pieces = splitBy === "line" ? children.split("\n") : children.split(" ");

  return (
    <Tag ref={ref as never} className={cn("inline-block", className)}>
      {pieces.map((piece, i) => {
        const isLast = i === pieces.length - 1;
        return (
          <span key={i} className="inline">
            {renderPiece(piece, i)}
            {splitBy === "word" && !isLast ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}
