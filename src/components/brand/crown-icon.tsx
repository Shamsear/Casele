import { cn } from "@/lib/utils";

interface CrownIconProps {
  className?: string;
  size?: number;
}

export function CrownIcon({ className, size = 24 }: CrownIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn("text-gold", className)}
    >
      <path
        d="M3 18L5 10L8 14L12 6L16 14L19 10L21 18H3Z"
        fill="currentColor"
      />
      <rect x="3" y="18" width="18" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
