"use client";

import { cn } from "@/lib/utils";

export function AvailabilityPill({
  children = "Available · Q3 2026",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase font-semibold",
        className
      )}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full"
        style={{
          backgroundColor: "#2bb673",
          boxShadow: "0 0 0 3px rgba(43, 182, 115, 0.18)",
        }}
      />
      <span className="text-ink">{children}</span>
    </span>
  );
}
