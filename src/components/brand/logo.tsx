import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Crown + É monogram */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes[size])}
      >
        {/* Crown */}
        <path
          d="M10 28L12 16L16 22L20 12L24 22L28 16L30 28H10Z"
          fill="#D4AF37"
        />
        {/* É circle */}
        <circle cx="20" cy="20" r="16" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        {/* É letter */}
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fill="#D4AF37"
          fontSize="16"
          fontFamily="serif"
          fontWeight="600"
        >
          É
        </text>
      </svg>
      {/* Wordmark */}
      <span
        className={cn(
          "font-display font-semibold tracking-widest text-gold",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-3xl"
        )}
      >
        CASELÉ
      </span>
    </div>
  );
}
