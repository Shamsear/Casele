"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
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
import { Price } from "@/components/ui/price";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { StickyAddToCart } from "@/components/products/sticky-add-to-cart";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { getWhatsAppNumber } from "@/lib/settings";
import type { ProductWithRelations } from "@/lib/db/products";

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
    toast(`${product.name} added to bag`);
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <Breadcrumbs
          items={[
            { label: "Collection", href: "/shop" },
            { label: selectedModel.name, href: `/shop/${modelSlug}` },
            { label: product.name, href: `/shop/${modelSlug}/${productSlug}` },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              alt={`${product.name} — ${selectedModel.name}`}
              badge={product.badge}
              discount={discount}
            />
          </div>

          {/* Right: Product Purchase Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-[11px] font-semibold text-gold tracking-widest uppercase mb-2">
                {selectedModel.name}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl text-white font-normal leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-4">
                <Price price={product.price} comparePrice={product.comparePrice} size="lg" showBadge={false} />
                {discount > 0 && (
                  <span className="text-xs font-semibold text-[#B91C1C] uppercase tracking-wider">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Model Selection */}
            {product.models.length > 1 && (
              <div className="space-y-3 pt-6 border-t border-dark-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-white">
                  Device Compatibility
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                        selectedModel.id === model.id
                          ? "bg-white text-black border border-white"
                          : "border border-dark-border bg-black/40 text-warm-gray hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3 pt-6 border-t border-dark-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-white">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-dark-border bg-black">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 text-warm-gray hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="h-10 w-10 text-warm-gray hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-warm-gray">
                  {formatPrice(parseFloat(product.price) * quantity)} total
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-6 border-t border-dark-border">
              <button
                onClick={handleBuyNow}
                className="w-full bg-white py-4 text-xs font-semibold uppercase tracking-widest text-black hover:bg-gold transition-colors"
              >
                Order via WhatsApp
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full border border-white/20 py-4 text-xs font-semibold uppercase tracking-widest text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                Add to Bag
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-2 text-[11px] font-medium uppercase tracking-widest text-warm-gray hover:text-white transition-colors text-center"
              >
                {isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            {/* Editorial Specifications Accordion / Features */}
            <div className="pt-6 border-t border-dark-border space-y-6">
              <div>
                <p className="text-[11px] font-semibold text-white uppercase tracking-widest mb-2">Description</p>
                <p className="text-xs leading-relaxed text-warm-gray">
                  {product.description || "Precision engineered phone case featuring impact-absorbing composite construction, responsive tactile buttons, and raised bezel protection for screen and camera lenses."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border/40 text-xs">
                <div>
                  <p className="font-semibold text-white">Same-Day Qatar Delivery</p>
                  <p className="text-warm-gray mt-0.5 text-[11px]">Doha, Al Wakrah, Al Khor</p>
                </div>
                <div>
                  <p className="font-semibold text-white">7-Day Guarantee</p>
                  <p className="text-warm-gray mt-0.5 text-[11px]">Hassle-free exchange policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-dark-border pt-16">
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-dark-border">
              <h2 className="font-display text-2xl sm:text-3xl text-white font-normal">
                Complementary Pieces
              </h2>
              <Link
                href="/shop"
                className="text-xs font-semibold uppercase tracking-widest text-warm-gray hover:text-gold transition-colors"
              >
                View Collection →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp, i) => (
                <ProductCard key={rp.id} product={rp} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

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
