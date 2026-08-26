"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { flyToCart } from "@/lib/fly-to-cart";
import { useHaptic } from "@/hooks/use-haptic";
import type { ProductWithRelations } from "@/lib/db/products";
import {
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSpotlightCardProps {
  products: ProductWithRelations[];
}

export function HeroSpotlightCard({ products }: HeroSpotlightCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setOpenCart = useCartStore((s) => s.setOpen);
  const { vibrate } = useHaptic();

  // Curate showcase cases
  const showcaseList = products.length > 0 ? products.slice(0, 6) : [];
  const currentProduct = showcaseList[activeIndex] || products[0];

  if (!currentProduct) return null;

  const currentImage = currentProduct.images[0] || "/images/products/gold-edge.svg";
  const modelSlug = currentProduct.modelSlug || "iphone-15-pro-max";
  const productSlug = currentProduct.slug || "gold-edge-luxe";

  const formattedPrice = (() => {
    const num = parseFloat(currentProduct.price);
    return `QR ${isNaN(num) ? currentProduct.price : num}`;
  })();

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    vibrate(5);
    setActiveIndex((prev) => (prev - 1 + showcaseList.length) % showcaseList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    vibrate(5);
    setActiveIndex((prev) => (prev + 1) % showcaseList.length);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(
      {
        productId: currentProduct.id,
        name: currentProduct.name,
        image: currentImage,
        price: parseFloat(currentProduct.price),
        comparePrice: currentProduct.comparePrice
          ? parseFloat(currentProduct.comparePrice)
          : undefined,
        modelId: modelSlug,
        modelName: currentProduct.modelName,
        finish: "Matte",
        caseType: "Slim Precision",
      },
      1,
      false // Run animation first
    );

    vibrate(12);
    setIsAdded(true);

    const sourceEl = document.querySelector(".hero-spotlight-img") as HTMLElement | null;
    flyToCart(currentImage, sourceEl, () => {
      setOpenCart(true);
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="relative w-full aspect-[4/5] rounded-[32px] sm:rounded-[36px] bg-white border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] overflow-hidden group select-none">
      {/* Ambient Glow Aura */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-100/50 blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-neutral-100/80 blur-2xl" />

      {/* ═══ Header Row: Studio Spotlight Badge (Left) + Left/Right Arrow Controls (Right) ═══ */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* Left: Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1 shadow-xs border border-neutral-800">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-ping" />
          <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">
            Studio Spotlight
          </span>
        </div>

        {/* Right: Left & Right Navigation Arrows */}
        {showcaseList.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous case"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-50/90 text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next case"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-50/90 text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ═══ Center Stage: Floating Case + Side Arrow Controls ═══ */}
      <div className="relative flex-1 my-1 flex items-center justify-center">
        {/* Side Floating Left Button */}
        {showcaseList.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous case"
            className="absolute left-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-neutral-200/80 text-neutral-700 shadow-xs hover:bg-neutral-950 hover:text-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Floating Case Silhouette Link */}
        <Link
          href={`/shop/${modelSlug}/${productSlug}`}
          className="relative h-full w-full max-h-[260px] flex items-center justify-center cursor-pointer"
        >
          <div className="hero-spotlight-img relative h-full w-full flex items-center justify-center">
            <Image
              src={currentImage}
              alt={currentProduct.name}
              fill
              priority
              className="object-contain p-2 drop-shadow-[0_15px_30px_rgba(0,0,0,0.14)] transition-transform duration-700 ease-out group-hover:scale-106 animate-float-slow"
              sizes="280px"
            />
          </div>
        </Link>

        {/* Side Floating Right Button */}
        {showcaseList.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next case"
            className="absolute right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-neutral-200/80 text-neutral-700 shadow-xs hover:bg-neutral-950 hover:text-white hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ═══ Bottom Information Glass Pill ═══ */}
      <div className="relative z-10 space-y-2">
        {/* Showcase Switcher Dots */}
        {showcaseList.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pb-1">
            {showcaseList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show ${item.name}`}
                className={cn(
                  "rounded-full transition-all duration-300 cursor-pointer",
                  idx === activeIndex
                    ? "w-5 h-1 bg-neutral-950"
                    : "w-1.5 h-1 bg-neutral-300 hover:bg-neutral-400"
                )}
              />
            ))}
          </div>
        )}

        {/* Floating Spec Capsule */}
        <div className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/80 backdrop-blur-md px-3.5 py-2.5 shadow-2xs transition-colors hover:bg-neutral-50">
          <Link
            href={`/shop/${modelSlug}/${productSlug}`}
            className="min-w-0 pr-2 group/link"
          >
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-[#A88B4D] uppercase tracking-wider truncate">
                {currentProduct.modelName || "Titanium Frame"}
              </span>
              <ArrowUpRight className="h-3 w-3 text-neutral-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </div>
            <p className="font-display text-xs sm:text-sm font-normal text-neutral-900 truncate">
              {currentProduct.name}
            </p>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-neutral-950 font-sans">
              {formattedPrice}
            </span>

            <button
              onClick={handleQuickAdd}
              aria-label="Add to bag"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 active:scale-95 shadow-xs cursor-pointer",
                isAdded
                  ? "bg-neutral-950 text-[#DFCA9B]"
                  : "bg-neutral-950 text-white hover:bg-neutral-800"
              )}
            >
              {isAdded ? (
                <Check className="h-3.5 w-3.5 text-[#DFCA9B] stroke-[2.8]" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
