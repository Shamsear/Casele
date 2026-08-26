"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { useHaptic } from "@/hooks/use-haptic";
import { Price } from "@/components/ui/price";
import { QuickBuyModal } from "@/components/products/quick-buy-modal";
import { getWhatsAppNumber } from "@/lib/settings";
import { flyToCart } from "@/lib/fly-to-cart";
import { MessageSquare, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  stock?: number;
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
  stock,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setOpenCart = useCartStore((s) => s.setOpen);
  const { vibrate } = useHaptic();

  const isOutOfStock = stock !== undefined && stock <= 0;

  useEffect(() => {
    getWhatsAppNumber().then(setWhatsappNumber);

    const target = document.getElementById("main-add-to-cart-btn");
    if (!target) {
      const handleScroll = () => {
        setVisible(window.scrollY > 600);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Visible ONLY when the main Add to Bag button has scrolled above the viewport
        const isAbove = entry.boundingClientRect.top < 0;
        setVisible(!entry.isIntersecting && isAbove);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleAdd = (e?: React.MouseEvent) => {
    if (isOutOfStock) return;
    addItem(
      {
        productId,
        name,
        image,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        modelId,
        modelName,
        finish,
        caseType,
      },
      quantity,
      false // Run animation first
    );
    vibrate(15);
    setIsAdded(true);

    const sourceEl = document.querySelector(".sticky-thumb-img") as HTMLElement | null;
    flyToCart(image, sourceEl, () => {
      setOpenCart(true);
    });

    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    setQuickBuyOpen(true);
  };

  if (!visible) return null;

  return (
    <>
      {/* ═══ Floating Compact Pill Bar with Fully Rounded Corners ═══ */}
      <div className="fixed bottom-5 sm:bottom-6 inset-x-0 mx-auto max-w-xl w-[calc(100%-2rem)] z-40 rounded-full bg-white/95 backdrop-blur-2xl border border-neutral-200/90 px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.18)] transition-all duration-300 animate-slide-up flex items-center justify-between gap-2.5 sm:gap-4 select-none">
        {/* Left: Product Thumbnail & Specifications */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="sticky-thumb-img relative h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-full bg-neutral-50 border border-neutral-200/80">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-1 drop-shadow-xs"
              sizes="40px"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[9.5px] font-bold text-[#A88B4D] uppercase tracking-wider truncate">
                {modelName}
              </span>
              <span className="hidden sm:inline-block rounded-full bg-neutral-100 px-1.5 py-0.2 text-[8.5px] font-semibold text-neutral-600 uppercase">
                {finish}
              </span>
            </div>
            <p className="text-xs font-bold text-neutral-950 truncate max-w-[110px] xs:max-w-[160px] sm:max-w-[200px]">
              {name}
            </p>
          </div>
        </div>

        {/* Right: Live Price & Compact Rounded Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <div className="text-right hidden xs:block">
            <Price price={price} comparePrice={comparePrice} size="sm" showBadge={false} />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isOutOfStock ? (
              <div className="flex items-center rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
                Sold Out
              </div>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 shadow-xs transition-all cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                  <span className="sm:hidden">Order</span>
                </button>

                <button
                  onClick={handleAdd}
                  aria-label="Add to Bag"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-xs cursor-pointer",
                    isAdded
                      ? "bg-neutral-950 text-white border-neutral-950 ring-2 ring-[#C5A869]/40"
                      : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#DFCA9B] stroke-[2.8]" />
                      <span className="hidden sm:inline text-white">Added ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Add to Bag</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!isOutOfStock && (
        <QuickBuyModal
          isOpen={quickBuyOpen}
          onClose={() => setQuickBuyOpen(false)}
          product={{
            name,
            price: parseFloat(price),
            modelName,
            finish,
            caseType,
            image,
            quantity,
          }}
          whatsappNumber={whatsappNumber}
        />
      )}
    </>
  );
}
