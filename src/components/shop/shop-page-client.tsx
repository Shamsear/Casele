"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
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

  let filtered =
    activeBrand === "All"
      ? [...products]
      : products.filter((p) =>
          p.models.some((m) => m.brand === activeBrand)
        );

  switch (sort) {
    case "price-low":
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-high":
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "popular":
      filtered.sort((a, b) => b.orderCount - a.orderCount);
      break;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white">Shop All Cases</h1>
      <p className="mt-2 text-warm-gray">
        {filtered.length} cases available — find the perfect case for your phone
      </p>

      <div className="mb-6 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeBrand === brand
                  ? "bg-gold text-black"
                  : "bg-dark-surface text-warm-gray hover:text-white"
              )}
            >
              {brand}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-lg border border-dark-border bg-dark-surface px-3 text-sm text-white focus:border-gold focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-warm-gray">No cases found. Try a different filter.</p>
        </div>
      )}
    </div>
  );
}
