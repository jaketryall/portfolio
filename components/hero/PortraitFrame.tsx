"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type PortraitFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** aspect ratio for the frame; default 3/4 (portrait) */
  aspect?: string;
  priority?: boolean;
};

export const PortraitFrame = forwardRef<HTMLDivElement, PortraitFrameProps>(
  function PortraitFrame(
    { src, alt, className, aspect = "3/4", priority },
    forwardedRef
  ) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const wrap = wrapperRef.current;
      const tilt = tiltRef.current;
      const image = imageRef.current;
      const glow = glowRef.current;
      if (!wrap || !tilt || !image || !glow) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const rX = gsap.quickTo(tilt, "rotateX", { duration: 0.6, ease: "power3.out" });
      const rY = gsap.quickTo(tilt, "rotateY", { duration: 0.6, ease: "power3.out" });
      const iX = gsap.quickTo(image, "x", { duration: 0.6, ease: "power3.out" });
      const iY = gsap.quickTo(image, "y", { duration: 0.6, ease: "power3.out" });
      const gX = gsap.quickTo(glow, "--mx", { duration: 0.3, ease: "power2.out" });
      const gY = gsap.quickTo(glow, "--my", { duration: 0.3, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const nx = px - 0.5;
        const ny = py - 0.5;
        rY(nx * 14);
        rX(-ny * 12);
        iX(nx * -12);
        iY(ny * -12);
        gX(px * 100);
        gY(py * 100);
      };

      const onLeave = () => {
        rX(0);
        rY(0);
        iX(0);
        iY(0);
        gX(50);
        gY(50);
      };

      wrap.addEventListener("mousemove", onMove);
      wrap.addEventListener("mouseleave", onLeave);
      return () => {
        wrap.removeEventListener("mousemove", onMove);
        wrap.removeEventListener("mouseleave", onLeave);
      };
    }, []);

    // merge forwarded ref + internal ref
    const setRefs = (node: HTMLDivElement | null) => {
      wrapperRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          "relative [perspective:1400px]",
          className
        )}
        style={{ aspectRatio: aspect }}
      >
        {/* soft base shadow */}
        <div
          aria-hidden
          className="absolute inset-x-6 bottom-0 h-16 rounded-[50%] blur-2xl opacity-30"
          style={{ background: "rgba(14,14,14,0.35)" }}
        />
        {/* tilt wrapper */}
        <div
          ref={tiltRef}
          className="relative h-full w-full rounded-[28px] [transform-style:preserve-3d] will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          {/* rim-light gradient — follows cursor via CSS vars */}
          <div
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[29px] opacity-70 transition-opacity duration-500"
            style={{
              ["--mx" as string]: "50",
              ["--my" as string]: "50",
              background:
                "radial-gradient(60% 60% at calc(var(--mx) * 1%) calc(var(--my) * 1%), rgba(255,252,240,0.95), rgba(255,252,240,0.1) 55%, transparent 70%)",
              filter: "blur(24px)",
            }}
          />
          {/* the image frame */}
          <div
            className="glass relative h-full w-full overflow-hidden rounded-[28px]"
            style={{ boxShadow: "0 30px 80px -30px rgba(14,14,14,0.35), 0 2px 8px rgba(14,14,14,0.06), inset 0 0 0 1px rgba(14,14,14,0.08)" }}
          >
            <Image
              ref={imageRef}
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 90vw"
              className="object-cover will-change-transform [transform:scale(1.08)]"
            />
            {/* subtle top-to-bottom cream tint overlay — makes the photo feel unified with the canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(235,229,209,0.05) 0%, rgba(235,229,209,0.0) 25%, rgba(235,229,209,0.12) 100%)",
                mixBlendMode: "normal",
              }}
            />
            {/* inner highlight line top */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,252,240,0.55) 50%, transparent)" }}
            />
          </div>
        </div>
      </div>
    );
  }
);
