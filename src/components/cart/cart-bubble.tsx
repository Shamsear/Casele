"use client";

import { useCartStore } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/context";

export function CartBubble() {
  const itemCount = useCartStore((s) => s.itemCount());
  const total = useCartStore((s) => s.total());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { formatPrice } = useI18n();

  return (
    <button
      onClick={toggleCart}
      aria-label={`Shopping Bag (${itemCount} items)`}
      className="group relative flex items-center gap-2 rounded-full border border-white/80 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-all duration-200 hover:border-neutral-400 hover:bg-white hover:shadow-2xs active:scale-95 cursor-pointer select-none"
    >
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-4 h-4 text-neutral-800 transition-transform group-hover:scale-105"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] font-bold text-white shadow-xs">
            {itemCount}
          </span>
        )}
      </div>

      <span className="hidden sm:inline-block font-medium text-neutral-700">
        {itemCount > 0 ? formatPrice(total) : "Bag"}
      </span>
    </button>
  );
}
