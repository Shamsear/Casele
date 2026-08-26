"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { ComparisonSlider } from "@/components/home/comparison-slider";
import { ExplodedLayers } from "@/components/home/exploded-layers";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import type { ProductWithRelations, CategoryWithCount, ModelWithCount } from "@/lib/db/products";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Smartphone,
  CheckCircle,
  MessageSquare,
  Zap,
  Layers,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  allProducts: ProductWithRelations[];
  featuredProducts: ProductWithRelations[];
  models: ModelWithCount[];
  categories: CategoryWithCount[];
}

const FILTER_TABS = [
  { id: "all", label: "All Enclosures" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "new", label: "New Releases" },
  { id: "premium", label: "Luxe Leather" },
  { id: "minimal", label: "Matte Minimal" },
  { id: "sport", label: "Carbon Armor" },
];

export function HomePageClient({
  allProducts,
  featuredProducts,
  models,
  categories,
}: HomePageClientProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [heroBadge, setHeroBadge] = useState("Doha, Qatar • Luxury Protection");
  const [heroTitle, setHeroTitle] = useState("Sculpted for Flagships.");
  const [heroSubtitle, setHeroSubtitle] = useState("Artistry in Armor.");
  const [heroDescription, setHeroDescription] = useState("Every silhouette is machined with aerospace-grade composites and tactile metallic accents. Hand-finished in Qatar for discerning device owners.");
  const [deliveryThreshold, setDeliveryThreshold] = useState(100);
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.hero_badge) setHeroBadge(data.settings.hero_badge);
          if (data.settings.hero_title) setHeroTitle(data.settings.hero_title);
          if (data.settings.hero_subtitle) setHeroSubtitle(data.settings.hero_subtitle);
          if (data.settings.hero_description) setHeroDescription(data.settings.hero_description);
          if (data.settings.free_delivery_enabled !== undefined) {
            setFreeDeliveryEnabled(data.settings.free_delivery_enabled !== "false");
          }
          if (data.settings.free_delivery_threshold) {
            const val = Number(data.settings.free_delivery_threshold);
            if (val > 0) setDeliveryThreshold(val);
          }
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "bestsellers") return product.badge?.toLowerCase() === "bestseller" || product.isFeatured;
    if (activeTab === "new") return product.badge?.toLowerCase() === "new";
    if (activeTab === "premium") return product.categoryName.toLowerCase().includes("premium") || product.name.toLowerCase().includes("leather");
    if (activeTab === "minimal") return product.categoryName.toLowerCase().includes("classic") || product.name.toLowerCase().includes("crystal") || product.name.toLowerCase().includes("silicone");
    if (activeTab === "sport") return product.categoryName.toLowerCase().includes("sport") || product.name.toLowerCase().includes("carbon");
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 overflow-hidden">
      {/* 1. HERO FOLD: Hero Content + Bottom MagSafe Marquee Ticker Filling Initial Viewport */}
      <div className="h-[calc(100svh-148px)] md:h-[calc(100vh-108px)] max-h-[720px] min-h-[440px] flex flex-col justify-between relative overflow-hidden">
        {/* Animated Ambient Drift Orbs */}
        <div className="pointer-events-none absolute top-10 right-10 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-amber-100/40 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-neutral-200/40 blur-3xl animate-float" />

        {/* Hero Main Content */}
        <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-1">
          <div className="mx-auto max-w-7xl w-full relative z-10 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
              {/* Left Editorial Copy (7 Cols on desktop) */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4 flex flex-col justify-center">
                {/* Live Atelier Badge */}
                <Reveal animation="fade-up" delay={50}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-2xs">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-ping" />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-900">
                      {heroBadge}
                    </span>
                  </div>
                </Reveal>

                {/* Main Headline */}
                <Reveal animation="fade-up" delay={120}>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3rem] font-normal leading-[1.08] tracking-tight text-neutral-950">
                    {heroTitle} <br />
                    <span className="italic font-light text-neutral-700">{heroSubtitle}</span>
                  </h1>
                </Reveal>

                {/* Subtitle */}
                <Reveal animation="fade-up" delay={190}>
                  <p className="max-w-md text-xs sm:text-sm leading-relaxed text-neutral-600">
                    {heroDescription}
                  </p>
                </Reveal>

                {/* Dual CTAs with Shimmer Hover */}
                <Reveal animation="fade-up" delay={260}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                    <Link
                      href="/shop"
                      className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-2.5 sm:py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-[0.98]"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <a
                      href="https://wa.me/97455364455?text=Hello%20CASEL%C3%89%2C%20I%20would%20like%20to%20inquire%20about%20your%20protective%20cases."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-2.5 sm:py-3 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98] shadow-2xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp Concierge</span>
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right Hero Product Spotlight (5 Cols - Visible on desktop) */}
              <div className="hidden lg:flex lg:col-span-5 justify-center">
                <Reveal animation="scale-up" delay={150} className="w-full max-w-[260px] xl:max-w-[285px]">
                  <TiltCard maxTilt={6} scale={1.02}>
                    <div className="group relative w-full aspect-[4/5] rounded-3xl bg-white border border-neutral-200/80 p-3.5 xl:p-4 flex items-center justify-center shadow-md transition-shadow duration-500 hover:shadow-xl">
                      {/* Floating Tag */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="inline-flex items-center rounded-full bg-neutral-950 px-2 py-0.5 text-[8.5px] font-bold text-white uppercase tracking-wider shadow-xs">
                          Studio Spotlight
                        </span>
                      </div>

                      {/* Product Image */}
                      <div className="relative h-full w-full">
                        <Image
                          src={featuredProducts[0]?.images[0] || "/products/leather-case-black.png"}
                          alt="Featured Case"
                          fill
                          priority
                          className="object-contain p-1.5 transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
                          sizes="285px"
                        />
                      </div>

                      {/* Floating Price Pill */}
                      <div className="absolute bottom-2.5 right-2.5 z-10 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 px-2.5 py-0.5 shadow-sm text-right">
                        <p className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider">Titanium Frame</p>
                        <p className="text-[11px] font-bold text-neutral-950">QR 85</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INFINITE MARQUEE TICKER (Anchored at the bottom edge of the initial fold) */}
        <div className="relative z-10 shrink-0">
          <MarqueeTicker />
        </div>
      </div>

      {/* 3. CURATED COLLECTION SECTION WITH PILL FILTERS (Unified Section Reveal) */}
      <Reveal animation="fade-up">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-200/70">
              <div>
                <span className="text-[10px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1.5 block">
                  Catalog Archive
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-neutral-950">
                  Curated Flagship Enclosures
                </h2>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer select-none",
                      activeTab === tab.id
                        ? "bg-neutral-950 text-white shadow-sm scale-102"
                        : "border border-neutral-200/80 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4:5 Aspect Ratio Containerless Product Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Catalog View All Link */}
            <div className="mt-14 text-center">
              <Link
                href="/shop"
                className="btn-shimmer inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-950 hover:text-white hover:border-neutral-950 active:scale-[0.98] shadow-xs"
              >
                <span>Explore Complete Collection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 4. INTERACTIVE FINISH COMPARISON SLIDER (Matte vs Glossy) */}
      <Reveal animation="fade-up">
        <ComparisonSlider />
      </Reveal>

      {/* 5. DEVICE COMPATIBILITY MATRIX (Unified Section Reveal) */}
      <Reveal animation="fade-up">
        <section className="py-16 sm:py-24 bg-white border-t border-neutral-200/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <span className="text-[10px] font-bold text-[#A88B4D] tracking-widest uppercase block">
                Precision Tooling
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-neutral-950">
                Engineered For Your Model
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Select your flagship device for tailored case options with micron-level alignment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {models.map((device) => (
                <Link
                  key={device.slug}
                  href={`/shop/${device.slug}`}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6 text-center transition-all duration-300 hover:border-neutral-950 hover:bg-white hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-all group-hover:scale-110">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-xs sm:text-sm text-neutral-950">{device.name}</h3>
                  <span className="mt-1 text-[11px] text-neutral-500 font-medium">{device.count} Styles Available</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 6. EXPLODED 4-LAYER 3D ARCHITECTURE VISUALIZER */}
      <Reveal animation="fade-up">
        <ExplodedLayers />
      </Reveal>

      {/* 7. VERIFIED PATRON TESTIMONIALS */}
      <Reveal animation="fade-up">
        <TestimonialsSection />
      </Reveal>

      {/* 8. WHITE-GLOVE SERVICE & CRAFTSMANSHIP PILLARS (Unified Section Reveal) */}
      <Reveal animation="fade-up">
        <section className="py-16 sm:py-24 border-t border-neutral-200/70 bg-neutral-900 text-white relative overflow-hidden">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#A88B4D]/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#DFCA9B] uppercase tracking-[0.2em]">
                    Atelier Standards
                  </span>
                  <h2 className="font-display text-3xl sm:text-5xl font-normal text-white leading-tight mt-2">
                    Crafted for Discerning Device Owners.
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-400 max-w-lg mt-3">
                    Every CASELÉ piece is inspected for millimeter-perfect button travel, non-yellowing composite stability, and MagSafe magnetic force.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    { title: "Same-Day Dispatch Across Qatar", desc: "Express routing within Doha, Lusail, Al Wakrah, and Al Khor." },
                    { title: "Direct WhatsApp Ordering", desc: "No complex checkouts. Communicate directly with our Doha team." },
                    { title: "7-Day Satisfaction Fit Guarantee", desc: "Hassle-free replacement if the enclosure does not meet your expectations." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-[#DFCA9B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md">
                  <TiltCard maxTilt={6} scale={1.02}>
                    <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20">
                        <ShieldCheck className="h-8 w-8 text-[#DFCA9B]" />
                      </div>
                      <h3 className="font-display text-2xl text-white font-normal">
                        {freeDeliveryEnabled && deliveryThreshold > 0
                          ? "Complimentary Doha Delivery"
                          : "Express Doha Dispatch"}
                      </h3>
                      <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                        {freeDeliveryEnabled && deliveryThreshold > 0
                          ? `Enjoy complimentary express courier delivery on all orders over QR ${deliveryThreshold} in the State of Qatar.`
                          : "Enjoy swift express courier dispatch across Doha, Lusail, and all Qatar municipalities."}
                      </p>
                      <Link
                        href="/shop"
                        className="btn-shimmer mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-950 hover:bg-[#C5A869] transition-colors shadow-sm"
                      >
                        <span>Order Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </TiltCard>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
