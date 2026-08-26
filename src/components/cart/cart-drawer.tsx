"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/context";
import { getWhatsAppNumber } from "@/lib/settings";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { Price } from "@/components/ui/price";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Truck,
  ShieldCheck,
  ArrowRight,
  MessageSquare
} from "lucide-react";

export function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, setOpen, removeItem, updateQuantity, total, subtotal, tierDiscount, promoDiscount } = useCartStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { formatPrice } = useI18n();

  const [deliveryThreshold, setDeliveryThreshold] = useState(100);
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(true);

  // Automatically close cart drawer when navigating to another page
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Fetch WhatsApp number, delivery threshold, and saved customer credentials on mount
  useEffect(() => {
    getWhatsAppNumber().then(setWhatsappNumber);

    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("casele_customer_name");
      const savedPhone = localStorage.getItem("casele_customer_phone");
      if (savedName) setCustomerName(savedName);
      if (savedPhone) setCustomerPhone(savedPhone);
    }

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.free_delivery_enabled !== undefined) {
          setFreeDeliveryEnabled(data.settings.free_delivery_enabled !== "false");
        }
        if (data.settings?.free_delivery_threshold) {
          const val = Number(data.settings.free_delivery_threshold);
          if (val > 0) setDeliveryThreshold(val);
        }
      })
      .catch(() => {});
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
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const handleWhatsAppOrder = () => {
    if (typeof window !== "undefined") {
      if (customerName.trim()) localStorage.setItem("casele_customer_name", customerName.trim());
      if (customerPhone.trim()) localStorage.setItem("casele_customer_phone", customerPhone.trim());
    }

    const message = buildWhatsAppMessage({
      customerName: customerName.trim() || "Customer",
      customerPhone: customerPhone ? `+974 ${customerPhone}` : "",
      items: items.map((item) => ({
        name: item.name,
        model: item.modelName,
        finish: item.finish,
        caseType: item.caseType,
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

  const currentSubtotal = subtotal();
  const progressPercent = Math.min(100, (currentSubtotal / deliveryThreshold) * 100);
  const qualifiesForFreeDelivery = currentSubtotal >= deliveryThreshold;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-Over Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white border-l border-neutral-200/80 shadow-2xl transition-all duration-300 ease-out text-neutral-950 ${
          isOpen ? "translate-x-0 opacity-100 visible pointer-events-auto" : "translate-x-full opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">Your Shopping Bag</h2>
              <p className="text-xs text-neutral-500">{itemCount} {itemCount === 1 ? "piece" : "pieces"} selected</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close bag"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {freeDeliveryEnabled && deliveryThreshold > 0 && (
          <div className="mx-6 mt-4 rounded-xl bg-neutral-50 border border-neutral-200/70 p-3.5">
            {qualifiesForFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Truck className="h-4 w-4 text-emerald-600" />
                <span>You have unlocked <strong>Complimentary Doha Delivery</strong></span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <Truck className="h-3.5 w-3.5 text-neutral-500" />
                    <span>
                      Add <strong className="text-neutral-950">QR {Math.ceil(deliveryThreshold - currentSubtotal)}</strong> for FREE Express Delivery
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500">{Math.round(progressPercent)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-neutral-900">Your bag is currently empty</p>
              <p className="mt-1 text-xs text-neutral-500 max-w-xs leading-relaxed">
                Discover our precision-engineered protective cases for flagship devices.
              </p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.modelId}-${item.finish}-${item.caseType}`}
                  className="flex gap-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-3 transition-colors hover:bg-neutral-50"
                >
                  {/* Thumbnail */}
                  <div className="relative h-18 w-18 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-neutral-200/60">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="72px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{item.modelName}</span>
                      {item.finish && (
                        <span className="rounded bg-neutral-200/70 px-1.5 py-0.2 text-[9px] font-semibold text-neutral-800 uppercase">
                          {item.finish}
                        </span>
                      )}
                      {item.caseType && item.caseType.includes("MagSafe") && (
                        <span className="rounded bg-[#FBF8EF] border border-[#E8DCB8] px-1.5 py-0.2 text-[9px] font-semibold text-[#8C6D28] uppercase">
                          MagSafe
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-neutral-950 truncate mt-0.5">{item.name}</span>
                    <Price price={item.price} size="sm" showBadge={false} />

                    {/* Quantity Controls */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-xl border border-neutral-200 bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.modelId, item.quantity - 1, item.finish, item.caseType)}
                          className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-l-xl transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-neutral-950 font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.modelId, item.quantity + 1, item.finish, item.caseType)}
                          className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-r-xl transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.modelId, item.finish, item.caseType)}
                        className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove</span>
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
          <div className="border-t border-neutral-200/80 bg-neutral-50/50 px-6 py-4 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="text-neutral-950 font-medium">{formatPrice(currentSubtotal)}</span>
              </div>
              {tierDiscount() > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Tier Bundle Savings</span>
                  <span>-{formatPrice(tierDiscount())}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Code Savings</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200/80 pt-2 text-sm font-bold text-neutral-950">
                <span>Estimated Total</span>
                <span className="font-display text-base tracking-tight">{formatPrice(total())}</span>
              </div>
            </div>

            {/* Quick Customer Info */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name (for delivery in Qatar)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-semibold font-mono">+974</span>
                <input
                  type="tel"
                  placeholder="Mobile / WhatsApp number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-14 pr-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                  inputMode="numeric"
                  maxLength={8}
                />
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={!customerName.trim() || customerPhone.length < 8}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Checkout via WhatsApp</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
              <span>Direct Concierge Checkout • Cash on Delivery Available</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
