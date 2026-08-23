"use client";

import { useCartStore } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/context";

export function CartBubble() {
  const itemCount = useCartStore((s) => s.itemCount());
  const total = useCartStore((s) => s.total());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { formatPrice } = useI18n();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center gap-2 rounded-lg border border-dark-border bg-dark-surface px-3 py-1.5 text-sm transition-colors hover:border-gold/30"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-4 h-4 text-gold"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      <span className="font-medium text-white">{itemCount}</span>
      <span className="text-warm-gray">•</span>
      <span className="font-medium text-gold">{formatPrice(total)}</span>
    </button>
  );
}
