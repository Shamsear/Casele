"use client";

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
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();
  const { toast } = useToast();
  const { formatPrice } = useI18n();

  const discount = getDiscountPercent(product.price, product.comparePrice ?? null);
  const modelSlug = product.modelSlug || "iphone-15-pro";
  const imageUrl = product.images[0] || "/images/products/midnight-black.svg";

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
    toast(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      href={`/shop/${modelSlug}/${product.slug}`}
      className={cn(
        "group relative flex flex-col rounded-xl bg-cream/5 p-2 transition-all duration-300",
        "hover:bg-cream/10",
        "before:absolute before:inset-0 before:rounded-xl before:border before:border-transparent before:transition-all before:duration-300",
        "hover:before:border-gold/30",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
        <Image
          src={imageUrl}
          alt={`${product.name} — ${product.modelName} phone case by CASELE`}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <ProductBadge badge={product.badge} />
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <svg
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#D4AF37" : "none"}
            stroke={isWishlisted ? "#D4AF37" : "white"}
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2">
        <p className="text-xs text-warm-gray">{product.modelName}</p>
        <h3 className="mt-0.5 text-sm font-medium text-white line-clamp-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto">
          <Price price={product.price} comparePrice={product.comparePrice} size="sm" />
        </div>

        {/* Quick add button */}
        <button
          onClick={handleAddToCart}
          className="mt-2 flex h-9 items-center justify-center rounded-lg border border-dark-border bg-dark-surface text-xs font-medium text-white transition-all hover:border-gold/30 hover:text-gold active:scale-[0.98]"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
