import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "danger" | "muted" | "trending" | "low-stock" | "dark";
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  default: "bg-neutral-100 text-neutral-800 border-neutral-200/80",
  dark: "bg-neutral-950 text-white border-neutral-950",
  gold: "bg-[#FBF8EF] text-[#8C6D28] border-[#E8DCB8]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  muted: "bg-neutral-100 text-neutral-500 border-neutral-200",
  trending: "bg-[#FBF8EF] text-[#8C6D28] border-[#E8DCB8]",
  "low-stock": "bg-red-50 text-red-700 border-red-200",
};

export function Badge({ children, variant = "default", className, animated = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-200 uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ProductBadge({
  badge,
  className,
}: {
  badge?: string | null;
  className?: string;
}) {
  if (!badge) return null;

  const config: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    new: { label: "NEW", variant: "dark" },
    bestseller: { label: "BESTSELLER", variant: "gold" },
    sale: { label: "SALE", variant: "danger" },
    out_of_stock: { label: "SOLD OUT", variant: "muted" },
  };

  const { label, variant } = config[badge.toLowerCase()] || { label: badge.toUpperCase(), variant: "dark" };

  return (
    <Badge
      variant={variant}
      className={cn(
        "text-[9px] font-bold tracking-widest uppercase",
        className
      )}
    >
      {label}
    </Badge>
  );
}
