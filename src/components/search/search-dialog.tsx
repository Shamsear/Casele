"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store/search";
import { PRODUCTS } from "@/lib/data";
import { getRecentlyViewed, clearRecentlyViewed } from "@/lib/recently-viewed";
import { Search, X } from "lucide-react";

export function SearchDialog() {
  const { isOpen, query, setOpen, setQuery } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [liveProducts, setLiveProducts] = useState(PRODUCTS);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Fetch live products on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLiveProducts(data);
      })
      .catch(() => {});
  }, []);

  // Load recently viewed items when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecentIds(getRecentlyViewed());
    }
  }, [isOpen]);

  // Keyboard shortcut Cmd/Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  // Autofocus input when dialog opens & lock body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  const handleClearRecent = () => {
    clearRecentlyViewed();
    setRecentIds([]);
  };

  // Filter products by query
  const trimmedQuery = query.trim().toLowerCase();
  const filteredProducts =
    trimmedQuery.length > 0
      ? liveProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.modelName?.toLowerCase().includes(trimmedQuery) ||
            p.description?.toLowerCase().includes(trimmedQuery) ||
            p.categoryName?.toLowerCase().includes(trimmedQuery)
        )
      : [];

  // Get recently viewed products (or default top 2 if empty)
  const resolvedRecentProducts = recentIds
    .map((id) => liveProducts.find((p) => p.id === id || p.slug === id))
    .filter((p): p is (typeof liveProducts)[0] => Boolean(p))
    .slice(0, 4);

  // If no recently viewed in localStorage yet, fallback to top 2 popular products
  const displayRecentProducts =
    resolvedRecentProducts.length > 0 ? resolvedRecentProducts : liveProducts.slice(0, 2);

  // Main products grid
  const allDisplayProducts = liveProducts.slice(0, 8);

  const formatQar = (price: string | number) => {
    const num = typeof price === "number" ? price : parseFloat(price);
    return `QAR ${isNaN(num) ? price : num.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-3 sm:pt-16 px-3 sm:px-6">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Search Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)] z-10 animate-scale-in flex flex-col max-h-[85vh]">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-5 sm:px-6 py-3.5 sm:py-4">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 shrink-0 stroke-[2.2]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-500 focus:outline-none font-normal"
          />
          <button
            onClick={() => {
              if (query) {
                setQuery("");
                inputRef.current?.focus();
              } else {
                setOpen(false);
              }
            }}
            className="text-neutral-700 hover:text-neutral-950 p-1 transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
          </button>
        </div>

        {/* Search Body Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 sm:space-y-7">
          {trimmedQuery.length > 0 ? (
            /* ═══ Active Search Results ═══ */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-normal text-neutral-600">
                  Products ({filteredProducts.length})
                </h3>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm font-medium text-neutral-900">
                    No cases found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-neutral-400">
                    Try searching by model (e.g. iPhone 15, S24) or collection
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(`/shop/${product.modelSlug || "iphone-15-pro"}/${product.slug}`)}
                      className="group flex flex-col text-left transition-all hover:opacity-85 cursor-pointer"
                    >
                      {/* Portrait Image Canvas */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-50 p-2 sm:p-3 flex items-center justify-center">
                        <Image
                          src={product.images[0] || "/images/products/midnight-black.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>

                      {/* Product Title & Pricing */}
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs sm:text-sm font-normal text-neutral-800 leading-snug line-clamp-2">
                          {product.name} | Phone Case
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                          {formatQar(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ═══ Default View: Recently Viewed + Products ═══ */
            <>
              {/* Section 1: Recently Viewed */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs sm:text-sm font-normal text-neutral-600">
                    Recently viewed
                  </h3>
                  {displayRecentProducts.length > 0 && (
                    <button
                      onClick={handleClearRecent}
                      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                  {displayRecentProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(`/shop/${product.modelSlug || "iphone-15-pro"}/${product.slug}`)}
                      className="group flex flex-col text-left transition-all hover:opacity-85 cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-50 p-2 sm:p-3 flex items-center justify-center">
                        <Image
                          src={product.images[0] || "/images/products/midnight-black.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs sm:text-sm font-normal text-neutral-800 leading-snug line-clamp-2">
                          {product.name} | Phone Case
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                          {formatQar(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Products */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs sm:text-sm font-normal text-neutral-600">
                    Products
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                  {allDisplayProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(`/shop/${product.modelSlug || "iphone-15-pro"}/${product.slug}`)}
                      className="group flex flex-col text-left transition-all hover:opacity-85 cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-50 p-2 sm:p-3 flex items-center justify-center">
                        <Image
                          src={product.images[0] || "/images/products/midnight-black.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs sm:text-sm font-normal text-neutral-800 leading-snug line-clamp-2">
                          {product.name} | Phone Case
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                          {formatQar(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
