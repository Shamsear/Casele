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

// Global velocity tracker for ultra-efficient shared state
let lastScrollY = 0;
let lastScrollTime = 0;
let currentScrollVelocity = 0; // px/ms
let isFastScrolling = false;
let velocityTimeout: ReturnType<typeof setTimeout> | null = null;

if (typeof window !== "undefined") {
  lastScrollY = window.scrollY;
  lastScrollTime = performance.now();

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 1);
      const dy = Math.abs(window.scrollY - lastScrollY);
      currentScrollVelocity = dy / dt;

      isFastScrolling = currentScrollVelocity > 0.8;

      lastScrollY = window.scrollY;
      lastScrollTime = now;

      if (velocityTimeout) clearTimeout(velocityTimeout);
      velocityTimeout = setTimeout(() => {
        currentScrollVelocity = 0;
        isFastScrolling = false;
      }, 120);
    },
    { passive: true }
  );
}

export function Reveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 320,
  threshold = 0.01,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [actualDuration, setActualDuration] = useState(duration);
  const [actualDelay, setActualDelay] = useState(delay);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Instant reveal if element is already within or near the visible screen
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 250 && rect.bottom > -100) {
      setIsVisible(true);
      setActualDuration(0);
      setActualDelay(0);
      return;
    }

    const triggerReveal = () => {
      // If user is scrolling fast, accelerate animation to instant/snappy
      if (isFastScrolling || currentScrollVelocity > 0.6) {
        setActualDuration(Math.min(100, Math.round(duration * 0.3)));
        setActualDelay(0);
      } else {
        setActualDuration(duration);
        setActualDelay(delay);
      }
      setIsVisible(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerReveal();
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        // Large lookahead trigger (320px ahead) ensures animations are triggered before the user reaches the content
        rootMargin: "320px 0px 100px 0px",
      }
    );

    observer.observe(el);

    // Scroll listener backup to guarantee zero missed content during high-speed scrolling
    const checkVisibilityOnScroll = () => {
      if (isVisible && once) return;
      const currentRect = el.getBoundingClientRect();
      if (currentRect.top <= window.innerHeight + 150) {
        triggerReveal();
        if (once) {
          observer.unobserve(el);
          window.removeEventListener("scroll", checkVisibilityOnScroll);
        }
      }
    };

    window.addEventListener("scroll", checkVisibilityOnScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibilityOnScroll);
    };
  }, [threshold, once, duration, delay, isVisible]);

  const getAnimationClasses = () => {
    switch (animation) {
      case "fade-up":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3";
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "scale-up":
        return isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-[0.98]";
      case "slide-right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-3";
      case "slide-left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-3";
      default:
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${actualDuration}ms`,
        transitionDelay: `${actualDelay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn("transition-all will-change-transform", getAnimationClasses(), className)}
    >
      {children}
    </div>
  );
}
