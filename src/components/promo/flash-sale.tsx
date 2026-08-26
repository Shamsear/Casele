"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast";
import { Price } from "@/components/ui/price";
import { Zap, ArrowRight, Check } from "lucide-react";

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
  title = "LIMITED RELEASE FLASH SALE",
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
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-neutral-200/70">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 tracking-widest uppercase mb-1">
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Limited Window</span>
          </div>
          <h2 className="font-display text-3xl font-normal text-neutral-950 md:text-4xl">
            {title}
          </h2>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-neutral-950 text-white shadow-xs">
              <span className="text-xl font-bold font-mono leading-none">{pad(timeLeft.hours)}</span>
              <span className="text-[9px] font-medium text-neutral-400">HRS</span>
            </div>
            <span className="text-lg font-bold text-neutral-400">:</span>
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-neutral-950 text-white shadow-xs">
              <span className="text-xl font-bold font-mono leading-none">{pad(timeLeft.minutes)}</span>
              <span className="text-[9px] font-medium text-neutral-400">MIN</span>
            </div>
            <span className="text-lg font-bold text-neutral-400">:</span>
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-neutral-950 text-white shadow-xs">
              <span className="text-xl font-bold font-mono leading-none">{pad(timeLeft.seconds)}</span>
              <span className="text-[9px] font-medium text-neutral-400">SEC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {products.map((product) => {
          const discount = getDiscountPercent(product.price, product.comparePrice);

          return (
            <div
              key={product.id}
              className="group relative rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-xs transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col"
            >
              {/* Image Frame */}
              <Link
                href={`/shop/${product.modelSlug}/${product.slug}`}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-100/60 block"
              >
                {discount > 0 && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700">
                      Save {discount}%
                    </span>
                  </div>
                )}

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Link>

              {/* Details */}
              <div className="pt-3 flex flex-1 flex-col">
                <Link
                  href={`/shop/${product.modelSlug}/${product.slug}`}
                  className="text-xs font-semibold text-neutral-950 line-clamp-1 hover:text-neutral-600 transition-colors"
                >
                  {product.name}
                </Link>

                <div className="mt-2">
                  <Price price={product.price} comparePrice={product.comparePrice} size="sm" showBadge={false} />
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-auto pt-3 w-full inline-flex items-center justify-center rounded-xl bg-neutral-950 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
