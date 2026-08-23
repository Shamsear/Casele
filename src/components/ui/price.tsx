"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface PriceProps {
  price: number | string;
  comparePrice?: number | string | null;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
  align?: "left" | "right";
}

const sizeClasses = {
  sm: { amount: "text-base", currency: "text-[10px]", compare: "text-[10px]" },
  md: { amount: "text-xl", currency: "text-xs", compare: "text-xs" },
  lg: { amount: "text-2xl", currency: "text-sm", compare: "text-sm" },
};

export function Price({
  price,
  comparePrice,
  size = "md",
  showBadge = true,
  className,
  align = "left",
}: PriceProps) {
  const { formatPrice } = useI18n();
  const s = sizeClasses[size];

  const num = typeof price === "string" ? parseFloat(price) : price;
  const cp = comparePrice
    ? typeof comparePrice === "string"
      ? parseFloat(comparePrice)
      : comparePrice
    : null;

  const hasDiscount = cp !== null && cp > num;
  const discount = hasDiscount ? Math.round(((cp - num) / cp) * 100) : 0;

  // Split "QAR 79" into currency and amount
  const formatted = formatPrice(price);
  const parts = formatted.split(/\s+/);
  const currency = parts[0] || "QAR";
  const amount = parts.slice(1).join(" ") || String(num);

  // Compare price parts
  const formattedCompare = cp !== null ? formatPrice(cp) : null;
  const compareParts = formattedCompare?.split(/\s+/);
  const compareCurrency = compareParts?.[0] || "QAR";
  const compareAmount = compareParts?.slice(1).join(" ") || String(cp);

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5",
        align === "right" && "justify-end",
        className
      )}
    >
      {/* Current price */}
      <span className={cn("inline-flex items-baseline gap-0.5 text-gold font-semibold", s.amount)}>
        <span className={cn("font-normal opacity-70", s.currency)}>{currency}</span>
        <span className="font-display font-bold">{amount}</span>
      </span>

      {/* Compare price */}
      {hasDiscount && (
        <>
          <span className={cn("inline-flex items-baseline gap-0.5 text-warm-gray/50 line-through", s.compare)}>
            <span className="font-normal opacity-70">{compareCurrency}</span>
            <span className="font-display">{compareAmount}</span>
          </span>
          {showBadge && (
            <span className="inline-flex items-center rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
