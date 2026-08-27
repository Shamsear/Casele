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
import { getDiscountPercent } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { Price } from "@/components/ui/price";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { StickyAddToCart } from "@/components/products/sticky-add-to-cart";
import { QuickBuyModal } from "@/components/products/quick-buy-modal";
import { flyToCart } from "@/lib/fly-to-cart";
import type { ProductWithRelations } from "@/lib/db/products";
import {
  MessageSquare,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Plus,
  Minus,
  Check,
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
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [deliveryThreshold, setDeliveryThreshold] = useState(100);
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setOpenCart = useCartStore((s) => s.setOpen);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));
  const { vibrate } = useHaptic();
  const { formatPrice } = useI18n();

  const discount = getDiscountPercent(product.price, product.comparePrice);

  useEffect(() => {
    addRecentlyViewed(product.id);

    // 1. Fetch live delivery configuration
    fetch("/api/admin/discounts/delivery-rule", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setFreeDeliveryEnabled(Boolean(data.config.isFreeDeliveryActive));
          if (Number(data.config.freeThreshold) > 0) {
            setDeliveryThreshold(Number(data.config.freeThreshold));
          }
        } else {
          setFreeDeliveryEnabled(false);
        }
      })
      .catch(() => setFreeDeliveryEnabled(false));

    // 2. Fetch general store settings
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.whatsapp_number) {
          setWhatsappNumber(data.settings.whatsapp_number);
        }
      })
      .catch(() => {});
  }, [product.id]);

  // Resolve model-specific SVG variant when user selects iPhone vs Samsung vs Pixel
  const activeImages = (() => {
    const rawImages = product.images.length > 0 ? product.images : ["/images/products/midnight-black.svg"];
    const baseFirstImg = rawImages[0];
    
    // Extract base theme slug like "midnight-black", "gold-edge", "royal-blue", etc.
    const match = baseFirstImg.match(/\/images\/products\/([a-z-]+?)(?:-samsung|-pixel|-angle|-front)?\.svg/);
    const themeSlug = match ? match[1] : "midnight-black";

    let modelMainImg = `/images/products/${themeSlug}.svg`;
    let angleImg = `/images/products/${themeSlug}-angle.svg`;
    let frontImg = `/images/products/${themeSlug}-front.svg`;

    if (selectedModel.brand === "Samsung" || selectedModel.slug.includes("samsung")) {
      modelMainImg = `/images/products/${themeSlug}-samsung.svg`;
      angleImg = `/images/products/${themeSlug}-angle-samsung.svg`;
      frontImg = `/images/products/${themeSlug}-front-samsung.svg`;
    } else if (selectedModel.brand === "Google" || selectedModel.slug.includes("pixel")) {
      modelMainImg = `/images/products/${themeSlug}-pixel.svg`;
      angleImg = `/images/products/${themeSlug}-angle-pixel.svg`;
      frontImg = `/images/products/${themeSlug}-front-pixel.svg`;
    }

    return [modelMainImg, angleImg, frontImg];
  })();

  const handleAddToCart = (e?: React.MouseEvent) => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        image: activeImages[0],
        price: parseFloat(product.price),
        comparePrice: product.comparePrice
          ? parseFloat(product.comparePrice)
          : undefined,
        modelId: selectedModel.slug,
        modelName: selectedModel.name,
        finish: selectedFinish,
        caseType: selectedStyle,
      },
      quantity,
      false // Don't open drawer immediately, fly animation runs first!
    );

    vibrate(15);
    setIsAdded(true);

    // Signature fly to cart animation
    const sourceEl = document.querySelector(".product-gallery-primary-img") as HTMLElement | null;
    flyToCart(activeImages[0], sourceEl, () => {
      setOpenCart(true);
    });

    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = () => {
    setQuickBuyOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <ProductStructuredData
        name={product.name}
        description={product.description || ""}
        price={product.price}
        images={activeImages}
        url={`https://casele.qa/shop/${modelSlug}/${productSlug}`}
      />
      <FAQSchema faqs={DEFAULT_FAQS} />

      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <Breadcrumbs
          items={[
            { label: "Collection", href: "/shop" },
            { label: selectedModel.name, href: `/shop/${modelSlug}` },
            { label: product.name, href: `/shop/${modelSlug}/${productSlug}` },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left: Huge Sticky Product Gallery — moves with scroll till end of right section */}
          <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24 self-start">
            <ProductGallery
              images={activeImages}
              alt={`${product.name} — ${selectedModel.name}`}
              badge={product.badge}
              discount={discount}
            />
          </div>

          {/* Right: Purchase Details & Customizer Section */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            {/* Header / Live Stock Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
                  {selectedModel.name}
                </span>

                {/* Live Stock Indicator */}
                {((selectedModel as any).stock !== undefined && (selectedModel as any).stock <= 0) || (product.stock !== undefined && product.stock <= 0) ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600 whitespace-nowrap shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                    <span>Out of Stock</span>
                  </div>
                ) : (selectedModel as any).stock !== undefined && (selectedModel as any).stock <= 5 ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 whitespace-nowrap shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse shrink-0" />
                    <span>Low Stock: Only {(selectedModel as any).stock} Left</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 whitespace-nowrap shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                    <span>In Stock • Dispatches Today</span>
                  </div>
                )}
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
                {product.models.map((model) => {
                  const modelStock = (model as any).stock;
                  const modelSoldOut = modelStock !== undefined && modelStock <= 0;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none whitespace-nowrap flex items-center gap-1.5",
                        selectedModel.id === model.id
                          ? "bg-neutral-950 text-white shadow-sm"
                          : modelSoldOut
                          ? "border border-neutral-200/60 bg-neutral-100/60 text-neutral-400 hover:border-neutral-300"
                          : "border border-neutral-200/80 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                      )}
                    >
                      <span>{model.name}</span>
                      {modelSoldOut && (
                        <span className="text-[9px] font-bold text-rose-700 uppercase tracking-tight bg-rose-50 px-1 py-0.5 rounded border border-rose-200">
                          Sold Out
                        </span>
                      )}
                    </button>
                  );
                })}
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
                    disabled={((selectedModel as any).stock !== undefined && (selectedModel as any).stock <= 0) || quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-neutral-950">
                    {((selectedModel as any).stock !== undefined && (selectedModel as any).stock <= 0) ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(((selectedModel as any).stock || 10), quantity + 1))}
                    disabled={((selectedModel as any).stock !== undefined && (selectedModel as any).stock <= 0) || quantity >= ((selectedModel as any).stock || 10)}
                    className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {freeDeliveryEnabled && deliveryThreshold > 0 && (
                  <span className="text-xs font-medium text-neutral-500">
                    Includes free Qatar delivery over QR {deliveryThreshold}
                  </span>
                )}
              </div>
            </div>

            {/* 5. CTAs */}
            <div className="space-y-3 pt-5 border-t border-neutral-100">
              {((selectedModel as any).stock !== undefined && (selectedModel as any).stock <= 0) || (product.stock !== undefined && product.stock <= 0) ? (
                <>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hello CASELÉ Concierge, I would like to request restock priority for ${product.name} (${selectedModel.name} • ${selectedFinish}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-4 text-xs font-semibold uppercase tracking-widest text-white hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.98]"
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    <span>Request Restock on WhatsApp</span>
                  </a>

                  <button
                    id="main-add-to-cart-btn"
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 cursor-not-allowed"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Out of Stock</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-4 text-xs font-semibold uppercase tracking-widest text-white hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Instant Order via WhatsApp</span>
                  </button>

                  <button
                    id="main-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 rounded-xl py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] cursor-pointer",
                      isAdded
                        ? "bg-neutral-950 text-white border border-neutral-950 shadow-md ring-2 ring-[#C5A869]/40"
                        : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4 text-[#DFCA9B] stroke-[2.8] animate-scale-in" />
                        <span className="text-white font-bold tracking-wider">Added to Bag ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Bag ({selectedFinish})</span>
                      </>
                    )}
                  </button>
                </>
              )}

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
            </div>
          </div>
        </div>

        {/* ═══ Related Cases (4:5 Grid) ═══ */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 border-t border-neutral-200/70 pt-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#A88B4D] uppercase tracking-widest block mb-1">
                  Curated Companions
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                  You May Also Admire
                </h2>
              </div>
              <Link
                href={`/shop/${modelSlug}`}
                className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 transition-colors"
              >
                View Collection →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
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
        stock={(selectedModel as any).stock ?? product.stock}
      />
    </div>
  );
}
