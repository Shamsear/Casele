"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ProductCard } from "@/components/products/product-card";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Midnight Black Premium Case",
    slug: "midnight-black-premium-case",
    price: "799",
    comparePrice: "999",
    images: ["/placeholder-case.jpg"],
    badge: "bestseller",
    modelName: "iPhone 15 Pro",
    modelSlug: "iphone-15-pro",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white">
        Search Results
      </h1>
      {query && (
        <p className="mt-2 text-warm-gray">
          Results for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {SAMPLE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && SAMPLE_PRODUCTS.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-warm-gray">
              No cases found for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-2 text-sm text-warm-gray/60">
              Try browsing by model instead.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><ProductGridSkeleton /></div>}>
      <SearchContent />
    </Suspense>
  );
}
