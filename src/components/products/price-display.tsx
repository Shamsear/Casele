import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";

interface PriceDisplayProps {
  price: number | string;
  comparePrice?: number | string | null;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  comparePrice,
  size = "md",
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const discount = getDiscountPercent(price, comparePrice ?? null);
  const hasDiscount = discount > 0 && comparePrice;

  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-price",
  };

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display font-bold text-gold",
          sizeClasses[size]
        )}
      >
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-warm-gray line-through">
            {formatPrice(comparePrice!)}
          </span>
          {showBadge && (
            <span className="inline-flex items-center rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
