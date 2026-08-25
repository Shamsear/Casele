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
  threshold = 0.1,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if in viewport on mount and trigger smooth entrance
    const checkInitial = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
        // Use requestAnimationFrame to ensure browser paints initial state before animating
        requestAnimationFrame(() => {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        });
        return true;
      }
      return false;
    };

    const isInitiallyVisible = checkInitial();
    if (isInitiallyVisible && once) return;

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
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, delay]);

  const getAnimationClasses = () => {
    switch (animation) {
      case "fade-up":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8";
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "scale-up":
        return isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95";
      case "slide-right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-8";
      case "slide-left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8";
      default:
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn("transition-all will-change-transform", getAnimationClasses(), className)}
    >
      {children}
    </div>
  );
}
