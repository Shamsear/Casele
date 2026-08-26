"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import type { ProductWithRelations } from "@/lib/db/products";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Grid3X3,
  SlidersHorizontal,
  X,
  RotateCcw
} from "lucide-react";

interface ModelPageClientProps {
  products: ProductWithRelations[];
  displayName: string;
  modelSlug: string;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestselling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const ITEMS_PER_PAGE = 12;

export function ModelPageClient({ products, displayName }: ModelPageClientProps) {
  const { locale } = useI18n();
  const currencySymbol = locale === "ar" ? "ر.ق" : "QR";

  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [inStockOnly, outOfStockOnly, minPrice, maxPrice, sort]);

  const highestPrice = useMemo(() => {
    if (products.length === 0) return 149;
    return Math.max(...products.map((p) => parseFloat(p.price) || 0));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (inStockOnly && !outOfStockOnly) {
      list = list.filter((p) => p.inStock !== false && (p.stock === undefined || p.stock > 0));
    } else if (outOfStockOnly && !inStockOnly) {
      list = list.filter((p) => p.inStock === false || (p.stock !== undefined && p.stock <= 0));
    }

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    list = list.filter((p) => {
      const price = parseFloat(p.price);
      return price >= min && price <= max;
    });

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
  }, [products, inStockOnly, outOfStockOnly, minPrice, maxPrice, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const hasActiveFilters = inStockOnly || outOfStockOnly || minPrice !== "" || maxPrice !== "";

  const handleResetFilters = () => {
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const formatPriceQar = (num: number) => {
    return `QAR ${num.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Cases</span>
        </Link>

        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-neutral-900 tracking-tight">
            {displayName} Cases
          </h1>
        </div>

        {/* Mobile Filter Bar */}
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

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sidebar */}
          <aside
            className={cn(
              "lg:col-span-3 space-y-6",
              "fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:static lg:p-0 lg:z-auto lg:bg-transparent lg:overflow-visible",
              mobileFiltersOpen ? "block animate-fade-in" : "hidden lg:block"
            )}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 lg:hidden">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-950">
                <X className="h-5 w-5" />
              </button>
            </div>

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

            {/* Availability */}
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

            {/* Price */}
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

            <div className="pt-4 lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </aside>

          {/* Right Main Grid */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-end gap-5 pb-4 border-b border-neutral-100">
              <span className="text-xs text-neutral-500 font-normal">
                {filteredProducts.length} items
              </span>

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

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-dashed border-neutral-200 p-8 space-y-3">
                <p className="text-sm font-semibold text-neutral-900">No cases found matching filters</p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer mt-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "grid gap-5 sm:gap-6",
                    gridCols === 3
                      ? "grid-cols-2 sm:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  )}
                >
                  {paginatedProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* ═══ Pagination Controls ═══ */}
                {totalPages > 1 && (
                  <div className="pt-10 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400 font-normal">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} cases
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-100 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "flex h-9 min-w-[36px] px-2.5 items-center justify-center rounded-xl text-xs font-semibold transition-all cursor-pointer",
                            pageNum === currentPage
                              ? "bg-neutral-950 text-white shadow-xs"
                              : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 shadow-2xs"
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-100 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
