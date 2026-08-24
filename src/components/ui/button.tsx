"use client";

import { forwardRef } from "react";
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
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider transition-colors disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
          // Variants
          variant === "primary" &&
            "bg-white text-black hover:bg-gold",
          variant === "secondary" &&
            "border border-dark-border bg-transparent text-white hover:border-white hover:bg-white/5",
          variant === "ghost" &&
            "bg-transparent text-warm-gray hover:text-white",
          variant === "cta" &&
            "bg-white text-black hover:bg-gold",
          variant === "danger" &&
            "bg-[#B91C1C] text-white hover:bg-[#991B1B]",
          // Sizes
          size === "sm" && "h-9 px-4",
          size === "md" && "h-11 px-6",
          size === "lg" && "h-13 px-8 text-sm",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading...</span>
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
