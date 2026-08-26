"use client";

import { useState, useEffect } from "react";
import { MODELS } from "@/lib/data";

interface ShopFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  brand: string;
  priceRange: string;
  sortBy: string;
  model: string;
}

const BRANDS = ["All", "iPhone", "Samsung", "Huawei", "OnePlus", "Google"];

const PRICE_RANGES = [
  { label: "All Prices", value: "" },
  { label: "Under QR 50", value: "0-50" },
  { label: "QR 50 - QR 100", value: "50-100" },
  { label: "QR 100 - QR 200", value: "100-200" },
  { label: "Over QR 200", value: "200+" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
];

export function ShopFilters({ onFilterChange }: ShopFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: "All",
    priceRange: "",
    sortBy: "featured",
    model: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [liveModels, setLiveModels] = useState(MODELS);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLiveModels(data);
      })
      .catch(() => {});
  }, []);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Get unique models for selected brand
  const availableModels = filters.brand === "All"
    ? liveModels
    : liveModels.filter((m) => m.brand === filters.brand);

  return (
    <div className="space-y-4">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-xl border border-dark-border bg-dark-surface px-4 py-3 text-sm text-white md:hidden"
      >
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filters & Sort
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Filters content */}
      <div className={`space-y-6 ${isExpanded ? "block" : "hidden md:block"}`}>
        {/* Brand Filter */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-white">Brand</h3>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => updateFilter("brand", brand)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filters.brand === brand
                    ? "border border-gold bg-gold/10 text-gold"
                    : "border border-dark-border bg-dark-surface text-warm-gray hover:border-gold/30"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Model Filter */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-white">Phone Model</h3>
          <select
            value={filters.model}
            onChange={(e) => updateFilter("model", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-surface px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
          >
            <option value="">All Models</option>
            {availableModels.map((model) => (
              <option key={model.id} value={model.slug}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-white">Price Range</h3>
          <div className="space-y-1">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => updateFilter("priceRange", range.value)}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                  filters.priceRange === range.value
                    ? "bg-gold/10 text-gold"
                    : "text-warm-gray hover:bg-black/50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-white">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-surface px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.brand !== "All" || filters.priceRange || filters.model) && (
          <button
            onClick={() => {
              const resetFilters: FilterState = {
                brand: "All",
                priceRange: "",
                sortBy: "featured",
                model: "",
              };
              setFilters(resetFilters);
              onFilterChange(resetFilters);
            }}
            className="w-full rounded-lg border border-dark-border py-2 text-sm text-warm-gray transition-colors hover:border-gold/30 hover:text-white"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
