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
  ArrowRight,
  Sparkles,
  Zap,
  ChevronDown,
  Layers,
  Magnet
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
  const [selectedFinish, setSelectedFinish] = useState<"Matte" | "Glossy">("Matte");
  const [selectedStyle, setSelectedStyle] = useState<"Slim Precision" | "MagSafe Dual-Layer Armor">("Slim Precision");
  const [quantity, setQuantity] = useState(1);
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const [openAccordion, setOpenAccordion] = useState<string | null>("specs");

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
        finish: selectedFinish,
        caseType: selectedStyle,
      });
    }
    vibrate(10);
    toast(`${product.name} (${selectedFinish} • ${selectedModel.name}) added to bag`);
  };

  const handleBuyNow = () => {
    const message = buildWhatsAppMessage({
      customerName: "Customer",
      customerPhone: "",
      items: [
        {
          name: product.name,
          model: selectedModel.name,
          finish: selectedFinish,
          caseType: selectedStyle,
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
          {/* Left: Interactive Multi-Angle Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              alt={`${product.name} — ${selectedModel.name}`}
              badge={product.badge}
              discount={discount}
            />
          </div>

          {/* Right: Product Purchase Details & Customizer (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            {/* Header / Live Stock Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
                  {selectedModel.name}
                </span>

                {/* Shelled-style Live Stock Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>In Stock • Dispatches Today</span>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-neutral-950 font-normal leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <Price price={product.price} comparePrice={product.comparePrice} size="xl" showBadge={true} />
              </div>
            </div>

            {/* 1. Device Compatibility Selector */}
            <div className="space-y-2.5 pt-5 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-900">Device Model</span>
                <span className="text-neutral-500 font-medium">{selectedModel.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
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

            {/* 2. Shelled-style Finish Customizer (Matte vs Glossy) */}
            <div className="space-y-2.5 pt-5 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-900">Surface Finish</span>
                <span className="text-neutral-500 font-medium">
                  {selectedFinish === "Matte" ? "Velvety Anti-Fingerprint" : "High-Gloss Crystal Clarity"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setSelectedFinish("Matte")}
                  className={cn(
                    "flex flex-col p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none",
                    selectedFinish === "Matte"
                      ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                      : "border-neutral-200/80 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Matte Finish</span>
                    <span className="h-3 w-3 rounded-full bg-neutral-800" />
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 leading-tight">Soft tactile grip, zero reflections</span>
                </button>

                <button
                  onClick={() => setSelectedFinish("Glossy")}
                  className={cn(
                    "flex flex-col p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none",
                    selectedFinish === "Glossy"
                      ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                      : "border-neutral-200/80 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Glossy Luxe</span>
                    <span className="h-3 w-3 rounded-full bg-[#DFCA9B]" />
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 leading-tight">Vibrant depth, scratch resistant</span>
                </button>
              </div>
            </div>

            {/* 3. Protection / MagSafe Style Selector */}
            <div className="space-y-2.5 pt-5 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-900">Enclosure Type</span>
                <span className="text-neutral-500 font-medium">{selectedStyle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setSelectedStyle("Slim Precision")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none",
                    selectedStyle === "Slim Precision"
                      ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                      : "border-neutral-200/80 bg-white hover:border-neutral-300"
                  )}
                >
                  <Layers className="h-4 w-4 text-neutral-700 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-neutral-950">Slim Precision</p>
                    <p className="text-[10px] text-neutral-500">0.8mm featherweight</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedStyle("MagSafe Dual-Layer Armor")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none",
                    selectedStyle === "MagSafe Dual-Layer Armor"
                      ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                      : "border-neutral-200/80 bg-white hover:border-neutral-300"
                  )}
                >
                  <Magnet className="h-4 w-4 text-[#A88B4D] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-neutral-950">MagSafe Armor</p>
                    <p className="text-[10px] text-neutral-500">Dual-layer magnet</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Quantity Stepper */}
            <div className="space-y-2.5 pt-5 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-900">Quantity</span>
                <span className="text-xs font-semibold text-neutral-700">
                  {formatPrice(parseFloat(product.price) * quantity)}
                </span>
              </div>
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
                  Includes free Qatar delivery over QR 100
                </span>
              </div>
            </div>

            {/* 5. CTAs */}
            <div className="space-y-3 pt-5 border-t border-neutral-100">
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
                <span>Add to Bag ({selectedFinish})</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer",
                  isWishlisted ? "text-red-600" : "text-neutral-500 hover:text-neutral-950"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
              </button>
            </div>

            {/* 6. Shelled-style Technical Accordions */}
            <div className="pt-5 border-t border-neutral-100 space-y-2.5 divide-y divide-neutral-100">
              {/* Accordion 1: Material & Protection */}
              <div className="pt-2.5">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "specs" ? null : "specs")}
                  className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-950 py-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-neutral-700" />
                    <span>Material Architecture & Fit</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openAccordion === "specs" && "rotate-180")} />
                </button>
                {openAccordion === "specs" && (
                  <div className="pt-2 pb-3 text-xs text-neutral-600 leading-relaxed space-y-2 animate-fade-in">
                    <p>
                      Precision-calibrated dual composite construction featuring an impact-dissipating perimeter bumper, raised camera bevel (1.2mm), and responsive tactile button covers.
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      <strong>Selected Model:</strong> {selectedModel.name} • <strong>Finish:</strong> {selectedFinish} • <strong>Profile:</strong> {selectedStyle}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Qatar Express Delivery */}
              <div className="pt-2.5">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "delivery" ? null : "delivery")}
                  className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-950 py-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-neutral-700" />
                    <span>Doha Delivery & Cash on Delivery</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openAccordion === "delivery" && "rotate-180")} />
                </button>
                {openAccordion === "delivery" && (
                  <div className="pt-2 pb-3 text-xs text-neutral-600 leading-relaxed space-y-1.5 animate-fade-in">
                    <p>• <strong>Doha & Lusail:</strong> Same-day dispatch (within 12-24 hours).</p>
                    <p>• <strong>Al Wakrah & Al Khor:</strong> Next-day direct drop-off.</p>
                    <p>• <strong>Payment:</strong> Cash on delivery or instant WhatsApp transfer.</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: 7-Day Guarantee */}
              <div className="pt-2.5">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "guarantee" ? null : "guarantee")}
                  className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-950 py-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-neutral-700" />
                    <span>7-Day Fit Assurance</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openAccordion === "guarantee" && "rotate-180")} />
                </button>
                {openAccordion === "guarantee" && (
                  <div className="pt-2 pb-3 text-xs text-neutral-600 leading-relaxed animate-fade-in">
                    <p>
                      If the case does not fit your device with 100% precision or you wish to exchange finishes, our WhatsApp concierge will swap your piece within 7 days.
                    </p>
                  </div>
                )}
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
        finish={selectedFinish}
        caseType={selectedStyle}
        quantity={quantity}
      />
    </div>
  );
}
