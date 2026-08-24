"use client";

import { forwardRef, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cta" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const rippleRef = useRef<HTMLSpanElement>(null);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        // Ripple effect for CTA buttons
        if (variant === "cta" && rippleRef.current) {
          const btn = e.currentTarget;
          const rect = btn.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          const ripple = document.createElement("span");
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          ripple.className = "ripple";
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        }

        onClick?.(e);
      },
      [onClick, variant]
    );

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(
          // Base
          "ripple-container inline-flex items-center justify-center gap-2 rounded-xl font-body font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.97]",
          // Variants
          variant === "primary" &&
            "bg-white text-black hover:bg-cream active:bg-cream/80",
          variant === "secondary" &&
            "border border-dark-border bg-transparent text-white hover:bg-dark-surface hover:border-gold/20 active:bg-dark-border",
          variant === "ghost" &&
            "bg-transparent text-warm-gray hover:text-white hover:bg-dark-surface",
          variant === "cta" &&
            "bg-gold text-black hover:bg-gold-light active:bg-gold/90 font-semibold shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5",
          variant === "danger" &&
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
          // Sizes
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-13 px-7 text-base",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span className="opacity-70">Loading…</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
