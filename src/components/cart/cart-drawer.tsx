"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/context";
import { getWhatsAppNumber } from "@/lib/settings";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { TruckIcon, CartIcon } from "@/components/ui/icons";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, total, subtotal, tierDiscount, promoDiscount } = useCartStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { formatPrice } = useI18n();

  // Fetch WhatsApp number on mount
  useEffect(() => {
    getWhatsAppNumber().then(setWhatsappNumber);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setOpen]);

  // Prevent body scroll when open (preserves scroll position)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage({
      customerName: customerName.trim() || "Customer",
      customerPhone: customerPhone ? `+974${customerPhone}` : "",
      items: items.map((item) => ({
        name: item.name,
        model: item.modelName,
        qty: item.quantity,
        price: item.price,
      })),
      subtotal: subtotal(),
      tierDiscount: tierDiscount(),
      flashDiscount: 0,
      bundleDiscount: 0,
      promoDiscount: promoDiscount,
      total: total(),
    });

    openWhatsApp(whatsappNumber, message);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-dark-surface shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Your Cart</h2>
            <p className="text-xs text-warm-gray">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-gray transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Delivery Threshold */}
        {subtotal() < 100 && (
          <div className="mx-6 mt-4 rounded-xl bg-emerald-500/10 p-3">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <TruckIcon size={16} />
              <span className="font-medium">
                Add QR {Math.ceil(100 - subtotal())} more for FREE delivery!
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-dark-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal() / 100) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-warm-gray">
              {formatPrice(subtotal())} of QR 100 threshold
            </p>
          </div>
        )}
        {subtotal() >= 100 && (
          <div className="mx-6 mt-4 rounded-xl bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
            You qualify for FREE delivery!
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 text-warm-gray/30"><CartIcon size={48} /></div>
              <p className="text-warm-gray">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-lg bg-gold px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gold-light"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.modelId}`}
                  className="flex gap-4 rounded-xl border border-dark-border bg-black/50 p-3"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-black">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] text-warm-gray/60 uppercase">{item.modelName}</p>
                    <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                    <p className="text-sm font-bold text-gold">{formatPrice(item.price)}</p>

                    {/* Quantity Controls */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.modelId, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-dark-border text-warm-gray transition-colors hover:border-gold/30 hover:text-white"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.modelId, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-dark-border text-warm-gray transition-colors hover:border-gold/30 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.modelId)}
                        className="text-xs text-warm-gray/60 transition-colors hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals and WhatsApp button */}
        {items.length > 0 && (
          <div className="border-t border-dark-border px-6 py-4 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal())}</span>
              </div>
              {tierDiscount() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Tier Discount</span>
                  <span className="text-emerald-400">-{formatPrice(tierDiscount())}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Promo Discount</span>
                  <span className="text-emerald-400">-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dark-border pt-2">
                <span className="font-semibold text-white">Total</span>
                <span className="font-bold text-gold text-lg">{formatPrice(total())}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-dark-border bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-warm-gray/40 focus:border-gold/50 focus:outline-none"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-warm-gray/60">+974</span>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full rounded-lg border border-dark-border bg-black/50 py-2.5 pl-12 pr-3 text-sm text-white placeholder:text-warm-gray/40 focus:border-gold/50 focus:outline-none"
                  inputMode="numeric"
                  maxLength={8}
                />
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!customerName.trim() || customerPhone.length < 8}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Order on WhatsApp
            </button>

            <p className="text-center text-[10px] text-warm-gray/60">
              Order via WhatsApp — fast and easy
            </p>
          </div>
        )}
      </div>
    </>
  );
}
