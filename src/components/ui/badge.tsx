import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

const variantStyles = {
  default: "bg-dark-surface text-white border-dark-border",
  gold: "bg-gold/10 text-gold border-gold/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  muted: "bg-dark-surface text-warm-gray border-dark-border",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Product-specific badges
export function ProductBadge({
  badge,
  className,
}: {
  badge?: string | null;
  className?: string;
}) {
  if (!badge) return null;

  const config: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    new: { label: "NEW", variant: "gold" },
    bestseller: { label: "BESTSELLER", variant: "default" },
    sale: { label: "SALE", variant: "danger" },
    out_of_stock: { label: "OUT OF STOCK", variant: "muted" },
  };

  const { label, variant } = config[badge] || config.new;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
