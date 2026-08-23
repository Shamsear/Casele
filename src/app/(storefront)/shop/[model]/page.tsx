"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { getProductsByModel, MODELS } from "@/lib/data";

export default function ModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const [modelSlug, setModelSlug] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setModelSlug(p.model);
      setLoading(false);
    });
  }, [params]);

  const products = getProductsByModel(modelSlug);
  const model = MODELS.find((m) => m.slug === modelSlug);
  const displayName = model?.name || modelSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white">Cases for {displayName}</h1>
      <p className="mt-2 text-warm-gray">{products.length} compatible cases</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && !loading && (
        <div className="py-16 text-center">
          <p className="text-warm-gray">No cases found for this model yet.</p>
        </div>
      )}
    </div>
  );
}
