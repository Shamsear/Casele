"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { ComparisonSlider } from "@/components/home/comparison-slider";
import { ExplodedLayers } from "@/components/home/exploded-layers";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import type { ProductWithRelations, CategoryWithCount } from "@/lib/db/products";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Smartphone,
  CheckCircle,
  MessageSquare,
  Zap,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  initialProducts: ProductWithRelations[];
  featuredProducts: ProductWithRelations[];
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
  initialProducts,
  featuredProducts,
  categories,
}: HomePageClientProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = initialProducts.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "bestsellers") return product.badge === "BESTSELLER" || product.isFeatured;
    if (activeTab === "new") return product.badge === "NEW";
    if (activeTab === "premium") return product.categorySlug === "premium" || product.name.toLowerCase().includes("leather");
    if (activeTab === "minimal") return product.categorySlug === "minimal" || product.name.toLowerCase().includes("silicone");
    if (activeTab === "sport") return product.categorySlug === "protection" || product.name.toLowerCase().includes("carbon");
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      {/* 1. HERO SECTION: Editorial High-Conversion DTC Showcase */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-14 lg:p-16 shadow-xs overflow-hidden">
            {/* Ambient Background Gradient Spot */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-50/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-neutral-100/80 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Editorial Copy (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Live Atelier Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 shadow-2xs">
                  <span className="flex h-2 w-2 rounded-full bg-[#C5A869] animate-ping" />
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-900">
                    Doha Atelier • 2026 Collection
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-neutral-950">
                  Refined Protection. <br />
                  <span className="italic font-light text-neutral-700">Uncompromised Design.</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-xl text-xs sm:text-sm lg:text-base leading-relaxed text-neutral-600">
                  Engineered with aerospace composites, surgical tolerances, and tactile metallic accents. Hand-finished for contemporary iPhone and Galaxy flagships in Qatar.
                </p>

                {/* Dual CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    <span>Shop All Cases</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href="https://wa.me/97455364455?text=Hello%20CASEL%C3%89%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20your%20protective%20cases."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Trust Points */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100">
                  <div>
                    <span className="block text-sm font-bold text-neutral-950 font-mono">0.1mm</span>
                    <span className="text-[11px] text-neutral-500 font-medium">Precision Fit</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-neutral-950 font-mono">24H Express</span>
                    <span className="text-[11px] text-neutral-500 font-medium">Doha Dispatch</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-neutral-950 font-mono">100% Fit</span>
                    <span className="text-[11px] text-neutral-500 font-medium">7-Day Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Product Spotlight (5 Cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="group relative w-full max-w-sm aspect-[4/5] rounded-3xl bg-neutral-100/80 border border-neutral-200/80 p-8 flex items-center justify-center shadow-md transition-all duration-500 hover:shadow-xl">
                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 px-3 py-1 text-[10px] font-bold text-neutral-900 uppercase tracking-wider shadow-2xs">
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
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl"
                      sizes="(max-width: 768px) 80vw, 400px"
                    />
                  </div>

                  {/* Floating Price Pill */}
                  <div className="absolute bottom-4 right-4 z-10 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 px-3.5 py-1.5 shadow-sm text-right">
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Titanium Frame</p>
                    <p className="text-xs font-bold text-neutral-950">QR 85</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE TICKER */}
      <MarqueeTicker />

      {/* 3. CURATED COLLECTION SECTION WITH PILL FILTERS */}
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
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "border border-neutral-200/80 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4:5 Aspect Ratio Product Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Catalog View All Link */}
          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-all hover:bg-neutral-950 hover:text-white hover:border-neutral-950 active:scale-[0.98] shadow-xs"
            >
              <span>Explore Complete Collection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE FINISH COMPARISON SLIDER (Matte vs Glossy) */}
      <ComparisonSlider />

      {/* 5. DEVICE COMPATIBILITY MATRIX */}
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
            {[
              { name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", count: "12 Styles", icon: Smartphone },
              { name: "iPhone 15 Pro", slug: "iphone-15-pro", count: "12 Styles", icon: Smartphone },
              { name: "Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", count: "10 Styles", icon: Smartphone },
              { name: "Pixel 8 Pro", slug: "google-pixel-8-pro", count: "8 Styles", icon: Smartphone },
            ].map((device) => {
              const Icon = device.icon;
              return (
                <Link
                  key={device.slug}
                  href={`/shop/${device.slug}`}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6 text-center transition-all duration-300 hover:border-neutral-950 hover:bg-white hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-xs sm:text-sm text-neutral-950">{device.name}</h3>
                  <span className="mt-1 text-[11px] text-neutral-500 font-medium">{device.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. EXPLODED 4-LAYER 3D ARCHITECTURE VISUALIZER */}
      <ExplodedLayers />

      {/* 7. VERIFIED PATRON TESTIMONIALS */}
      <TestimonialsSection />

      {/* 8. WHITE-GLOVE SERVICE & CRAFTSMANSHIP PILLARS */}
      <section className="py-16 sm:py-24 border-t border-neutral-200/70 bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-bold text-[#DFCA9B] uppercase tracking-[0.2em]">
                Atelier Standards
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-normal text-white leading-tight">
                Crafted for Discerning Device Owners.
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-400 max-w-lg">
                Every CASELÉ piece is inspected for millimeter-perfect button travel, non-yellowing composite stability, and MagSafe magnetic force.
              </p>

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
              <div className="relative w-full max-w-md aspect-square rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl text-white font-normal">Complimentary Doha Delivery</h3>
                <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                  Enjoy complimentary express courier delivery on all orders over QR 100 in the State of Qatar.
                </p>
                <Link
                  href="/shop"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-950 hover:bg-[#C5A869] transition-colors shadow-sm"
                >
                  <span>Order Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
