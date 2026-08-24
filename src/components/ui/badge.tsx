import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "danger" | "muted" | "trending" | "low-stock";
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  default: "bg-dark-surface text-white border-dark-border",
  gold: "bg-gold/10 text-gold border-gold/30",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
  muted: "bg-dark-surface text-warm-gray border-dark-border",
  trending: "bg-gold/15 text-gold border-gold/40",
  "low-stock": "bg-red-500/15 text-red-400 border-red-500/30",
};

export function Badge({ children, variant = "default", className, animated = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-300",
        variantStyles[variant],
        animated && variant === "gold" && "shadow-sm shadow-gold/20",
        className
      )}
    >
      {children}
    </span>
  );
}

// Product-specific badges with pure clean typography (no emojis)
export function ProductBadge({
  badge,
  className,
}: {
  badge?: string | null;
  className?: string;
}) {
  if (!badge) return null;

  const config: Record<string, { label: string; variant: BadgeProps["variant"]; glow?: boolean }> = {
    new: { label: "NEW", variant: "gold", glow: true },
    bestseller: { label: "BESTSELLER", variant: "gold" },
    sale: { label: "SALE", variant: "danger", glow: true },
    out_of_stock: { label: "SOLD OUT", variant: "muted" },
  };

  const { label, variant, glow } = config[badge] || config.new;

  return (
    <Badge
      variant={variant}
      animated={glow}
      className={cn(
        "text-[10px] font-bold tracking-widest uppercase",
        className
      )}
    >
      {label}
    </Badge>
  );
}
