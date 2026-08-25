"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cta" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
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
          "inline-flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
          // Variants
          variant === "primary" &&
            "bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm active:scale-[0.98]",
          variant === "secondary" &&
            "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 hover:border-neutral-400 active:scale-[0.98]",
          variant === "ghost" &&
            "bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80",
          variant === "cta" &&
            "bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm active:scale-[0.98]",
          variant === "outline" &&
            "border border-neutral-200 bg-transparent text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300",
          variant === "danger" &&
            "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
          // Sizes
          size === "sm" && "h-9 px-4 rounded-xl",
          size === "md" && "h-11 px-6 rounded-xl",
          size === "lg" && "h-13 px-8 text-sm rounded-2xl",
          size === "icon" && "h-10 w-10 p-0 rounded-xl",
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
