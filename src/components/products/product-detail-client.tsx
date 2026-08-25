"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import {
  MessageSquare,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <ProductStructuredData
        name={product.name}
        description={product.description || ""}
        price={product.price}
        images={product.images}
        url={`https://casele.qa/shop/${modelSlug}/${productSlug}`}
      />
      <FAQSchema faqs={DEFAULT_FAQS} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <Breadcrumbs
          items={[
            { label: "Collection", href: "/shop" },
            { label: selectedModel.name, href: `/shop/${modelSlug}` },
            { label: product.name, href: `/shop/${modelSlug}/${productSlug}` },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Interactive Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              alt={`${product.name} — ${selectedModel.name}`}
              badge={product.badge}
              discount={discount}
            />
          </div>

          {/* Right: Product Purchase Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-7 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5 block">
                {selectedModel.name}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-neutral-950 font-normal leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <Price price={product.price} comparePrice={product.comparePrice} size="xl" showBadge={true} />
              </div>
            </div>

            {/* Model Selection */}
            {product.models.length > 1 && (
              <div className="space-y-3 pt-6 border-t border-neutral-100">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Select Phone Model
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
                        selectedModel.id === model.id
                          ? "bg-neutral-950 text-white shadow-sm"
                          : "border border-neutral-200/80 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                      )}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-neutral-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs font-medium text-neutral-500">
                  {formatPrice(parseFloat(product.price) * quantity)} total
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-4 text-xs font-semibold uppercase tracking-widest text-white hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Instant Order via WhatsApp</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-4 text-xs font-semibold uppercase tracking-widest text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 transition-all active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer",
                  isWishlisted ? "text-red-600" : "text-neutral-500 hover:text-neutral-950"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
              </button>
            </div>

            {/* Specifications & Assurances */}
            <div className="pt-6 border-t border-neutral-100 space-y-4">
              <div>
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Description</p>
                <p className="text-xs leading-relaxed text-neutral-600">
                  {product.description || "Hand-finished aerospace composite enclosure engineered with high-impact shock dissipation and tactile metallic button overlays."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <Truck className="h-4 w-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-950">Doha Express</p>
                    <p className="text-neutral-500 text-[10px]">Same-day dispatch</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <RefreshCw className="h-4 w-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-950">7-Day Guarantee</p>
                    <p className="text-neutral-500 text-[10px]">Hassle-free return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-neutral-200/70 pt-16">
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-neutral-200/70">
              <div>
                <span className="text-[10px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1 block">
                  Curated Pairings
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                  Complementary Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
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
    </div>
  );
}
