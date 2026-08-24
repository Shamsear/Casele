"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n/context";
import { Price } from "@/components/ui/price";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { getWhatsAppNumber } from "@/lib/settings";

interface StickyAddToCartProps {
  productId: string;
  name: string;
  image: string;
  price: string;
  comparePrice?: string | null;
  modelId: string;
  modelName: string;
  quantity: number;
}

export function StickyAddToCart({
  productId,
  name,
  image,
  price,
  comparePrice,
  modelId,
  modelName,
  quantity,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const addItem = useCartStore((s) => s.addItem);
  const { vibrate } = useHaptic();
  const { toast } = useToast();
  const { formatPrice } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    getWhatsAppNumber().then(setWhatsappNumber);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId,
        name,
        image,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        modelId,
        modelName,
      });
    }
    vibrate(10);
    toast(`${name} added to cart`);
  };

  const handleBuyNow = () => {
    const message = buildWhatsAppMessage({
      customerName: "Customer",
      customerPhone: "",
      items: [{ name, model: modelName, qty: quantity, price: parseFloat(price) }],
      subtotal: parseFloat(price) * quantity,
      tierDiscount: 0,
      flashDiscount: 0,
      bundleDiscount: 0,
      promoDiscount: 0,
      total: parseFloat(price) * quantity,
    });
    openWhatsApp(whatsappNumber, message);
  };

  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <div className="mx-3 mb-1 rounded-2xl border border-dark-border/30 bg-black/90 backdrop-blur-2xl shadow-2xl shadow-black/50 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Product thumbnail */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-dark-surface">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-warm-gray/60 uppercase tracking-wider">{modelName}</p>
            <p className="text-xs font-semibold text-white truncate">{name}</p>
            <Price price={price} size="sm" showBadge={false} />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="cta" size="sm" onClick={handleBuyNow} className="text-xs px-4">
              Buy Now
            </Button>
            <Button variant="secondary" size="sm" onClick={handleAdd} className="text-xs px-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
