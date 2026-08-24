"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast";
import { useHaptic } from "@/hooks/use-haptic";
import { getDiscountPercent } from "@/lib/utils";
import { ProductBadge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Reveal, AnimatedCounter, ParallaxSection } from "@/components/ui/reveal";
import type { ProductWithRelations, ModelWithCount, CategoryWithCount } from "@/lib/db/products";
import { ShieldIcon, TruckIcon, ChatIcon, StarIcon, FireIcon, EyeIcon, CartIcon, PhoneIcon } from "@/components/ui/icons";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface HomePageClientProps {
  featured: ProductWithRelations[];
  models: ModelWithCount[];
  categories: CategoryWithCount[];
}

export function HomePageClient({ featured, models, categories }: HomePageClientProps) {
  const [mounted, setMounted] = useState(false);
  const { t, formatPrice } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Atmospheric gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gold/[0.03] blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-[100px]" />
          {/* Floating gold particles */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-gold/30 animate-float" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-gold/20 animate-float-delayed" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-gold/25 animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 rounded-full bg-gold/30 animate-float-delayed" style={{ animationDelay: "1s" }} />
        </div>

        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 w-full lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              {/* Brand Logo */}
              <div
                className={cn(
                  "transition-all duration-700",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                )}
              >
                <Logo size="lg" />
              </div>

              <div
                className={cn(
                  "transition-all duration-500",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold tracking-wider uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  {t("hero_eyebrow")}
                </span>
              </div>

              <div
                className={cn(
                  "transition-all duration-700 delay-75",
                  mounted ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm"
                )}
              >
                <h1 className="font-display text-[3.5rem] leading-[1.05] font-bold text-white md:text-[5rem]">
                  {t("hero_title_1")}
                  <br />
                  <span className="text-gradient-gold">{t("hero_title_2")}</span>
                  <br />
                  {t("hero_title_3")}
                </h1>
              </div>

              <div
                className={cn(
                  "transition-all duration-500 delay-150",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <p className="max-w-md text-lg leading-relaxed text-warm-gray">
                  {t("hero_subtitle")}
                </p>
              </div>

              <div
                className={cn(
                  "flex flex-wrap gap-4 transition-all duration-500 delay-200",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {t("hero_cta")}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-xl border border-dark-border px-8 py-4 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white hover:bg-dark-surface/50"
                >
                  {t("hero_track")}
                </Link>
              </div>

              <div
                className={cn(
                  "flex items-center gap-8 pt-4 transition-all duration-500 delay-300",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {[
                  { icon: <ShieldIcon size={16} className="text-gold/60" />, label: t("hero_trust_protection") },
                  { icon: <TruckIcon size={16} className="text-gold/60" />, label: t("hero_trust_delivery") },
                  { icon: <ChatIcon size={16} className="text-gold/60" />, label: t("hero_trust_whatsapp") },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-warm-gray/70">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product showcase with floating animation */}
            <div
              className={cn(
                "hidden lg:block transition-all duration-1000 delay-200",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              )}
            >
              {featured[0] && (
                <div className="relative">
                  {/* Main product card with float */}
                  <div className="relative rounded-3xl border border-dark-border/50 bg-dark-surface/30 p-6 backdrop-blur-sm animate-float shadow-2xl shadow-gold/5">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-black/80 to-black/40">
                      <Image
                        src={featured[0].images[0]}
                        alt={featured[0].name}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain p-4 transition-transform duration-700 hover:scale-110"
                        priority
                      />
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gold/60 tracking-widest uppercase font-medium">
                          {featured[0].badge === "bestseller" ? "⭐ Bestseller" : featured[0].badge === "new" ? "✨ New" : ""}
                        </p>
                        <p className="font-display text-xl font-bold text-white mt-1">
                          {featured[0].name}
                        </p>
                        <Price price={featured[0].price} comparePrice={featured[0].comparePrice} size="md" />
                      </div>
                      <Link
                        href={`/shop/${featured[0].modelSlug}/${featured[0].slug}`}
                        className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 hover:scale-105 active:scale-95"
                      >
                        Shop →
                      </Link>
                    </div>
                  </div>

                  {/* Floating accent cards */}
                  {featured[1] && (
                    <div className="absolute -top-5 -right-5 rounded-2xl border border-dark-border/50 bg-dark-surface/80 px-4 py-3 backdrop-blur-xl animate-float-delayed shadow-xl">
                      <p className="text-xs text-gold font-semibold">{featured[1].badge?.toUpperCase() || "✨ NEW"}</p>
                      <p className="text-[11px] text-warm-gray mt-0.5">{featured[1].name}</p>
                    </div>
                  )}
                  {featured[0].comparePrice && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-xl shadow-red-500/30">
                        🏷️ {getDiscountPercent(featured[0].price, featured[0].comparePrice)}% OFF
                      </span>
                    </div>
                  )}

                  {/* Social proof mini-card */}
                  <div className="absolute -bottom-3 -left-3 rounded-2xl border border-dark-border/50 bg-dark-surface/80 px-4 py-3 backdrop-blur-xl animate-float shadow-xl" style={{ animationDelay: "3s" }}>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-gold/20 border border-gold/30" />
                        <div className="w-5 h-5 rounded-full bg-gold/30 border border-gold/30" />
                        <div className="w-5 h-5 rounded-full bg-gold/40 border border-gold/30" />
                      </div>
                      <p className="text-[10px] text-warm-gray">500+ happy customers</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF TICKER ═══════ */}
      <div className="overflow-hidden border-y border-dark-border/30 bg-dark-surface/20 py-3">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-8 px-4">
              {[
                "⭐ 4.9/5 Customer Rating",
                "🚚 Free Delivery Over QR 100",
                "🛡️ Premium Protection",
                "💬 WhatsApp Support",
                "🔥 500+ Happy Customers",
                "✨ New Arrivals Weekly",
                "📦 Same Day Delivery in Qatar",
                "💎 Luxury Quality Cases",
              ].map((text, i) => (
                <span key={`${setIdx}-${i}`} className="text-xs text-warm-gray/50 font-medium flex-shrink-0">
                  {text}
                  <span className="mx-8 text-gold/20">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="border-b border-dark-border/50 bg-dark-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: 500, suffix: "+", label: t("stat_customers") },
              { value: featured.length > 0 ? featured.length * 6 : 50, suffix: "+", label: t("stat_cases") },
              { value: 4.9, suffix: "", label: t("stat_rating"), isDecimal: true },
            ].map((stat) => (
              <Reveal key={stat.label}>
                <div>
                  <p className="font-display text-3xl font-bold text-gold md:text-4xl">
                    {stat.isDecimal ? (
                      <span>{stat.value}</span>
                    ) : (
                      <AnimatedCounter target={stat.value as number} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="text-xs text-warm-gray md:text-sm mt-1">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SHOP BY MODEL ═══════ */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">{t("shop_by_model_eyebrow")}</p>
            <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
              {t("shop_by_model_title")}
            </h2>
            <p className="mt-3 text-warm-gray max-w-md mx-auto">
              {t("shop_by_model_subtitle")}
            </p>
            <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {models.map((model, i) => (
            <Reveal key={model.id} delay={i * 60}>
              <Link
                href={`/shop/${model.slug}`}
                className="spotlight-card group relative rounded-2xl border border-dark-border bg-dark-surface/50 p-5 text-center transition-all duration-500 hover:border-gold/30 hover:bg-dark-surface/80 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-dark-border bg-black text-gold transition-all duration-300 group-hover:border-gold/30 group-hover:bg-gold/10 group-hover:scale-110">
                  <PhoneIcon size={20} />
                </div>
                <p className="text-xs font-semibold text-white group-hover:text-gold transition-colors duration-300 leading-tight">
                  {model.name}
                </p>
                <p className="mt-1 text-[10px] text-warm-gray">
                  {model.count} {t("cases_count")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">{t("featured_eyebrow")}</p>
                <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                  {t("featured_title")}
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-dark-border px-5 py-2.5 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white hover:bg-dark-surface/50"
              >
                {t("featured_view_all")}
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </Reveal>

          {/* First product gets spotlight treatment */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
            {/* Hero spotlight product */}
            {featured[0] && (
              <Reveal delay={100} className="md:col-span-6 md:row-span-2">
                <ProductCardHome product={featured[0]} index={0} mounted={mounted} large />
              </Reveal>
            )}
            {/* Remaining products */}
            {featured.slice(1, 5).map((product, i) => (
              <Reveal key={product.id} delay={150 + i * 80} className="md:col-span-3">
                <ProductCardHome product={product} index={i + 1} mounted={mounted} />
              </Reveal>
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
      )}

      {/* ═══════ COLLECTIONS ═══════ */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">{t("collections_eyebrow")}</p>
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                {t("collections_title")}
              </h2>
              <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 80}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="spotlight-card group relative overflow-hidden rounded-2xl border border-dark-border bg-dark-surface/50 p-8 transition-all duration-500 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                    e.currentTarget.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold/[0.03] blur-[50px] transition-all duration-500 group-hover:bg-gold/[0.08]" />
                  <p className="font-display text-3xl font-bold text-white group-hover:text-gold transition-colors duration-300">
                    {cat.name}
                  </p>
                  <p className="mt-2 text-sm text-warm-gray leading-relaxed">{cat.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-gold">
                    <span>{cat.count} cases</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {/* Animated underline */}
                  <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-500 group-hover:w-full" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ BRAND PROMISE ═══════ */}
      <section className="border-t border-dark-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-xs font-medium text-gold tracking-widest uppercase mb-3">{t("promise_eyebrow")}</p>
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                {t("promise_title")}
              </h2>
              <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: t("promise_protection_title"),
                desc: t("promise_protection_desc"),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183-.394-1.183.394a2.25 2.25 0 00-1.423-1.423z" />
                  </svg>
                ),
                title: t("promise_express_title"),
                desc: t("promise_express_desc"),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                ),
                title: t("promise_whatsapp_title"),
                desc: t("promise_whatsapp_desc"),
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="spotlight-card group rounded-2xl border border-dark-border bg-dark-surface/50 p-8 text-center transition-all duration-500 hover:border-gold/20 hover:bg-dark-surface hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                    e.currentTarget.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                  }}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-dark-border bg-black text-gold transition-all duration-300 group-hover:border-gold/30 group-hover:bg-gold/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/10">
                    {item.icon}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="border-t border-dark-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] via-gold/[0.03] to-transparent p-12 text-center md:p-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-gold/[0.06] blur-[120px]" />
              {/* Floating particles */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-gold/20 animate-float" />
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-gold/15 animate-float-delayed" />
              <div className="relative z-10">
                <p className="text-xs font-medium text-gold tracking-widest uppercase mb-4">{t("cta_ready")}</p>
                <h2 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  {t("cta_title")}
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-warm-gray text-lg">
                  {t("cta_desc")}
                </p>
                <Link
                  href="/shop"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-10 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {t("cta_shop")}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ═══════ Product Card for Homepage — with optional large variant ═══════
function ProductCardHome({
  product,
  index,
  mounted,
  large = false,
}: {
  product: ProductWithRelations;
  index: number;
  mounted: boolean;
  large?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const { vibrate } = useHaptic();
  const { formatPrice } = useI18n();
  const discount = getDiscountPercent(product.price, product.comparePrice);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isAdded, setIsAdded] = useState(false);
  const hasSecondImage = product.images.length > 1;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

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
    setIsAdded(true);
    toast(`${product.name} added to cart`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Link
      ref={cardRef}
      href={`/shop/${product.modelSlug}/${product.slug}`}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight-card group relative flex flex-col rounded-2xl border border-dark-border/50 bg-dark-surface/40 overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1",
        large && "h-full"
      )}
    >
      {/* Image */}
      <div className={cn("relative overflow-hidden bg-gradient-to-br from-black/60 to-black/30", large ? "aspect-[4/5]" : "aspect-square")}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={cn(
            "object-contain transition-all duration-700 ease-out",
            large ? "p-8 group-hover:scale-105" : "p-4 group-hover:scale-110",
            hasSecondImage && "group-hover:opacity-0"
          )}
          sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
        />

        {/* Second image crossfade */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — alternate view`}
            fill
            className={cn(
              "object-contain transition-all duration-700 ease-out opacity-0 group-hover:opacity-100",
              large ? "p-8 scale-105 group-hover:scale-110" : "p-4 scale-105 group-hover:scale-110"
            )}
            sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
          />
        )}

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <ProductBadge badge={product.badge} />
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-red-500/20">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className={cn("flex flex-1 flex-col", large ? "p-6" : "p-4")}>
        <p className="text-[10px] text-warm-gray/60 tracking-wider uppercase font-medium">{product.modelName}</p>
        <h3 className={cn(
          "mt-1 font-semibold text-white line-clamp-1 group-hover:text-gold transition-colors duration-300",
          large ? "text-lg" : "text-sm"
        )}>
          {product.name}
        </h3>

        <div className="mt-auto pt-3">
          <Price price={product.price} comparePrice={product.comparePrice} size={large ? "lg" : "md"} />
        </div>

        <button
          onClick={handleAdd}
          className={cn(
            "mt-3 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.96]",
            large ? "h-12" : "h-10",
            isAdded
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 hover:border-gold/40"
          )}
        >
          {isAdded ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 animate-check-pop">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
