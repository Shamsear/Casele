"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-up" | "slide-right" | "slide-left";
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 550,
  threshold = 0.02,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        // Eager 80px top buffer so mobile and desktop viewports trigger smoothly
        rootMargin: "80px 0px -10px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const getAnimationName = () => {
    switch (animation) {
      case "fade-up":
        return "revealFadeUp";
      case "fade-in":
        return "revealFadeIn";
      case "scale-up":
        return "revealScaleUp";
      case "slide-right":
        return "revealSlideRight";
      case "slide-left":
        return "revealSlideLeft";
      default:
        return "revealFadeUp";
    }
  };

  return (
    <div
      ref={ref}
      style={
        isVisible
          ? {
              animationName: getAnimationName(),
              animationDuration: `${duration}ms`,
              animationDelay: `${delay}ms`,
              animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              animationFillMode: "both",
              willChange: "transform, opacity",
            }
          : {
              opacity: 0,
            }
      }
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}
