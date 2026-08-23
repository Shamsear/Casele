"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { getProductsByCategory, CATEGORIES } from "@/lib/data";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      setLoading(false);
    });
  }, [params]);

  const products = getProductsByCategory(slug);
  const category = CATEGORIES.find((c) => c.slug === slug);
  const displayName = category?.name || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white">{displayName} Collection</h1>
      <p className="mt-2 text-warm-gray">{category?.description || "Browse our cases"}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
