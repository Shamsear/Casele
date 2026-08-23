"use client";

import { useI18n } from "@/lib/i18n/context";
import { Separator } from "@/components/ui/separator";

interface DiscountBreakdownProps {
  subtotal: number;
  tierDiscount: number;
  tierLabel: string | null;
  flashDiscount: number;
  flashLabel: string | null;
  promoDiscount: number;
  promoLabel: string | null;
  bundleDiscount: number;
  bundleLabel: string | null;
  total: number;
  savings: number;
}

export function DiscountBreakdown({
  subtotal,
  tierDiscount,
  tierLabel,
  flashDiscount,
  flashLabel,
  promoDiscount,
  promoLabel,
  bundleDiscount,
  bundleLabel,
  total,
  savings,
}: DiscountBreakdownProps) {
  const { formatPrice } = useI18n();
  const hasDiscounts =
    tierDiscount > 0 ||
    flashDiscount > 0 ||
    promoDiscount > 0 ||
    bundleDiscount > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-warm-gray">Subtotal</span>
        <span className="text-white">{formatPrice(subtotal)}</span>
      </div>

      {tierDiscount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-400">
            {tierLabel || "Tier discount"}
          </span>
          <span className="text-emerald-400">
            -{formatPrice(tierDiscount)}
          </span>
        </div>
      )}

      {flashDiscount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-400">
            {flashLabel || "Flash sale"}
          </span>
          <span className="text-emerald-400">
            -{formatPrice(flashDiscount)}
          </span>
        </div>
      )}

      {bundleDiscount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-400">
            {bundleLabel || "Bundle discount"}
          </span>
          <span className="text-emerald-400">
            -{formatPrice(bundleDiscount)}
          </span>
        </div>
      )}

      {promoDiscount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-400">
            {promoLabel || "Promo discount"}
          </span>
          <span className="text-emerald-400">
            -{formatPrice(promoDiscount)}
          </span>
        </div>
      )}

      <Separator className="!bg-dark-border/50" />

      <div className="flex items-center justify-between">
        <span className="font-medium text-white">Total</span>
        <span className="font-display text-lg font-bold text-gold">
          {formatPrice(total)}
        </span>
      </div>

      {hasDiscounts && (
        <p className="text-right text-xs text-emerald-400">
          You save {formatPrice(savings)}!
        </p>
      )}
    </div>
  );
}
