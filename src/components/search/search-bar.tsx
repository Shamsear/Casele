"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, MODELS } from "@/lib/data";
import { PhoneIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";

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

  // Cmd/Ctrl + K shortcut to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
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
    query.length > 0
      ? PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.modelName.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      : [];

  const filteredModels =
    query.length > 0
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
      {/* Inline Input */}
      <div className="flex items-center gap-2 rounded-xl border border-dark-border/60 bg-dark-surface/60 px-3 py-1.5 text-sm transition-all duration-300 focus-within:border-gold/50 focus-within:bg-dark-surface focus-within:shadow-lg focus-within:shadow-gold/5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-4 h-4 shrink-0 text-warm-gray/70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cases..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-24 bg-transparent text-white placeholder:text-warm-gray/40 focus:outline-none sm:w-36 transition-all duration-300 focus:w-44"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-warm-gray/50 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-dark-border bg-black/60 px-1.5 py-0.5 text-[10px] text-warm-gray/50 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-dark-border/60 bg-dark-surface/95 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden z-50 animate-scale-in">
          {query.length === 0 ? (
            <div className="p-5">
              <p className="mb-3 text-[10px] font-semibold text-gold/80 uppercase tracking-wider">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["iPhone 15 Pro", "Samsung S24", "Leather Case", "Clear Case", "Midnight Black"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="rounded-xl border border-dark-border/60 bg-black/40 px-3 py-1.5 text-xs text-warm-gray transition-all hover:border-gold/40 hover:text-white hover:bg-gold/5"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : !hasResults ? (
            <p className="p-8 text-center text-sm text-warm-gray">
              No results found for &ldquo;<span className="text-white font-medium">{query}</span>&rdquo;
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto p-2">
              {/* Models */}
              {filteredModels.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-gold/80 uppercase tracking-wider">
                    Phone Models
                  </p>
                  {filteredModels.map((model) => (
                    <Link
                      key={model.id}
                      href={`/shop/${model.slug}`}
                      onClick={() => {
                        setFocused(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-black/50"
                    >
                      <span className="text-gold">
                        <PhoneIcon size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {model.name}
                        </p>
                        <p className="text-[11px] text-warm-gray">
                          {model.count} cases available
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Products */}
              {filteredProducts.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-gold/80 uppercase tracking-wider">
                    Products
                  </p>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.modelSlug}/${product.slug}`}
                      onClick={() => {
                        setFocused(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-black/50 group"
                    >
                      <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-black">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-1 transition-transform group-hover:scale-105"
                          sizes="44px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-gold transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-warm-gray/70 truncate">
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
