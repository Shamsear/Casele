"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
import { Price } from "@/components/ui/price";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { getWhatsAppNumber } from "@/lib/settings";
import { MessageSquare, ShoppingBag } from "lucide-react";

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
    toast(`${name} added to bag`);
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

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden border-t border-neutral-200/80 bg-white/95 backdrop-blur-xl px-4 py-2.5 shadow-lg animate-slide-up">
      <div className="flex items-center gap-3">
        {/* Product thumbnail */}
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-1"
            sizes="44px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">{modelName}</p>
          <p className="text-xs font-semibold text-neutral-950 truncate">{name}</p>
          <Price price={price} size="sm" showBadge={false} />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleBuyNow}
            className="flex items-center gap-1 rounded-xl bg-neutral-950 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 shadow-xs cursor-pointer"
          >
            <MessageSquare className="h-3 w-3" />
            <span>Order</span>
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center rounded-xl border border-neutral-300 bg-white p-2 text-neutral-900 hover:bg-neutral-100 active:scale-95 cursor-pointer"
            aria-label="Add to bag"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
