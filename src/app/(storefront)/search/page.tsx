"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ProductCard } from "@/components/products/product-card";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { getAllProducts } from "@/lib/db/products";
import type { ProductWithRelations } from "@/lib/db/products";

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
    // Fetch products and filter client-side
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
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white">
        Search Results
      </h1>
      {query && (
        <p className="mt-2 text-warm-gray">
          {loading ? "Searching..." : `${results.length} results for`} &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-warm-gray">
              No cases found for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-2 text-sm text-warm-gray/60">
              Try browsing by model instead.
            </p>
            <a
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-black hover:bg-gold-light transition-colors"
            >
              Browse all cases
            </a>
          </div>
        )}

        {!loading && !query && (
          <div className="py-16 text-center">
            <p className="text-warm-gray">Enter a search term to find cases.</p>
          </div>
        )}
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
