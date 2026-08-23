"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ProductBadge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast";
import { useHaptic } from "@/hooks/use-haptic";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { PRODUCTS, MODELS, CATEGORIES } from "@/lib/data";

const FEATURED = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Atmospheric gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gold/[0.03] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[80px]" />
        </div>

        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 w-full lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              {/* Eyebrow */}
              <div
                className={`transition-all duration-700 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold tracking-wider uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  Premium Mobile Cases
                </span>
              </div>

              {/* Headline */}
              <div
                className={`transition-all duration-700 delay-100 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h1 className="font-display text-[3.5rem] leading-[1.05] font-bold text-white md:text-[4.5rem]">
                  Protect.
                  <br />
                  <span className="text-gold">Express.</span>
                  <br />
                  Elevate.
                </h1>
              </div>

              {/* Subtitle */}
              <div
                className={`transition-all duration-700 delay-200 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <p className="max-w-md text-lg leading-relaxed text-warm-gray">
                  Premium phone cases crafted for those who refuse to choose
                  between style and protection. Every case tells a story.
                </p>
              </div>

              {/* CTAs */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
                >
                  Shop the Collection
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-xl border border-dark-border px-7 py-3.5 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white"
                >
                  Track Order
                </Link>
              </div>

              {/* Trust signals */}
              <div
                className={`flex items-center gap-6 pt-4 transition-all duration-700 delay-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {[
                  { icon: "🛡️", label: "Premium Protection" },
                  { icon: "🚚", label: "Fast Delivery" },
                  { icon: "💬", label: "WhatsApp Orders" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-warm-gray/70">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product showcase */}
            <div
              className={`hidden lg:block transition-all duration-1000 delay-300 ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative">
                {/* Main product card */}
                <div className="relative rounded-2xl border border-dark-border bg-dark-surface/50 p-6 backdrop-blur-sm">
                  <div className="aspect-square overflow-hidden rounded-xl bg-black">
                    <Image
                      src="/images/products/midnight-black.svg"
                      alt="Midnight Black Premium Case"
                      width={400}
                      height={400}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-warm-gray">Bestseller</p>
                      <p className="font-display text-lg font-semibold text-white">Midnight Black</p>
                      <p className="font-display text-xl font-bold text-gold">QR 79</p>
                    </div>
                    <Link
                      href="/shop/iphone-15-pro/midnight-black-premium-case"
                      className="rounded-xl bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
                    >
                      View →
                    </Link>
                  </div>
                </div>

                {/* Floating accent cards */}
                <div className="absolute -top-4 -right-4 rounded-xl border border-dark-border bg-dark-surface/80 px-3 py-2 backdrop-blur-sm">
                  <p className="text-xs text-gold font-medium">✨ NEW</p>
                  <p className="text-[10px] text-warm-gray">Gold Edge Luxe</p>
                </div>
                <div className="absolute -bottom-3 -left-3 rounded-xl border border-dark-border bg-dark-surface/80 px-3 py-2 backdrop-blur-sm">
                  <p className="text-xs text-emerald-400 font-medium">🔥 20% OFF</p>
                  <p className="text-[10px] text-warm-gray">Limited time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="border-y border-dark-border/50 bg-dark-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "500+", label: "Happy Customers" },
              { value: "50+", label: "Premium Cases" },
              { value: "4.9★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-gold md:text-3xl">{stat.value}</p>
                <p className="text-xs text-warm-gray md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SHOP BY MODEL ═══════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">Find Your Fit</p>
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Shop by Device
          </h2>
          <p className="mt-3 text-warm-gray max-w-md mx-auto">
            Select your phone model and discover cases made to fit perfectly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {MODELS.map((model, i) => (
            <Link
              key={model.id}
              href={`/shop/${model.slug}`}
              className={`group relative rounded-xl border border-dark-border bg-dark-surface p-5 text-center transition-all duration-300 hover:border-gold/40 hover:bg-dark-surface/80 hover:shadow-lg hover:shadow-gold/5 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-black text-sm text-gold transition-colors group-hover:border-gold/30">
                {model.brand === "iPhone" ? "📱" : model.brand === "Samsung" ? "📱" : "📱"}
              </div>
              <p className="text-xs font-medium text-white group-hover:text-gold transition-colors leading-tight">
                {model.name}
              </p>
              <p className="mt-1 text-[10px] text-warm-gray">
                {model.count} cases
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">Curated for You</p>
            <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
              Featured Cases
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-dark-border px-5 py-2.5 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white"
          >
            View all
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {FEATURED.map((product, i) => (
            <ProductCardHome key={product.id} product={product} index={i} mounted={mounted} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-dark-border px-6 py-3 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white"
          >
            View all cases →
          </Link>
        </div>
      </section>

      {/* ═══════ COLLECTIONS ═══════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">Browse</p>
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-dark-border bg-dark-surface p-8 transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gold/[0.03] blur-[40px]" />
              <p className="font-display text-3xl font-bold text-white group-hover:text-gold transition-colors">
                {cat.name}
              </p>
              <p className="mt-2 text-sm text-warm-gray">{cat.description}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-gold">
                <span>{cat.count} cases</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 transition-transform group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ BRAND PROMISE ═══════ */}
      <section className="border-t border-dark-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">Why CASELÉ</p>
            <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
              Our Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Premium Protection",
                desc: "Military-grade materials engineered to absorb impact. Your device stays safe, no matter what life throws at it.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
                title: "Express Yourself",
                desc: "From minimalist elegance to bold statements. Every case is designed to reflect who you are.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                ),
                title: "Order on WhatsApp",
                desc: "No complicated checkout. Pick your case, send us a message on WhatsApp, and we handle the rest.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`group rounded-2xl border border-dark-border bg-dark-surface/50 p-8 text-center transition-all duration-300 hover:border-gold/20 hover:bg-dark-surface ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-dark-border bg-black text-gold transition-colors group-hover:border-gold/30">
                  {item.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="border-t border-dark-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] via-gold/[0.03] to-transparent p-12 text-center md:p-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/[0.05] blur-[100px]" />
            <div className="relative z-10">
              <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">Ready to upgrade?</p>
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                Find Your Perfect Case
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-warm-gray">
                Browse our collection of premium cases. Fast delivery, easy WhatsApp checkout, and protection that lasts.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
              >
                Shop Now
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════ Product Card for Homepage ═══════
function ProductCardHome({
  product,
  index,
  mounted,
}: {
  product: typeof PRODUCTS[0];
  index: number;
  mounted: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const { vibrate } = useHaptic();
  const discount = getDiscountPercent(product.price, product.comparePrice);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : undefined,
      modelId: product.modelSlug,
      modelName: product.modelName,
    });
    vibrate(10);
    toast(`${product.name} added to cart`);
  };

  return (
    <Link
      href={`/shop/${product.modelSlug}/${product.slug}`}
      className={`group relative flex flex-col rounded-2xl border border-dark-border bg-dark-surface/50 overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 100 + 200}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-black">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <ProductBadge badge={product.badge} />
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-warm-gray transition-colors hover:text-gold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] text-warm-gray/70 tracking-wide uppercase">{product.modelName}</p>
        <h3 className="mt-1 text-sm font-semibold text-white line-clamp-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-gold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-warm-gray line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="mt-3 flex h-9 items-center justify-center rounded-lg border border-dark-border bg-black text-xs font-medium text-white transition-all hover:border-gold/30 hover:text-gold active:scale-[0.98]"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
