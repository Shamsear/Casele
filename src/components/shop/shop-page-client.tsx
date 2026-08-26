"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import type { ProductWithRelations, ModelWithCount } from "@/lib/db/products";
import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Grid3X3,
  SlidersHorizontal,
  X,
  RotateCcw
} from "lucide-react";

interface ShopPageClientProps {
  products: ProductWithRelations[];
  models: ModelWithCount[];
  brands: string[];
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestselling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export function ShopPageClient({ products, models, brands }: ShopPageClientProps) {
  const { locale } = useI18n();
  const currencySymbol = locale === "ar" ? "ر.ق" : "QR";

  // Filter States
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<string>("All");
  const [sort, setSort] = useState<string>("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Accordion Open States
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(true);

  // Highest price in catalog
  const highestPrice = useMemo(() => {
    if (products.length === 0) return 149;
    return Math.max(...products.map((p) => parseFloat(p.price) || 0));
  }, [products]);

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Availability Filter
    if (inStockOnly && !outOfStockOnly) {
      list = list.filter((p) => p.inStock !== false && (p.stock === undefined || p.stock > 0));
    } else if (outOfStockOnly && !inStockOnly) {
      list = list.filter((p) => p.inStock === false || (p.stock !== undefined && p.stock <= 0));
    }

    // Price Filter
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    list = list.filter((p) => {
      const price = parseFloat(p.price);
      return price >= min && price <= max;
    });

    // Brand Filter
    if (selectedBrand !== "All") {
      list = list.filter((p) =>
        p.models?.some((m) => m.brand?.toLowerCase() === selectedBrand.toLowerCase())
      );
    }

    // Phone Model Filter
    if (selectedModel !== "All") {
      list = list.filter(
        (p) =>
          p.modelSlug === selectedModel ||
          p.models?.some((m) => m.slug === selectedModel)
      );
    }

    // Sorting
    switch (sort) {
      case "price-low":
        list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "bestselling":
        list.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, inStockOnly, outOfStockOnly, minPrice, maxPrice, selectedBrand, selectedModel, sort]);

  const hasActiveFilters =
    inStockOnly ||
    outOfStockOnly ||
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedBrand !== "All" ||
    selectedModel !== "All";

  const handleResetFilters = () => {
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrand("All");
    setSelectedModel("All");
    setSort("featured");
  };

  const formatPriceQar = (num: number) => {
    return `QAR ${num.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20">
        {/* ═══ Header Title ═══ */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-neutral-900 tracking-tight">
            All Cases
          </h1>
        </div>

        {/* ═══ Mobile Filter Trigger Bar ═══ */}
        <div className="lg:hidden flex items-center justify-between py-3 px-4 mb-6 rounded-2xl border border-neutral-200 bg-neutral-50/70">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters {hasActiveFilters && "• Active"}</span>
          </button>
          <span className="text-xs text-neutral-500 font-medium">
            {filteredProducts.length} items
          </span>
        </div>

        {/* ═══ Main 2-Column Layout (Filters Left, Grid Right) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ════════════ Left Sidebar: FILTERS (3 Cols) ════════════ */}
          <aside
            className={cn(
              "lg:col-span-3 space-y-6",
              "fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:static lg:p-0 lg:z-auto lg:bg-transparent lg:overflow-visible",
              mobileFiltersOpen ? "block animate-fade-in" : "hidden lg:block"
            )}
          >
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 lg:hidden">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Desktop Filters Title */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800">
                FILTERS
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Accordion 1: Availability */}
            <div className="border-b border-neutral-100 pb-5">
              <button
                onClick={() => setAvailabilityOpen(!availabilityOpen)}
                className="flex w-full items-center justify-between py-2 text-xs sm:text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                <span>Availability</span>
                {availabilityOpen ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500 stroke-[1.8]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500 stroke-[1.8]" />
                )}
              </button>

              {availabilityOpen && (
                <div className="pt-3 space-y-2.5 animate-fade-in">
                  <label className="flex items-center gap-3 text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        if (e.target.checked) setOutOfStockOnly(false);
                      }}
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 cursor-pointer"
                    />
                    <span>In stock</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={outOfStockOnly}
                      onChange={(e) => {
                        setOutOfStockOnly(e.target.checked);
                        if (e.target.checked) setInStockOnly(false);
                      }}
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 cursor-pointer"
                    />
                    <span>Out of stock</span>
                  </label>
                </div>
              )}
            </div>

            {/* Accordion 2: Price */}
            <div className="border-b border-neutral-100 pb-5">
              <button
                onClick={() => setPriceOpen(!priceOpen)}
                className="flex w-full items-center justify-between py-2 text-xs sm:text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                <span>Price</span>
                {priceOpen ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500 stroke-[1.8]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500 stroke-[1.8]" />
                )}
              </button>

              {priceOpen && (
                <div className="pt-3 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    {/* Min Price Box */}
                    <div className="flex-1 flex items-center rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 shadow-2xs focus-within:border-neutral-950">
                      <span className="text-xs text-neutral-400 font-medium mr-1.5 select-none">{currencySymbol}</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
                      />
                    </div>

                    <span className="text-xs text-neutral-400 font-medium">to</span>

                    {/* Max Price Box */}
                    <div className="flex-1 flex items-center rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 shadow-2xs focus-within:border-neutral-950">
                      <span className="text-xs text-neutral-400 font-medium mr-1.5 select-none">{currencySymbol}</span>
                      <input
                        type="number"
                        placeholder={highestPrice.toString()}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 font-normal">
                    The highest price is {formatPriceQar(highestPrice)}
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 3: Phone Models & Brands */}
            <div className="border-b border-neutral-100 pb-5">
              <button
                onClick={() => setModelOpen(!modelOpen)}
                className="flex w-full items-center justify-between py-2 text-xs sm:text-sm font-normal text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                <span>Device Compatibility</span>
                {modelOpen ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500 stroke-[1.8]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500 stroke-[1.8]" />
                )}
              </button>

              {modelOpen && (
                <div className="pt-3 space-y-2 max-h-48 overflow-y-auto pr-1 animate-fade-in">
                  <button
                    onClick={() => setSelectedModel("All")}
                    className={cn(
                      "flex w-full items-center justify-between text-left text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer",
                      selectedModel === "All"
                        ? "bg-neutral-950 text-white font-semibold"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    <span>All Devices</span>
                    <span className="text-[10px] opacity-70">{products.length}</span>
                  </button>

                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.slug)}
                      className={cn(
                        "flex w-full items-center justify-between text-left text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer",
                        selectedModel === m.slug
                          ? "bg-neutral-950 text-white font-semibold"
                          : "text-neutral-600 hover:bg-neutral-100"
                      )}
                    >
                      <span className="truncate">{m.name}</span>
                      <span className="text-[10px] opacity-70 shrink-0 ml-2">{m.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Apply Button */}
            <div className="pt-4 lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </aside>

          {/* ════════════ Right Main Content: Grid & Toolbar (9 Cols) ════════════ */}
          <main className="lg:col-span-9 space-y-6">
            {/* Toolbar Header (Right-Aligned Items count, Sort, and Grid Switcher) */}
            <div className="flex items-center justify-end gap-5 pb-4 border-b border-neutral-100">
              {/* Items count */}
              <span className="text-xs text-neutral-500 font-normal">
                {filteredProducts.length} items
              </span>

              {/* Sort dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-800 font-normal">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-xs text-neutral-800 font-normal focus:outline-none cursor-pointer border-0 pr-2"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid Layout Switcher Icons (Desktop) */}
              <div className="hidden sm:flex items-center gap-1 border-l border-neutral-200 pl-3">
                <button
                  onClick={() => setGridCols(3)}
                  aria-label="3 columns grid"
                  className={cn(
                    "p-1 rounded-md transition-colors cursor-pointer",
                    gridCols === 3 ? "text-neutral-950 bg-neutral-100" : "text-neutral-400 hover:text-neutral-700"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  aria-label="4 columns grid"
                  className={cn(
                    "p-1 rounded-md transition-colors cursor-pointer",
                    gridCols === 4 ? "text-neutral-950 bg-neutral-100" : "text-neutral-400 hover:text-neutral-700"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-dashed border-neutral-200 p-8 space-y-3">
                <p className="text-sm font-semibold text-neutral-900">No matching cases found</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing some filter criteria or adjusting your price parameters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer mt-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-5 sm:gap-6",
                  gridCols === 3
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                )}
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
