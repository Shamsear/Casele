import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "danger" | "muted" | "trending" | "low-stock";
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  default: "bg-dark-surface text-white border-dark-border",
  gold: "bg-gold/10 text-gold border-gold/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  muted: "bg-dark-surface text-warm-gray border-dark-border",
  trending: "bg-amber-500/90 text-white border-amber-500",
  "low-stock": "bg-red-500/90 text-white border-red-500",
};

export function Badge({ children, variant = "default", className, animated = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-300",
        variantStyles[variant],
        animated && variant === "danger" && "animate-pulse-gold",
        animated && variant === "gold" && "shadow-sm shadow-gold/20",
        className
      )}
    >
      {children}
    </span>
  );
}

// Product-specific badges with enhanced styling
export function ProductBadge({
  badge,
  className,
}: {
  badge?: string | null;
  className?: string;
}) {
  if (!badge) return null;

  const config: Record<string, { label: string; icon?: string; variant: BadgeProps["variant"]; glow?: boolean }> = {
    new: { label: "NEW", icon: "✨", variant: "gold", glow: true },
    bestseller: { label: "BESTSELLER", icon: "⭐", variant: "gold" },
    sale: { label: "SALE", icon: "🏷️", variant: "danger", glow: true },
    out_of_stock: { label: "SOLD OUT", variant: "muted" },
  };

  const { label, icon, variant, glow } = config[badge] || config.new;

  return (
    <Badge
      variant={variant}
      animated={glow}
      className={cn(
        "text-[10px] font-bold tracking-wider",
        glow && variant === "gold" && "shadow-md shadow-gold/20",
        glow && variant === "danger" && "shadow-md shadow-red-500/20",
        className
      )}
    >
      {icon && <span className="mr-0.5">{icon}</span>}
      {label}
    </Badge>
  );
}
