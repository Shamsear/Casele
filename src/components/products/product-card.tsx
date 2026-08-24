"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getDiscountPercent } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { ProductBadge } from "@/components/ui/badge";
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
  const { formatPrice } = useI18n();
  const cardRef = useRef<HTMLAnchorElement>(null);

  const [isAdded, setIsAdded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const discount = getDiscountPercent(product.price, product.comparePrice ?? null);
  const modelSlug = product.modelSlug || "iphone-15-pro";
  const imageUrl = product.images[0] || "/images/products/midnight-black.svg";
  const hasSecondImage = product.images.length > 1;
  const secondImageUrl = hasSecondImage ? product.images[1] : null;
  const isTrending = (product.orderCount ?? 0) > 5;

  // Spotlight mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);
  }, []);

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
    toast(`${product.name} added to cart`);

    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    setHeartAnim(true);
    vibrate(5);
    setTimeout(() => setHeartAnim(false), 400);
  };

  return (
    <Link
      ref={cardRef}
      href={`/shop/${modelSlug}/${product.slug}`}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight-card group relative flex flex-col rounded-2xl border border-dark-border/40 bg-dark-surface/40 overflow-hidden transition-all duration-300",
        "hover:border-gold/30 hover:bg-dark-surface/70 hover:shadow-xl hover:shadow-gold/5",
        "active:scale-[0.99]",
        className
      )}
    >
      {/* ═══ Image Area ═══ */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        {/* Primary image */}
        <Image
          src={imageUrl}
          alt={`${product.name} — ${product.modelName} phone case by CASELE`}
          fill
          className={cn(
            "object-contain p-4 transition-all duration-500 ease-out",
            "group-hover:scale-105",
            hasSecondImage && "group-hover:opacity-0"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />

        {/* Second image — crossfade on hover */}
        {secondImageUrl && (
          <Image
            src={secondImageUrl}
            alt={`${product.name} — alternate view`}
            fill
            className="object-contain p-4 transition-all duration-500 ease-out opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          <ProductBadge badge={product.badge} />
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
          {isTrending && !product.badge && (
            <span className="inline-flex items-center rounded-full bg-gold/20 border border-gold/40 px-2 py-0.5 text-[10px] font-bold text-gold">
              TRENDING
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-all duration-200 hover:bg-black/80 hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#D4AF37" : "none"}
            stroke={isWishlisted ? "#D4AF37" : "white"}
            strokeWidth="1.5"
            className={cn(
              "w-4 h-4 transition-all duration-300",
              heartAnim && "animate-heart-pop"
            )}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* ═══ Product Info ═══ */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] text-warm-gray/60 tracking-widest uppercase font-medium">
          {product.modelName}
        </p>
        <h3 className="mt-1 text-sm font-medium text-white line-clamp-1 group-hover:text-gold transition-colors duration-200">
          {product.name}
        </h3>

        <div className="mt-auto pt-2.5">
          <Price price={product.price} comparePrice={product.comparePrice} size="sm" />
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "mt-2.5 flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.97]",
            isAdded
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-dark-surface border border-dark-border text-white hover:border-gold/40 hover:text-gold"
          )}
        >
          {isAdded ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gold">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
