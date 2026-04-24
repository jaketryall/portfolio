"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "hover" | "view" | "drag";

declare global {
  interface Window {
    __setCursor?: (state: CursorState, label?: string) => void;
  }
}

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(true);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<CursorState>("default");

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasFinePointer) return;

    setHidden(false);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    window.addEventListener("mousemove", onMove);

    window.__setCursor = (state, text) => {
      setMode(state);
      setLabel(text ?? "");
    };

    // auto-detect interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest<HTMLElement>(
        'a, button, [role="button"], [data-cursor]'
      );
      if (!interactive) {
        setMode("default");
        setLabel("");
        return;
      }
      const customLabel = interactive.getAttribute("data-cursor-label");
      const customState = (interactive.getAttribute("data-cursor") as CursorState | null) ?? "hover";
      setMode(customState);
      setLabel(customLabel ?? "");
    };

    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      delete window.__setCursor;
    };
  }, []);

  if (hidden) return null;

  const ringScale = mode === "default" ? 1 : mode === "view" ? 3 : 1.8;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] hidden md:block"
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)]"
        style={{
          width: 36,
          height: 36,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          background: mode === "view" ? "var(--color-ink)" : "transparent",
        }}
      >
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-canvas"
          style={{
            opacity: label ? 1 : 0,
            transform: `scale(${1 / Math.max(ringScale, 1)})`,
            transition: "opacity 200ms",
          }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        style={{
          width: 6,
          height: 6,
          opacity: mode === "view" ? 0 : 1,
          transition: "opacity 200ms",
        }}
      />
    </div>
  );
}
