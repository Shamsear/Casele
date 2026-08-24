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
      className="group relative flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-sm transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10 active:scale-95 animate-scale-in"
    >
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-gold transition-transform group-hover:scale-110"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-black">
          {itemCount}
        </span>
      </div>
      <span className="text-warm-gray/40">•</span>
      <span className="font-semibold text-gold text-xs">{formatPrice(total)}</span>
    </button>
  );
}
