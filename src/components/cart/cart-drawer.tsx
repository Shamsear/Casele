"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/context";
import { getWhatsAppNumber } from "@/lib/settings";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { TruckIcon, CartIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";

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

  const deliveryThreshold = 100;
  const currentSubtotal = subtotal();
  const progressPercent = Math.min(100, (currentSubtotal / deliveryThreshold) * 100);
  const qualifiesForFreeDelivery = currentSubtotal >= deliveryThreshold;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-dark-surface shadow-2xl shadow-black/50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Your Cart</h2>
            <p className="text-xs text-warm-gray mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-warm-gray transition-all hover:text-white hover:bg-dark-surface active:scale-90"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Delivery Progress */}
        <div className="mx-6 mt-4 rounded-2xl bg-dark-surface/80 border border-dark-border/50 p-4">
          {qualifiesForFreeDelivery ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold">🎉 You qualify for FREE delivery!</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm">
                <TruckIcon size={16} className="text-emerald-400" />
                <span className="font-medium text-white">
                  Add <span className="text-emerald-400 font-bold">QR {Math.ceil(deliveryThreshold - currentSubtotal)}</span> more for FREE delivery!
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-dark-border">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-warm-gray">
                {formatPrice(currentSubtotal)} of QR {deliveryThreshold} threshold
              </p>
            </>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 text-warm-gray/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">Your cart is empty</p>
              <p className="mt-1 text-sm text-warm-gray">Discover premium cases for your phone</p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-95"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={`${item.productId}-${item.modelId}`}
                  className="flex gap-4 rounded-2xl border border-dark-border/50 bg-black/30 p-3 transition-all duration-300 hover:border-dark-border"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-black/60 to-black/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <p className="text-[10px] text-warm-gray/50 uppercase tracking-wider">{item.modelName}</p>
                    <p className="text-sm font-semibold text-white line-clamp-1">{item.name}</p>
                    <Price price={item.price} size="sm" showBadge={false} />

                    {/* Quantity Controls */}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.modelId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-dark-border text-warm-gray transition-all hover:border-gold/30 hover:text-white active:scale-90"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.modelId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-dark-border text-warm-gray transition-all hover:border-gold/30 hover:text-white active:scale-90"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.modelId)}
                        className="text-xs text-warm-gray/50 transition-colors hover:text-red-400 font-medium"
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
          <div className="border-t border-dark-border px-6 py-5 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Subtotal</span>
                <span className="text-white font-medium">{formatPrice(currentSubtotal)}</span>
              </div>
              {tierDiscount() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400 font-medium">Tier Discount</span>
                  <span className="text-emerald-400 font-medium">-{formatPrice(tierDiscount())}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400 font-medium">Promo Discount</span>
                  <span className="text-emerald-400 font-medium">-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dark-border pt-3">
                <span className="font-semibold text-white">Total</span>
                <span className="font-display font-bold text-gold text-xl">{formatPrice(total())}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-black/50 px-4 py-3 text-sm text-white placeholder:text-warm-gray/40 focus:border-gold/50 focus:outline-none transition-colors"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-warm-gray/50 font-medium">+974</span>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full rounded-xl border border-dark-border bg-black/50 py-3 pl-14 pr-4 text-sm text-white placeholder:text-warm-gray/40 focus:border-gold/50 focus:outline-none transition-colors"
                  inputMode="numeric"
                  maxLength={8}
                />
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gold px-6 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!customerName.trim() || customerPhone.length < 8}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Order on WhatsApp
            </button>

            <p className="text-center text-[10px] text-warm-gray/50">
              Secure checkout via WhatsApp — fast and easy
            </p>
          </div>
        )}
      </div>
    </>
  );
}
