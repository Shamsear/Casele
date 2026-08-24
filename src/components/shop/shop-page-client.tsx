"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";
import type { ProductWithRelations, ModelWithCount } from "@/lib/db/products";

interface ShopPageClientProps {
  products: ProductWithRelations[];
  models: ModelWithCount[];
  brands: string[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Releases" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most In-Demand" },
];

export function ShopPageClient({ products, models, brands }: ShopPageClientProps) {
  const [activeBrand, setActiveBrand] = useState("All");
  const [sort, setSort] = useState("newest");

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Editorial Catalog Header */}
      <div className="mb-12 pb-6 border-b border-dark-border">
        <p className="text-[11px] font-semibold text-gold tracking-widest uppercase mb-1">
          Catalog
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-white">
          The Full Collection
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-warm-gray">
          Displaying {filtered.length} curated protection styles
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-dark-border/40">
        {/* Brand Tabs */}
        <div className="flex gap-4 sm:gap-6 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={cn(
                "text-xs font-semibold uppercase tracking-widest transition-colors py-1",
                activeBrand === brand
                  ? "text-white border-b-2 border-gold"
                  : "text-warm-gray hover:text-white"
              )}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-warm-gray uppercase tracking-widest font-medium">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-dark-border bg-black px-3 py-1.5 text-xs text-white uppercase tracking-wider focus:border-gold focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-black text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center border border-dark-border bg-[#0D0D0D]">
          <p className="text-sm uppercase tracking-widest text-white font-medium">No items found</p>
          <p className="mt-1 text-xs text-warm-gray">Try selecting a different brand category</p>
          <button
            onClick={() => setActiveBrand("All")}
            className="mt-6 border border-white/20 px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:border-white hover:bg-white/5 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
