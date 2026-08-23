"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Price } from "@/components/ui/price";
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
  const [showFullDesc, setShowFullDesc] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();
  const { toast } = useToast();
  const { formatPrice, t } = useI18n();

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

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: selectedModel.name, href: `/shop/${modelSlug}` },
            { label: product.name, href: `/shop/${modelSlug}/${productSlug}` },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Left: Image Gallery */}
          <Reveal>
            <div className="sticky top-20">
              <ProductGallery
                images={product.images}
                alt={`${product.name} — ${selectedModel.name} phone case by CASELE`}
                badge={product.badge}
                discount={discount}
              />
            </div>
          </Reveal>

          {/* Right: Product Info */}
          <Reveal delay={100}>
            <div className="flex flex-col">
              {/* Model & Badge */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gold/80 uppercase tracking-wider">
                  {selectedModel.name}
                </span>
                {product.badge && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      product.badge === "new"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : product.badge === "bestseller"
                        ? "bg-gold/10 text-gold"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {product.badge === "new" ? "New" : product.badge === "bestseller" ? "Bestseller" : "Sale"}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-center gap-4">
                <Price price={product.price} comparePrice={product.comparePrice} size="lg" showBadge={false} />
                {discount > 0 && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="mt-6 border-t border-dark-border/50" />

              {/* Model Selector */}
              {product.models.length > 1 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-white">
                    Model <span className="text-warm-gray font-normal">— {selectedModel.name}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                          selectedModel.id === model.id
                            ? "border-gold bg-gold/10 text-gold shadow-sm shadow-gold/10"
                            : "border-dark-border bg-dark-surface text-warm-gray hover:border-warm-gray/40 hover:text-white"
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
                <p className="text-sm font-medium text-white">Quantity</p>
                <div className="mt-3 flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-dark-border bg-dark-surface text-lg text-white transition-colors hover:border-gold/30"
                  >
                    -
                  </button>
                  <div className="flex h-10 w-12 items-center justify-center border-y border-dark-border bg-black text-sm font-medium text-white">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-dark-border bg-dark-surface text-lg text-white transition-colors hover:border-gold/30"
                  >
                    +
                  </button>
                  <span className="ml-3 text-sm text-warm-gray">
                    {formatPrice(parseFloat(product.price) * quantity)} total
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="text-sm font-medium text-white mb-2">About this case</p>
                <p className={`text-sm leading-relaxed text-warm-gray ${!showFullDesc ? "line-clamp-3" : ""}`}>
                  {product.description}
                </p>
                {product.description && product.description.length > 120 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="mt-1 text-xs text-gold hover:text-gold-light transition-colors"
                  >
                    {showFullDesc ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button
                    variant="cta"
                    size="lg"
                    className="flex-1"
                    onClick={handleBuyNow}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Buy Now on WhatsApp
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <CartIcon size={18} />
                  </Button>
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all ${
                    isWishlisted
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-dark-border bg-dark-surface text-warm-gray hover:border-warm-gray/40 hover:text-white"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 rounded-xl border border-dark-border/50 bg-dark-surface/30 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                      <ShieldIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Premium Protection</p>
                      <p className="text-[10px] text-warm-gray">Military-grade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                      <TruckIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Fast Delivery</p>
                      <p className="text-[10px] text-warm-gray">Same day in Qatar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                      <ChatIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">WhatsApp Orders</p>
                      <p className="text-[10px] text-warm-gray">Quick & easy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                      <ReturnIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">7-Day Returns</p>
                      <p className="text-[10px] text-warm-gray">Hassle free</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-warm-gray">
                <span className="flex items-center gap-1.5">
                  <EyeIcon size={14} />
                  {product.viewCount} people viewed
                </span>
                <span className="h-3 w-px bg-dark-border" />
                <span className="flex items-center gap-1.5">
                  <CartIcon size={14} />
                  {product.orderCount} sold
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-dark-border/50 pt-12">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              You May Also Like
            </h2>
            <p className="mt-2 text-sm text-warm-gray">Similar cases you might love</p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
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
