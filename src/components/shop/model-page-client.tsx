"use client";

import { ProductCard } from "@/components/products/product-card";
import type { ProductWithRelations } from "@/lib/db/products";

interface ModelPageClientProps {
  products: ProductWithRelations[];
  displayName: string;
  modelSlug: string;
}

export function ModelPageClient({ products, displayName, modelSlug }: ModelPageClientProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white">
        Cases for {displayName}
      </h1>
      <p className="mt-2 text-warm-gray">
        {products.length} compatible {products.length === 1 ? "case" : "cases"}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-warm-gray">No cases found for this model yet.</p>
          <a
            href="/shop"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-black hover:bg-gold-light transition-colors"
          >
            Browse all cases
          </a>
        </div>
      )}
    </div>
  );
}
