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
        "inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-ink",
        className
      )}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-80"
          style={{ backgroundColor: "var(--color-signal)" }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-signal)" }}
        />
      </span>
      <span>{children}</span>
    </span>
  );
}
