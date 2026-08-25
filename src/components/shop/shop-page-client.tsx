"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";
import type { ProductWithRelations, ModelWithCount } from "@/lib/db/products";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

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

export function ShopPageClient({ products, brands }: ShopPageClientProps) {
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
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Editorial Catalog Header */}
        <div className="mb-10 pb-6 border-b border-neutral-200/70">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Complete Archive</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-neutral-950">
            The Full Collection
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            Showing {filtered.length} bespoke protective cases engineered for contemporary flagships
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-neutral-200/60">
          {/* Brand Tabs */}
          <div className="flex gap-2 flex-wrap">
            {brands.map((brand) => {
              const isActive = activeBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
                    isActive
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "bg-white border border-neutral-200/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                  )}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 focus:border-neutral-950 focus:outline-none cursor-pointer shadow-2xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4:5 Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center rounded-2xl border border-neutral-200/80 bg-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-neutral-950">No cases found</p>
            <p className="mt-1 text-xs text-neutral-500">Try selecting a different brand category</p>
            <button
              onClick={() => setActiveBrand("All")}
              className="mt-5 rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
