"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { getAllProducts } from "@/lib/db/products";
import type { ProductWithRelations } from "@/lib/db/products";
import { Search, ArrowRight } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAllProducts().then((products) => {
      const q = query.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.modelName.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
      setResults(filtered);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-6 border-b border-neutral-200/70">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Search Archive</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-neutral-950">
            Search Results
          </h1>
          {query && (
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">
              {loading ? "Searching archive..." : `Displaying ${results.length} results for`} &ldquo;
              <span className="text-neutral-950 font-semibold">{query}</span>&rdquo;
            </p>
          )}
        </div>

        <div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-24 text-center rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
              <p className="text-sm font-semibold text-neutral-950">No cases matched &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs text-neutral-500">Try searching by model name, color, or material</p>
              <Link
                href="/shop"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <span>Browse All Cases</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {!loading && !query && (
            <div className="py-24 text-center rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
              <p className="text-sm font-semibold text-neutral-950">Enter a search keyword</p>
              <p className="mt-1 text-xs text-neutral-500">Find protective cases by device model, series, or color</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <ProductGridSkeleton />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
