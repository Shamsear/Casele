"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/brand/logo";
import { CartBubble } from "@/components/cart/cart-bubble";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { PRODUCTS, MODELS } from "@/lib/data";
import { Price } from "@/components/ui/price";
import { Search, X, Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { SITE } from "@/lib/seo";

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    document.addEventListener("open-search", handleOpen);
    return () => document.removeEventListener("open-search", handleOpen);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSearchOpen]);

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

  return (
    <header ref={headerRef} className="sticky top-0 z-40 md:hidden border-b border-neutral-200/70 bg-white/95 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4 gap-2">
        {!isSearchOpen ? (
          <>
            {/* Logo */}
            <Logo size="sm" />

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CASELÉ Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                aria-label="Search cases"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-600 hover:text-neutral-950 transition-colors shadow-2xs cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
              <LanguageToggle />
              <CartBubble />
            </div>
          </>
        ) : (
          /* Inline Search Input Mode directly in Mobile Header */
          <div className="flex-1 flex items-center gap-2 animate-scale-in">
            <div className="flex-1 flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100/80 px-3 py-1.5 shadow-2xs">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search cases & models..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ outline: "none", boxShadow: "none" }}
                className="flex-1 bg-transparent text-neutral-950 placeholder:text-neutral-400 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 p-0 text-xs font-medium"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-neutral-400 p-0.5" aria-label="Clear search">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setQuery("");
              }}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Mobile Results Attached Directly Underneath Header */}
      {isSearchOpen && (
        <div className="border-t border-neutral-200/80 bg-white shadow-xl max-h-[75vh] overflow-y-auto p-4 animate-scale-in">
          {query.trim().length === 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
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
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center">
              <p className="text-xs font-medium text-neutral-600">
                No cases found for &ldquo;<span className="text-neutral-950 font-semibold">{query}</span>&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-neutral-100">
              {filteredModels.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Compatible Models
                  </p>
                  {filteredModels.map((model) => (
                    <Link
                      key={model.id}
                      href={`/shop/${model.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-neutral-600" />
                        <span className="text-xs font-semibold text-neutral-900">{model.name}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                    </Link>
                  ))}
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div className="pt-2 space-y-1">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Products
                  </p>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.modelSlug}/${product.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50"
                    >
                      <div className="relative h-10 w-10 flex-shrink-0 rounded-lg bg-neutral-100 border border-neutral-200/60 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-950 truncate">{product.name}</p>
                        <p className="text-[10px] text-neutral-400">{product.modelName}</p>
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
    </header>
  );
}
