"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export function KineticText({
  children,
  className,
  from = 400,
  to = 700,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    gsap.to(ref.current, {
      fontWeight: to,
      duration: 0.45,
      ease: "power3.out",
    });
  };
  const handleLeave = () => {
    gsap.to(ref.current, {
      fontWeight: from,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn("inline-block", className)}
      style={{ fontWeight: from, fontVariationSettings: `"wght" ${from}` }}
    >
      {children}
    </span>
  );
}
