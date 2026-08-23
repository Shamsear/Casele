"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
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

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden border-t border-dark-border bg-black/95 backdrop-blur-xl px-4 py-3 safe-area-pb">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-warm-gray truncate">{modelName}</p>
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-sm font-bold text-gold">{formatPrice(price)}</p>
        </div>
        <Button variant="cta" size="sm" onClick={handleBuyNow} className="flex-shrink-0">
          Buy Now
        </Button>
        <Button variant="secondary" size="sm" onClick={handleAdd} className="flex-shrink-0">
          Cart
        </Button>
      </div>
    </div>
  );
}
