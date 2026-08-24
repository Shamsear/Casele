"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getDiscountPercent } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { Price } from "@/components/ui/price";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";

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
    orderCount?: number;
  };
  className?: string;
  index?: number;
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
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
    });

    vibrate(10);
    setIsAdded(true);
    toast(`${product.name} added to bag`);

    setTimeout(() => setIsAdded(false), 1500);
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
        "group relative flex flex-col border border-dark-border bg-[#0E0E0E] transition-colors hover:border-white/30",
        className
      )}
    >
      {/* ═══ Image Frame ═══ */}
      <Link
        href={`/shop/${modelSlug}/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#141414] block"
      >
        {/* Primary Product Image */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-contain p-6 transition-all duration-300 ease-out",
            hasSecondImage && "group-hover:opacity-0"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Secondary Angle on Hover */}
        {secondImageUrl && (
          <Image
            src={secondImageUrl}
            alt={`${product.name} alternate view`}
            fill
            className="object-contain p-6 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Minimal Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-black/90 border border-white/10 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-white uppercase">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#B91C1C] px-2 py-0.5 text-[9px] font-semibold tracking-wider text-white uppercase">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center bg-black/60 text-white/70 backdrop-blur-sm transition-colors hover:text-white hover:bg-black"
        >
          <svg
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#C5A869" : "none"}
            stroke={isWishlisted ? "#C5A869" : "currentColor"}
            strokeWidth="1.5"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </Link>

      {/* ═══ Details & Actions ═══ */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] text-warm-gray uppercase tracking-widest font-medium">
          {product.modelName}
        </p>

        <Link
          href={`/shop/${modelSlug}/${product.slug}`}
          className="mt-1 font-display text-base text-white hover:text-gold transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <Price price={product.price} comparePrice={product.comparePrice} size="sm" showBadge={false} />

          <button
            onClick={handleAddToCart}
            className={cn(
              "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
              isAdded
                ? "bg-white text-black"
                : "border border-white/20 text-white hover:border-gold hover:text-gold"
            )}
          >
            {isAdded ? "Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
