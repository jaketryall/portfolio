"use client";

import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type MagneticButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  strength?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function MagneticButton<T extends ElementType = "button">({
  as,
  children,
  strength = 0.35,
  className,
  ...rest
}: MagneticButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * strength;
    const y = (e.clientY - top - height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
    gsap.to(innerRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power3.out" });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <Tag
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
