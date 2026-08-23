"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema, DEFAULT_FAQS } from "@/components/seo/faq-schema";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { PRODUCTS } from "@/lib/data";
import { ProductStructuredData } from "@/components/brand/structured-data";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ model: string; product: string }>;
}) {
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [selectedModel, setSelectedModel] = useState(PRODUCTS[0].models[0]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState({ model: "", product: "" });

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();
  const { toast } = useToast();

  useEffect(() => {
    params.then((p) => {
      setSlug(p);
      const found = PRODUCTS.find((pr) => pr.slug === p.product);
      if (found) {
        setProduct(found);
        setSelectedModel(found.models[0]);
      }
      setLoading(false);
    });
  }, [params]);

  const discount = getDiscountPercent(product.price, product.comparePrice);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: parseFloat(product.price),
        comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : undefined,
        modelId: selectedModel.slug,
        modelName: selectedModel.name,
      });
    }
    vibrate(10);
    toast(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="skeleton aspect-square rounded-xl" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductStructuredData
        name={product.name}
        description={product.description || ""}
        price={product.price}
        images={product.images}
        url={`https://casele.qa/shop/${slug.model}/${slug.product}`}
      />
      <FAQSchema faqs={DEFAULT_FAQS} />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.modelName, href: `/shop/${slug.model}` },
            { label: product.name, href: `/shop/${slug.model}/${slug.product}` },
          ]}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image */}
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
              <Image
                src={product.images[0]}
                alt={`${product.name} — ${product.modelName} phone case by CASELÉ in Qatar`}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <ProductBadge badge={product.badge} />
                {discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={100}>
            <div className="flex flex-col">
              <p className="text-sm text-warm-gray">{product.modelName}</p>
              <h1 className="mt-1 font-display text-h1 font-bold text-white">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-price font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-warm-gray line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-400">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Model selector */}
              <div className="mt-6">
                <p className="text-sm font-medium text-warm-gray">Select Model</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        selectedModel.id === model.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-dark-border bg-dark-surface text-warm-gray hover:border-gold/30"
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <p className="text-sm font-medium text-warm-gray">Quantity</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-border bg-dark-surface text-white transition-colors hover:border-gold/30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-border bg-dark-surface text-white transition-colors hover:border-gold/30"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-warm-gray">
                {product.description}
              </p>

              {/* Trust signals */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-warm-gray">
                <span className="flex items-center gap-1">🛡️ Premium Protection</span>
                <span className="flex items-center gap-1">🚚 Fast Delivery in Qatar</span>
                <span className="flex items-center gap-1">💬 WhatsApp Orders</span>
                <span className="flex items-center gap-1">↩️ 7-Day Returns</span>
              </div>

              {/* Social proof */}
              <div className="mt-4 flex items-center gap-4 text-xs text-warm-gray">
                <span>👀 {product.viewCount} people viewed this</span>
                <span>🛒 {product.orderCount} ordered today</span>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="cta"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart — {formatPrice(parseFloat(product.price) * quantity)}
                </Button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-colors ${
                    isWishlisted
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-dark-border bg-dark-surface text-warm-gray hover:text-white"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
