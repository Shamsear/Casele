"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
import { Price } from "@/components/ui/price";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { getWhatsAppNumber } from "@/lib/settings";
import { MessageSquare, ShoppingBag, ShieldCheck } from "lucide-react";

interface StickyAddToCartProps {
  productId: string;
  name: string;
  image: string;
  price: string;
  comparePrice?: string | null;
  modelId: string;
  modelName: string;
  finish?: string;
  caseType?: string;
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
  finish = "Matte",
  caseType = "Slim Precision",
  quantity,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const addItem = useCartStore((s) => s.addItem);
  const { vibrate } = useHaptic();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      // Trigger after user scrolls past the main hero/gallery section
      setVisible(window.scrollY > 350);
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
        finish,
        caseType,
      });
    }
    vibrate(10);
    toast(`${name} (${finish} • ${modelName}) added to bag`);
  };

  const handleBuyNow = () => {
    const message = buildWhatsAppMessage({
      customerName: "Customer",
      customerPhone: "",
      items: [{ name, model: modelName, finish, caseType, qty: quantity, price: parseFloat(price) }],
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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200/80 bg-white/90 backdrop-blur-xl px-4 py-3 sm:px-8 shadow-2xl transition-all duration-300 animate-slide-up">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Product Thumbnail & Specifications */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/80">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#A88B4D] uppercase tracking-wider">
                {modelName}
              </span>
              <span className="hidden sm:inline-block rounded-sm bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-700 uppercase">
                {finish} Finish
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-neutral-950 truncate max-w-xs sm:max-w-md">
              {name}
            </p>
          </div>
        </div>

        {/* Right: Live Price & Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden xs:block">
            <Price price={price} comparePrice={comparePrice} size="sm" showBadge={false} />
            <span className="text-[10px] text-emerald-600 font-semibold block">Doha Express</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBuyNow}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 shadow-xs transition-all cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp Order</span>
              <span className="sm:hidden">Order</span>
            </button>

            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 active:scale-95 shadow-2xs transition-all cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
