"use client";

import { useEffect, useRef, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { revealLetters } from "@/lib/reveal";

const NBSP = " ";

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

    const letters = Array.from(
      el.querySelectorAll<HTMLElement>(".reveal-piece")
    );

    const tl = revealLetters({
      letters,
      weightFrom: weightFrom ?? 500,
      weightTo: weightTo ?? 500,
      stagger,
      delay,
      scrollTrigger: { trigger: el, start },
    });

    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, [delay, stagger, start, weightFrom, weightTo]);

  const renderPiece = (displayChar: string, idx: number) => (
    <span
      key={idx}
      className="inline-block overflow-hidden align-bottom"
      style={{
        // breathing room on all four sides so caps/ascenders/descenders/side
        // bearings (ligatures, italic kerns, tight tracking) aren't clipped
        // by the mask
        paddingTop: "0.3em",
        paddingBottom: "0.3em",
        paddingLeft: "0.05em",
        paddingRight: "0.05em",
        marginTop: "-0.3em",
        marginBottom: "-0.3em",
        marginLeft: "-0.05em",
        marginRight: "-0.05em",
      }}
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

  // char mode: group letters into non-breaking word spans
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
