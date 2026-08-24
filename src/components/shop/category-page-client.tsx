"use client";

import { ProductCard } from "@/components/products/product-card";
import type { ProductWithRelations } from "@/lib/db/products";

interface CategoryPageClientProps {
  products: ProductWithRelations[];
  displayName: string;
  description?: string | null;
}

export function CategoryPageClient({ products, displayName, description }: CategoryPageClientProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-12 pb-6 border-b border-dark-border">
        <p className="text-[11px] font-semibold text-gold tracking-widest uppercase mb-1">
          Series
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-white">
          {displayName}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-warm-gray leading-relaxed max-w-xl">
          {description || "A curated selection of cases crafted with distinct material profiles."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-24 text-center border border-dark-border bg-[#0D0D0D]">
          <p className="text-sm uppercase tracking-widest text-white font-medium">No items currently available</p>
          <p className="mt-1 text-xs text-warm-gray">Explore other series from our collection</p>
          <a
            href="/shop"
            className="mt-6 inline-block border border-white/20 px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:border-white hover:bg-white/5 transition-colors"
          >
            Browse All Cases
          </a>
        </div>
      )}
    </div>
  );
}
