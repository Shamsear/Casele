import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  color?: "gold" | "default";
}

export function Progress({
  value,
  className,
  color = "gold",
}: ProgressProps) {
  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-dark-border",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          color === "gold" ? "bg-gold" : "bg-white"
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
