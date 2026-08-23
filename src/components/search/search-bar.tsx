"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, MODELS } from "@/lib/data";
import { PhoneIcon } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/context";

export function SearchBar() {
  const { formatPrice } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter products and models based on query
  const filteredProducts = query.length > 0
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.modelName.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredModels = query.length > 0
    ? MODELS.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredProducts.length > 0 || filteredModels.length > 0;

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-surface px-3 py-2 text-sm text-warm-gray transition-colors hover:border-gold/30 hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-dark-border bg-black px-1.5 py-0.5 text-[10px] text-warm-gray/60">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center pt-[15vh] transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Search Box */}
        <div
          className={`relative w-full max-w-lg mx-4 transition-transform duration-200 ${
            isOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="rounded-2xl border border-dark-border bg-dark-surface shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-dark-border px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-warm-gray">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search cases, models, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-warm-gray/60 focus:outline-none"
              />
              <kbd
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded border border-dark-border bg-black px-2 py-1 text-xs text-warm-gray/60 hover:text-white"
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            {query.length > 0 && (
              <div className="max-h-96 overflow-y-auto p-2">
                {!hasResults && (
                  <p className="py-8 text-center text-sm text-warm-gray">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                )}

                {/* Models */}
                {filteredModels.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-2 text-xs font-medium text-warm-gray/60 uppercase">
                      Phone Models
                    </p>
                    {filteredModels.map((model) => (
                      <Link
                        key={model.id}
                        href={`/shop/${model.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-black/50"
                      >
                        <span className="text-lg text-warm-gray"><PhoneIcon size={20} /></span>
                        <div>
                          <p className="text-sm font-medium text-white">{model.name}</p>
                          <p className="text-xs text-warm-gray">{model.count} cases available</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Products */}
                {filteredProducts.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-medium text-warm-gray/60 uppercase">
                      Products
                    </p>
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.modelSlug}/${product.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-black/50"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-black">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{product.name}</p>
                          <p className="text-xs text-warm-gray">{product.modelName}</p>
                        </div>
                        <p className="text-sm font-bold text-gold">{formatPrice(product.price)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Links */}
            {query.length === 0 && (
              <div className="p-4">
                <p className="mb-2 text-xs font-medium text-warm-gray/60 uppercase">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["iPhone 15 Pro", "Samsung S24", "Leather Case", "Clear Case"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-dark-border bg-black px-3 py-1.5 text-xs text-warm-gray transition-colors hover:border-gold/30 hover:text-white"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
