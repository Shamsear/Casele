"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface PriceProps {
  price: number | string;
  comparePrice?: number | string | null;
  size?: "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  className?: string;
  align?: "left" | "right";
}

const sizeClasses = {
  sm: { amount: "text-sm sm:text-base", currency: "text-[10px]", compare: "text-[11px]" },
  md: { amount: "text-base sm:text-lg", currency: "text-xs", compare: "text-xs" },
  lg: { amount: "text-xl sm:text-2xl", currency: "text-xs sm:text-sm", compare: "text-sm" },
  xl: { amount: "text-2xl sm:text-3xl", currency: "text-sm", compare: "text-base" },
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
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        align === "right" && "justify-end",
        className
      )}
    >
      {/* Current price */}
      <span className={cn("inline-flex items-baseline gap-0.5 text-neutral-950 font-semibold", s.amount)}>
        <span className={cn("font-normal text-neutral-500 font-sans tracking-normal", s.currency)}>{currency}</span>
        <span className="font-display tracking-tight">{amount}</span>
      </span>

      {/* Compare price */}
      {hasDiscount && (
        <>
          <span className={cn("inline-flex items-baseline gap-0.5 text-neutral-400 line-through", s.compare)}>
            <span className="font-normal text-neutral-400 font-sans">{compareCurrency}</span>
            <span className="font-display">{compareAmount}</span>
          </span>
          {showBadge && (
            <span className="inline-flex items-center rounded-md bg-red-50 border border-red-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 tracking-tight">
              Save {discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
