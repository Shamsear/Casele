"use client";

import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import type { ProductWithRelations } from "@/lib/db/products";
import { ArrowLeft, Smartphone } from "lucide-react";

interface ModelPageClientProps {
  products: ProductWithRelations[];
  displayName: string;
  modelSlug: string;
}

export function ModelPageClient({ products, displayName }: ModelPageClientProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Collection</span>
        </Link>

        {/* Model Compatibility Header */}
        <div className="mb-10 pb-6 border-b border-neutral-200/70">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Dedicated Fit</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-neutral-950">
            Cases for {displayName}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600">
            {products.length} {products.length === 1 ? "enclosure" : "enclosures"} engineered specifically for this device form factor
          </p>
        </div>

        {/* 4:5 Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-24 text-center rounded-2xl border border-neutral-200/80 bg-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-neutral-950">No cases found for this model</p>
            <p className="mt-1 text-xs text-neutral-500">Browse other phone models in the catalog</p>
            <Link
              href="/shop"
              className="mt-5 inline-block rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
            >
              Browse All Cases
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
