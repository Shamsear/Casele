"use client";

import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/ui/reveal";
import type { ProductWithRelations } from "@/lib/db/products";

interface CategoryPageClientProps {
  products: ProductWithRelations[];
  displayName: string;
  description?: string | null;
}

export function CategoryPageClient({ products, displayName, description }: CategoryPageClientProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Reveal>
        <div className="mb-8">
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-2">Curated Collection</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            {displayName} Collection
          </h1>
          <p className="mt-2 text-warm-gray leading-relaxed">
            {description || "Browse our curated luxury collection of premium cases"}
          </p>
          <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-gold to-transparent" />
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={Math.min(i * 60, 400)}>
            <ProductCard product={product} index={i} />
          </Reveal>
        ))}
      </div>

      {products.length === 0 && (
        <Reveal>
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-surface text-warm-gray/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white">No cases in this collection yet</p>
            <p className="mt-1 text-sm text-warm-gray">Explore other styles or browse the entire catalog</p>
            <a
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-semibold text-black hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              Browse all cases
            </a>
          </div>
        </Reveal>
      )}
    </div>
  );
}
