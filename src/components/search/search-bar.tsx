"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, MODELS } from "@/lib/data";
import { Price } from "@/components/ui/price";
import { Search, Smartphone, X, ArrowRight, Sparkles } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cmd/Ctrl + K shortcut to focus inline input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      } else if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for custom open-search event from mobile header/nav
  useEffect(() => {
    const handleOpenSearch = () => {
      inputRef.current?.focus();
      setFocused(true);
    };
    document.addEventListener("open-search", handleOpenSearch);
    return () => document.removeEventListener("open-search", handleOpenSearch);
  }, []);

  const filteredProducts =
    query.trim().length > 0
      ? PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.modelName.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      : [];

  const filteredModels =
    query.trim().length > 0
      ? MODELS.filter(
          (m) =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.brand.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3)
      : [];

  const hasResults = filteredProducts.length > 0 || filteredModels.length > 0;
  const showDropdown = focused;

  return (
    <div ref={wrapperRef} className="relative">
      {/* ═══ Inline Search Bar (Frosted Glass Pill) ═══ */}
      <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-xs transition-all duration-200 focus-within:border-neutral-900 focus-within:bg-white shadow-2xs">
        <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cases & models..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          style={{ outline: "none", boxShadow: "none" }}
          className="w-32 sm:w-44 focus:w-60 transition-all duration-200 bg-transparent text-neutral-900 placeholder:text-neutral-400 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 p-0 text-xs font-medium"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-0.5 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-neutral-400 font-mono shadow-2xs">
            ⌘K
          </kbd>
        )}
      </div>

      {/* ═══ Attached Results Dropdown Directly Underneath Search Bar ═══ */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/70 bg-white/92 backdrop-blur-2xl shadow-2xl shadow-neutral-900/10 overflow-hidden z-50 animate-scale-in">
          {query.trim().length === 0 ? (
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-[#A88B4D]" />
                <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">
                  Trending Searches
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["iPhone 15 Pro", "Samsung S24 Ultra", "Carbon Fiber", "Gold Edge", "Forest Green", "Crystal Clear"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 transition-all hover:border-neutral-950 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center">
              <p className="text-xs font-medium text-neutral-600">
                No cases found for &ldquo;<span className="text-neutral-950 font-semibold">{query}</span>&rdquo;
              </p>
              <p className="mt-1 text-[11px] text-neutral-400">
                Try searching by model (e.g., iPhone 15, S24) or style
              </p>
            </div>
          ) : (
            <div className="max-h-84 overflow-y-auto p-2 divide-y divide-neutral-100">
              {/* Phone Models */}
              {filteredModels.length > 0 && (
                <div className="pb-2">
                  <p className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Compatible Models
                  </p>
                  {filteredModels.map((model) => (
                    <Link
                      key={model.id}
                      href={`/shop/${model.slug}`}
                      onClick={() => {
                        setFocused(false);
                        setQuery("");
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-neutral-50 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-950">
                            {model.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {model.count} styles available
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Products */}
              {filteredProducts.length > 0 && (
                <div className="pt-2">
                  <p className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Matching Products
                  </p>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.modelSlug}/${product.slug}`}
                      onClick={() => {
                        setFocused(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-neutral-50 group"
                    >
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200/60">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-1 transition-transform group-hover:scale-105"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-neutral-950">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {product.modelName}
                        </p>
                      </div>
                      <Price price={product.price} size="sm" showBadge={false} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
