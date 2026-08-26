"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductBadge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useHaptic } from "@/hooks/use-haptic";
import { flyToCart } from "@/lib/fly-to-cart";
import { Heart, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    comparePrice?: string | null | undefined;
    images: string[];
    badge?: string | null;
    modelName: string;
    modelSlug?: string;
    categoryName?: string;
    orderCount?: number;
    stock?: number;
    inStock?: boolean;
  };
  className?: string;
  index?: number;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setOpenCart = useCartStore((s) => s.setOpen);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();

  const [isAdded, setIsAdded] = useState(false);

  const modelSlug = product.modelSlug || "iphone-15-pro";
  const imageUrl = product.images[0] || "/images/products/midnight-black.svg";
  const hasSecondImage = product.images.length > 1;
  const secondImageUrl = hasSecondImage ? product.images[1] : null;

  const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0);

  // Format title: e.g. "Blush Lace | Phone Case"
  const formattedTitle = (() => {
    const cleaned = product.name.replace(/\s*(Premium|Luxe|Classic)?\s*Case$/i, "").trim();
    return `${cleaned} | Phone Case`;
  })();

  // Format price: e.g. "QAR 99,00"
  const formattedPrice = (() => {
    const num = parseFloat(product.price);
    return `QAR ${isNaN(num) ? product.price : num.toFixed(2).replace(".", ",")}`;
  })();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem(
      {
        productId: product.id,
        name: product.name,
        image: imageUrl,
        price: parseFloat(product.price),
        comparePrice: product.comparePrice
          ? parseFloat(product.comparePrice)
          : undefined,
        modelId: modelSlug,
        modelName: product.modelName,
        finish: "Matte",
        caseType: "Slim Precision",
      },
      1,
      false // Run animation first
    );

    vibrate(10);
    setIsAdded(true);

    flyToCart(imageUrl, e.currentTarget as HTMLElement, () => {
      setOpenCart(true);
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    vibrate(5);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col transition-all duration-300",
        className
      )}
    >
      {/* ═══ 100% Transparent Aspect Ratio Canvas ═══ */}
      <Link
        href={`/shop/${modelSlug}/${product.slug}`}
        className="relative aspect-[3/4] w-full block bg-transparent"
      >
        {/* Primary Phone Case Image */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-contain p-2 sm:p-3 transition-all duration-500 ease-out group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.09)]",
            hasSecondImage && "group-hover:opacity-0",
            isOutOfStock && "opacity-60 grayscale-[30%]"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Alternate Angle on Hover */}
        {secondImageUrl && !isOutOfStock && (
          <Image
            src={secondImageUrl}
            alt={`${product.name} alternate view`}
            fill
            className="object-contain p-2 sm:p-3 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.09)]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges / Sold Out Indicator */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-950/90 text-white backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-white/15 shadow-sm">
              Sold Out
            </span>
          ) : (
            product.badge && <ProductBadge badge={product.badge} />
          )}
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200/80 text-neutral-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xs cursor-pointer opacity-0 group-hover:opacity-100 sm:opacity-0",
            isWishlisted && "opacity-100 text-red-500 border-red-200 bg-red-50/90"
          )}
        >
          <Heart
            className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-current")}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-2 inset-x-2 z-10 hidden sm:block pointer-events-none">
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 pointer-events-auto cursor-pointer shadow-md",
                "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                isAdded
                  ? "bg-neutral-950 text-[#DFCA9B] border border-neutral-900 ring-2 ring-[#C5A869]/40"
                  : "bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.98]"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#DFCA9B] stroke-[2.8]" />
                  <span className="text-white font-bold">Added ✓</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </Link>

      {/* ═══ Editorial Typography: Title & Price ═══ */}
      <div className="flex flex-1 flex-col pt-2.5 space-y-0.5">
        <Link
          href={`/shop/${modelSlug}/${product.slug}`}
          className="font-display text-sm sm:text-base text-neutral-800 font-normal leading-snug truncate hover:text-neutral-950 transition-colors"
        >
          {formattedTitle}
        </Link>

        <p className="text-xs sm:text-sm font-normal text-neutral-500">
          {formattedPrice}
        </p>
      </div>
    </div>
  );
}
