"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motionBus } from "@/lib/motionBus";

export function AvailabilityPill({
  children = "Available · Q3 2026",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // pulse driven by the shared motion bus heartbeat (1.2s period) so this
  // rhythm matches the rest of the site rather than running a detached
  // CSS animation
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    const unsub = motionBus.subscribe(({ heartbeat }) => {
      const scale = 1 + heartbeat * 1.4;
      ring.style.transform = `translate(-50%,-50%) scale(${scale})`;
      ring.style.opacity = String(0.55 * (1 - heartbeat));
      dot.style.transform = `translate(-50%,-50%) scale(${1 + heartbeat * 0.12})`;
    });
    return unsub;
  }, []);

  return (
    <span
      className={cn(
        "glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase font-semibold",
        className
      )}
    >
      <span className="relative inline-flex h-2 w-2">
        <span
          ref={ringRef}
          className="absolute top-1/2 left-1/2 inline-flex h-2 w-2 rounded-full"
          style={{
            backgroundColor: "var(--color-signal)",
            transform: "translate(-50%,-50%) scale(1)",
            willChange: "transform, opacity",
          }}
        />
        <span
          ref={dotRef}
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{
            backgroundColor: "var(--color-signal)",
            transform: "translate(-50%,-50%) scale(1)",
            position: "absolute",
            top: "50%",
            left: "50%",
            willChange: "transform",
          }}
        />
      </span>
      <span className="text-ink">{children}</span>
    </span>
  );
}
