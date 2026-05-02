"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "fade-in";

const variantInitialStyles: Record<AnimationVariant, string> = {
  "fade-up": "translate-y-[18px] opacity-0",
  "fade-down": "-translate-y-[18px] opacity-0",
  "fade-left": "translate-x-[18px] opacity-0",
  "fade-right": "-translate-x-[18px] opacity-0",
  "scale-in": "scale-[0.97] opacity-0",
  "fade-in": "opacity-0",
};

const variantVisibleStyles: Record<AnimationVariant, string> = {
  "fade-up": "translate-y-0 opacity-100",
  "fade-down": "translate-y-0 opacity-100",
  "fade-left": "translate-x-0 opacity-100",
  "fade-right": "translate-x-0 opacity-100",
  "scale-in": "scale-100 opacity-100",
  "fade-in": "opacity-100",
};

interface AnimateOnScrollProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: "fast" | "base" | "slow";
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
}

const durationMap = {
  fast: "duration-[var(--motion-duration-fast)]",
  base: "duration-[var(--motion-duration-base)]",
  slow: "duration-[var(--motion-duration-slow)]",
};

export function AnimateOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  duration = "slow",
  threshold = 0.15,
  once = true,
  className,
  as: Tag = "div",
}: AnimateOnScrollProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount check for accessibility; not a cascading render
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => { elementRef.current = node; }}
      className={cn(
        "transition-[transform,opacity] ease-[var(--motion-ease-out)]",
        !isVisible && "will-change-[transform,opacity]",
        durationMap[duration],
        isVisible
          ? variantVisibleStyles[variant]
          : variantInitialStyles[variant],
        className,
      )}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
