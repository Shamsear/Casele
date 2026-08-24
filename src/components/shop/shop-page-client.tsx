"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/product-card";
import { Reveal, StaggeredGrid } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { ProductWithRelations, ModelWithCount } from "@/lib/db/products";

interface ShopPageClientProps {
  products: ProductWithRelations[];
  models: ModelWithCount[];
  brands: string[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export function ShopPageClient({ products, models, brands }: ShopPageClientProps) {
  const [activeBrand, setActiveBrand] = useState("All");
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState<"grid" | "large">("grid");

  const filtered = useMemo(() => {
    let result =
      activeBrand === "All"
        ? [...products]
        : products.filter((p) =>
            p.models.some((m) => m.brand === activeBrand)
          );

    switch (sort) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "popular":
        result.sort((a, b) => b.orderCount - a.orderCount);
        break;
    }

    return result;
  }, [products, activeBrand, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Page header */}
      <Reveal>
        <div className="mb-8">
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-2">Browse Collection</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Shop All Cases</h1>
          <p className="mt-2 text-warm-gray">
            <span className="text-white font-semibold">{filtered.length}</span> cases available — find the perfect case for your phone
          </p>
        </div>
      </Reveal>

      {/* Filters bar */}
      <Reveal delay={100}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-dark-border/50 bg-dark-surface/30 p-4 backdrop-blur-sm">
          {/* Brand filters */}
          <div className="flex gap-2 flex-wrap">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95",
                  activeBrand === brand
                    ? "bg-gold text-black shadow-md shadow-gold/20"
                    : "bg-dark-surface/50 text-warm-gray hover:text-white hover:bg-dark-surface"
                )}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Layout toggle */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-dark-border p-1">
              <button
                onClick={() => setLayout("grid")}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                  layout === "grid" ? "bg-gold/10 text-gold" : "text-warm-gray hover:text-white"
                )}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setLayout("large")}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                  layout === "large" ? "bg-gold/10 text-gold" : "text-warm-gray hover:text-white"
                )}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-xl border border-dark-border bg-dark-surface/50 px-3 text-sm text-white focus:border-gold/50 focus:outline-none cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Reveal>

      {/* Products grid */}
      <div
        className={cn(
          "grid gap-4 md:gap-6 transition-all duration-300",
          layout === "large"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {filtered.map((product, i) => (
          <Reveal key={product.id} delay={Math.min(i * 50, 400)}>
            <ProductCard product={product} index={i} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <Reveal>
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-surface text-warm-gray/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white">No cases found</p>
            <p className="mt-1 text-sm text-warm-gray">Try a different filter or browse all our cases</p>
            <button
              onClick={() => setActiveBrand("All")}
              className="mt-4 rounded-xl bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold transition-all hover:bg-gold/20"
            >
              Clear filters
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
