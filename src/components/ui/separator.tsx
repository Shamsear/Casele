import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
  vertical?: boolean;
}

export function Separator({ className, vertical }: SeparatorProps) {
  return (
    <div
      className={cn(
        "shrink-0 bg-dark-border",
        vertical ? "w-px h-full" : "h-px w-full",
        className
      )}
    />
  );
}
