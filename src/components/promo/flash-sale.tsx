"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast";

interface FlashSaleProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  comparePrice: number;
  stock: number;
  modelSlug: string;
  slug: string;
}

interface FlashSaleProps {
  products: FlashSaleProduct[];
  endsAt: Date;
  title?: string;
}

export function FlashSale({
  products,
  endsAt,
  title = "FLASH SALE",
}: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endsAt.getTime() - Date.now();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const handleAddToCart = (product: FlashSaleProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      comparePrice: product.comparePrice,
      modelId: product.modelSlug,
      modelName: product.modelSlug,
    });
    toast(`${product.name} added to cart`);
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-1 text-warm-gray">
            Hurry up! Sale ends soon
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gold text-black">
              <span className="text-2xl font-bold leading-none">{pad(timeLeft.hours)}</span>
              <span className="text-[10px] font-medium">HRS</span>
            </div>
            <span className="text-xl font-bold text-gold">:</span>
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gold text-black">
              <span className="text-2xl font-bold leading-none">{pad(timeLeft.minutes)}</span>
              <span className="text-[10px] font-medium">MIN</span>
            </div>
            <span className="text-xl font-bold text-gold">:</span>
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gold text-black">
              <span className="text-2xl font-bold leading-none">{pad(timeLeft.seconds)}</span>
              <span className="text-[10px] font-medium">SEC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {products.map((product) => {
          const discount = getDiscountPercent(product.price, product.comparePrice);
          const stockPercent = Math.max(0, (product.stock / 50) * 100); // Assume 50 total stock

          return (
            <Link
              key={product.id}
              href={`/shop/${product.modelSlug}/${product.slug}`}
              className="group relative rounded-2xl border border-dark-border bg-dark-surface/50 overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                  {discount}% OFF
                </span>
              </div>

              {/* Low Stock Warning */}
              {product.stock < 10 && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-bold text-black">                     Only {product.stock} left!
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-black p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-gold transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gold">
                    QR {product.price}
                  </span>
                  <span className="text-sm text-warm-gray line-through">
                    QR {product.comparePrice}
                  </span>
                </div>

                {/* Stock Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-warm-gray mb-1">
                    <span>{product.stock} sold</span>
                    <span>{100 - Math.round(stockPercent)} left</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-dark-border">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all"
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="mt-3 w-full rounded-lg bg-gold/10 py-2 text-xs font-medium text-gold transition-colors hover:bg-gold/20"
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All */}
      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl border border-dark-border px-6 py-3 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white"
        >
          View All Flash Deals
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
