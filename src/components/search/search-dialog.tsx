"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store/search";
import { PRODUCTS, MODELS } from "@/lib/data";
import { Price } from "@/components/ui/price";
import { Search, Smartphone, X, ArrowRight, Sparkles } from "lucide-react";

export function SearchDialog() {
  const { isOpen, query, setOpen, setQuery } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [liveProducts, setLiveProducts] = useState(PRODUCTS);
  const [liveModels, setLiveModels] = useState(MODELS);

  // Fetch live products & models on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLiveProducts(data);
      })
      .catch(() => {});

    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLiveModels(data);
      })
      .catch(() => {});
  }, []);

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

  // Autofocus input when dialog opens
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

  const filteredProducts =
    query.trim().length > 0
      ? liveProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.modelName?.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
      : [];

  const filteredModels =
    query.trim().length > 0
      ? liveModels.filter(
          (m) =>
            m.name?.toLowerCase().includes(query.toLowerCase()) ||
            m.brand?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 4)
      : [];

  const hasResults = filteredProducts.length > 0 || filteredModels.length > 0;

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Search Modal Content */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-2xl z-10 animate-scale-in">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-neutral-200/80 px-4 sm:px-5 py-3.5 sm:py-4">
          <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cases, flagships, or styles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-950 placeholder:text-neutral-400 focus:outline-none font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold text-neutral-400 font-mono">
              ESC
            </kbd>
          )}
          <button
            onClick={() => setOpen(false)}
            className="sm:hidden text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 px-2 py-1 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto p-4 sm:p-5">
          {query.trim().length === 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#A88B4D]" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Trending Collections & Flagships
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "iPhone 15 Pro",
                  "Samsung S24 Ultra",
                  "Luxe Leather",
                  "Carbon Armor",
                  "Matte Velvet",
                  "Crystal Clear",
                  "Titanium Gray",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-3.5 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-900">
                No cases found matching &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Try searching by model (e.g. iPhone 15, S24) or finish type (Matte, Glossy).
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Compatible Device Models */}
              {filteredModels.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2.5">
                    Compatible Flagships
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleSelect(`/shop/${model.slug}`)}
                        className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-3 text-left transition-all hover:border-neutral-950 hover:bg-white hover:shadow-xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/80 text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                            <Smartphone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-950">{model.name}</p>
                            <p className="text-[10px] text-neutral-500">{model.count} Styles Available</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Case Products */}
              {filteredProducts.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2.5">
                    Protective Cases ({filteredProducts.length})
                  </span>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(`/shop/${product.modelSlug}/${product.slug}`)}
                        className="flex w-full items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-3 text-left transition-all hover:border-neutral-950 hover:shadow-xs group cursor-pointer"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-1.5 transition-transform group-hover:scale-105"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-neutral-950 truncate group-hover:text-[#A88B4D] transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-neutral-500">{product.modelName}</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">In Stock</span>
                          </div>
                        </div>
                        <Price price={product.price} size="sm" showBadge={false} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Search Page Shortcut */}
        {query.trim().length > 0 && (
          <div className="border-t border-neutral-200/80 bg-neutral-50 px-4 py-3 text-center sm:text-right">
            <button
              onClick={() => handleSelect(`/search?q=${encodeURIComponent(query)}`)}
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-[#A88B4D] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View all results for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
