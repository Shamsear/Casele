"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/ui/reveal";
import { ProductGallery } from "@/components/products/product-gallery";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema, DEFAULT_FAQS } from "@/components/seo/faq-schema";
import { ProductStructuredData } from "@/components/brand/structured-data";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useHaptic } from "@/hooks/use-haptic";
import { useToast } from "@/components/ui/toast";
import { getDiscountPercent } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { StickyAddToCart } from "@/components/products/sticky-add-to-cart";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { getWhatsAppNumber } from "@/lib/settings";
import type { ProductWithRelations } from "@/lib/db/products";
import { ShieldIcon, TruckIcon, ChatIcon, ReturnIcon, EyeIcon, CartIcon } from "@/components/ui/icons";

interface ProductDetailClientProps {
  product: ProductWithRelations;
  modelSlug: string;
  productSlug: string;
  relatedProducts: ProductWithRelations[];
}

export function ProductDetailClient({
  product,
  modelSlug,
  productSlug,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedModel, setSelectedModel] = useState(
    product.models.find((m) => m.slug === modelSlug) ?? product.models[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();
  const { toast } = useToast();
  const { formatPrice } = useI18n();

  const discount = getDiscountPercent(product.price, product.comparePrice);

  // Track recently viewed and fetch WhatsApp number
  useEffect(() => {
    addRecentlyViewed(product.id);
    getWhatsAppNumber().then(setWhatsappNumber);
  }, [product.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: parseFloat(product.price),
        comparePrice: product.comparePrice
          ? parseFloat(product.comparePrice)
          : undefined,
        modelId: selectedModel.slug,
        modelName: selectedModel.name,
      });
    }
    vibrate(10);
    toast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    const message = buildWhatsAppMessage({
      customerName: "Customer",
      customerPhone: "",
      items: [
        {
          name: product.name,
          model: selectedModel.name,
          qty: quantity,
          price: parseFloat(product.price),
        },
      ],
      subtotal: parseFloat(product.price) * quantity,
      tierDiscount: 0,
      flashDiscount: 0,
      bundleDiscount: 0,
      promoDiscount: 0,
      total: parseFloat(product.price) * quantity,
    });
    openWhatsApp(whatsappNumber, message);
  };

  return (
    <>
      <ProductStructuredData
        name={product.name}
        description={product.description || ""}
        price={product.price}
        images={product.images}
        url={`https://casele.qa/shop/${modelSlug}/${productSlug}`}
      />
      <FAQSchema faqs={DEFAULT_FAQS} />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: selectedModel.name, href: `/shop/${modelSlug}` },
            { label: product.name, href: `/shop/${modelSlug}/${productSlug}` },
          ]}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <Reveal>
            <ProductGallery
              images={product.images}
              alt={`${product.name} — ${selectedModel.name} phone case by CASELÉ in Qatar`}
              badge={product.badge}
              discount={discount}
            />
          </Reveal>

          {/* Details */}
          <Reveal delay={100}>
            <div className="flex flex-col">
              <p className="text-sm text-warm-gray">{selectedModel.name}</p>
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
              {product.models.length > 1 && (
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
              )}

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
                <span className="flex items-center gap-1.5"><ShieldIcon size={14} /> Premium Protection</span>
                <span className="flex items-center gap-1.5"><TruckIcon size={14} /> Fast Delivery</span>
                <span className="flex items-center gap-1.5"><ChatIcon size={14} /> WhatsApp Orders</span>
                <span className="flex items-center gap-1.5"><ReturnIcon size={14} /> 7-Day Returns</span>
              </div>

              {/* Social proof */}
              <div className="mt-4 flex items-center gap-4 text-xs text-warm-gray">
                <span className="flex items-center gap-1.5"><EyeIcon size={14} /> {product.viewCount} viewed</span>
                <span className="flex items-center gap-1.5"><CartIcon size={14} /> {product.orderCount} sold</span>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button
                    variant="cta"
                    size="lg"
                    className="flex-1"
                    onClick={handleBuyNow}
                  >
                    Buy Now — {formatPrice(parseFloat(product.price) * quantity)}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-dark-border/50 pt-12">
            <h2 className="font-display text-3xl font-bold text-white">
              You May Also Like
            </h2>
            <p className="mt-2 text-warm-gray">Similar cases you might love</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Cart */}
      <StickyAddToCart
        productId={product.id}
        name={product.name}
        image={product.images[0]}
        price={product.price}
        comparePrice={product.comparePrice}
        modelId={selectedModel.slug}
        modelName={selectedModel.name}
        quantity={quantity}
      />
    </>
  );
}
