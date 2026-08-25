"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/products/product-card";
import { Price } from "@/components/ui/price";
import type { ProductWithRelations, ModelWithCount, CategoryWithCount } from "@/lib/db/products";
import { useI18n } from "@/lib/i18n/context";
import {
  Smartphone,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  featured: ProductWithRelations[];
  models: ModelWithCount[];
  categories: CategoryWithCount[];
}

export function HomePageClient({ featured, models, categories }: HomePageClientProps) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("All");

  // Collection pills
  const filterPills = [
    { id: "All", label: "All Cases" },
    { id: "bestseller", label: "Best Sellers" },
    { id: "new", label: "New Releases" },
    { id: "Premium", label: "Luxe Series" },
    { id: "Classic", label: "Classic Minimal" },
    { id: "Sport", label: "Carbon Sport" },
  ];

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return featured;
    if (activeFilter === "bestseller") return featured.filter((p) => p.badge?.toLowerCase() === "bestseller");
    if (activeFilter === "new") return featured.filter((p) => p.badge?.toLowerCase() === "new");
    return featured.filter((p) => p.categoryName.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [featured, activeFilter]);

  const heroFeatured = featured[0] || null;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      {/* ═══════ 1. EDITORIAL HERO SECTION ═══════ */}
      <section className="relative border-b border-neutral-200/70 bg-gradient-to-b from-white via-white to-neutral-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Brand Identity & Editorial Narrative */}
            <div className="lg:col-span-7 space-y-6">
              {/* Atelier Micro Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-50 px-3.5 py-1 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#C5A869] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800">
                  Doha Luxury Atelier • 2026 Edition
                </span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-neutral-950 leading-[1.05]">
                Refined Protection.
                <br />
                <span className="italic font-light text-neutral-700">Uncompromised Design.</span>
              </h1>

              {/* Sub-headline */}
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-neutral-600 font-normal">
                Engineered with aerospace-grade composites and bespoke finishes. Tailored specifically for discerning flagship users across Qatar.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] shadow-sm"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-all duration-200 hover:bg-neutral-100 hover:border-neutral-400 active:scale-[0.98]"
                >
                  Track Order
                </Link>
              </div>

              {/* 3-Column Trust Metric Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-950 font-semibold text-xs uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-[#A88B4D]" />
                    <span>0.1mm Precision</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Aerospace Tolerances</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-950 font-semibold text-xs uppercase tracking-wider">
                    <Truck className="h-4 w-4 text-[#A88B4D]" />
                    <span>Doha Express</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Same-Day Dispatch</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-950 font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-[#A88B4D]" />
                    <span>WhatsApp Concierge</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Direct Checkout</p>
                </div>
              </div>
            </div>

            {/* Right: Studio Product Spotlight */}
            <div className="lg:col-span-5">
              {heroFeatured && (
                <div className="relative rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-xl shadow-neutral-900/5 transition-all duration-300 hover:shadow-2xl">
                  {/* Spotlight Header */}
                  <div className="flex items-center justify-between pb-4 mb-2 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        Atelier Spotlight
                      </span>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-800 uppercase tracking-wider">
                      {heroFeatured.modelName}
                    </span>
                  </div>

                  {/* High-Resolution Hero Product Image */}
                  <div className="relative aspect-[4/5] max-h-[360px] w-full overflow-hidden rounded-2xl bg-neutral-100/60 flex items-center justify-center group">
                    <Image
                      src={heroFeatured.images[0]}
                      alt={heroFeatured.name}
                      fill
                      className="object-contain p-4 sm:p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    {heroFeatured.images[1] && (
                      <Image
                        src={heroFeatured.images[1]}
                        alt={`${heroFeatured.name} angle`}
                        fill
                        className="object-contain p-4 sm:p-6 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    )}
                  </div>

                  {/* Product Metadata & Price */}
                  <div className="mt-5 flex items-baseline justify-between">
                    <div>
                      <h3 className="font-display text-xl text-neutral-950 font-semibold tracking-tight">
                        {heroFeatured.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Hand-finished matte composite
                      </p>
                    </div>
                    <Price price={heroFeatured.price} comparePrice={heroFeatured.comparePrice} size="md" />
                  </div>

                  {/* View Details Link */}
                  <Link
                    href={`/shop/${heroFeatured.modelSlug}/${heroFeatured.slug}`}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-950 hover:bg-neutral-950 hover:text-white transition-all duration-200"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2. CURATED COLLECTION FILTER BAR & SIGNATURE GRID ═══════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-neutral-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-neutral-950 font-normal">
              Signature Collection
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-neutral-950 transition-colors self-start md:self-auto"
          >
            <span>View All Styles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Horizontal Category Pill Filter Bar */}
        <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {filterPills.map((pill) => {
              const isActive = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
                    isActive
                      ? "bg-neutral-950 text-white shadow-sm scale-102"
                      : "bg-white border border-neutral-200/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4:5 Responsive Product Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center rounded-2xl border border-neutral-200/80 bg-white">
            <p className="text-sm font-semibold text-neutral-900">No cases found in this category</p>
            <p className="mt-1 text-xs text-neutral-500">Try selecting &quot;All Cases&quot; to browse our entire portfolio.</p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* ═══════ 3. ARCHITECTURAL MODEL SELECTOR ═══════ */}
      <section className="border-t border-neutral-200/70 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5 block">
              Device Compatibility
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-neutral-950 font-normal">
              Shop by Phone Model
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every case is bespoke tailored to the exact millimeter dimensions of your device.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {models.map((model) => (
              <Link
                key={model.id}
                href={`/shop/${model.slug}`}
                className="group rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-5 text-center transition-all duration-300 hover:border-neutral-400 hover:bg-white hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:-translate-y-0.5"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-neutral-200/70 text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white transition-colors shadow-2xs">
                  <Smartphone className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-neutral-950 group-hover:text-neutral-950 transition-colors">
                  {model.name}
                </p>
                <p className="mt-1 text-[10px] text-neutral-400 uppercase tracking-wider font-medium">
                  {model.count} {t("cases_count") || "styles"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 4. EDITORIAL DESIGN SERIES ═══════ */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10 pb-5 border-b border-neutral-200/70">
            <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5 block">
              Design Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-neutral-950 font-normal">
              Explore Design Series
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-neutral-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5"
              >
                <div>
                  <p className="font-display text-2xl text-neutral-950 font-medium group-hover:text-neutral-700 transition-colors">
                    {cat.name}
                  </p>
                  <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                    {cat.count} models
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-neutral-950 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ 5. BRAND CRAFTSMANSHIP / PILLARS ═══════ */}
      <section className="border-t border-neutral-200/70 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#A88B4D] uppercase tracking-[0.2em]">01 / Material Architecture</span>
              <h3 className="font-display text-2xl text-neutral-950 font-medium">
                High-Impact Aerospace Composites
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Crafted from ballistic-grade polycarbonates and supple treated leathers to ensure maximum shock dissipation while maintaining a razor-thin profile.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#A88B4D] uppercase tracking-[0.2em]">02 / Dimensional Tolerance</span>
              <h3 className="font-display text-2xl text-neutral-950 font-medium">
                0.1mm Precision Enclosure
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Laser-calibrated cutouts for tactile buttons, camera island bevels, and unobstructed wireless charging compatibility.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#A88B4D] uppercase tracking-[0.2em]">03 / White-Glove Service</span>
              <h3 className="font-display text-2xl text-neutral-950 font-medium">
                Doha WhatsApp Concierge
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600">
                Experience friction-free ordering via WhatsApp with same-day express delivery across Doha, Al Wakrah, and Al Khor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 6. FINAL STATEMENT BANNER ═══════ */}
      <section className="border-t border-neutral-200/70 bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <span className="text-[10px] font-bold text-[#DFCA9B] uppercase tracking-[0.25em]">
              Elevate Your Daily Carry
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-normal leading-tight text-white">
              Ready to experience uncompromising protection?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Explore our full collection or connect with our Doha concierge team on WhatsApp for bespoke inquiries.
            </p>
            <div className="pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-950 hover:bg-[#C5A869] transition-colors shadow-lg active:scale-[0.98]"
              >
                <span>Browse All Cases</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
