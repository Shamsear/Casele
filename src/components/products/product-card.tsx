"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getDiscountPercent } from "@/lib/utils";
import { Price } from "@/components/ui/price";
import { ProductBadge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
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
  };
  className?: string;
  index?: number;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();
  const { toast } = useToast();

  const [isAdded, setIsAdded] = useState(false);

  const discount = getDiscountPercent(product.price, product.comparePrice ?? null);
  const modelSlug = product.modelSlug || "iphone-15-pro";
  const imageUrl = product.images[0] || "/images/products/midnight-black.svg";
  const hasSecondImage = product.images.length > 1;
  const secondImageUrl = hasSecondImage ? product.images[1] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
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
    });

    vibrate(10);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
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
      {/* ═══ 4:5 Aspect Ratio Product Image Frame (Containerless Editorial Look) ═══ */}
      <Link
        href={`/shop/${modelSlug}/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100/70 block transition-all duration-300 group-hover:bg-neutral-100"
      >
        {/* Primary Studio Angle */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-contain p-4 sm:p-6 transition-all duration-500 ease-out group-hover:scale-105 drop-shadow-sm",
            hasSecondImage && "group-hover:opacity-0"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Secondary Detail Angle on Hover */}
        {secondImageUrl && (
          <Image
            src={secondImageUrl}
            alt={`${product.name} alternate angle`}
            fill
            className="object-contain p-4 sm:p-6 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105 drop-shadow-sm"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Minimal Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && <ProductBadge badge={product.badge} />}
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200/80 text-neutral-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xs cursor-pointer",
            isWishlisted && "text-red-500 border-red-200 bg-red-50/90"
          )}
        >
          <Heart
            className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-current")}
          />
        </button>

        {/* Quick Action Overlay (Slide-up button directly on bottom of image) */}
        <div className="absolute bottom-3 inset-x-3 z-10 hidden sm:block pointer-events-none">
          <button
            onClick={handleAddToCart}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 pointer-events-auto cursor-pointer shadow-md",
              "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.98]"
            )}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* ═══ Details Directly on Canvas (No Boxy Card Container) ═══ */}
      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-neutral-400">
          <span className="uppercase tracking-widest truncate">{product.modelName}</span>
          {product.categoryName && (
            <span className="text-[10px] text-neutral-400 shrink-0 font-medium uppercase tracking-wider whitespace-nowrap">
              {product.categoryName}
            </span>
          )}
        </div>

        <Link
          href={`/shop/${modelSlug}/${product.slug}`}
          className="mt-1 font-medium text-sm text-neutral-950 line-clamp-1 hover:text-neutral-600 transition-colors"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <Price price={product.price} comparePrice={product.comparePrice} size="sm" showBadge={false} />
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleAddToCart}
            aria-label="Add to bag"
            className={cn(
              "sm:hidden flex h-7 items-center justify-center gap-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0",
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-neutral-950 text-white active:scale-95"
            )}
          >
            {isAdded ? <Check className="h-3 w-3" /> : "+ Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
