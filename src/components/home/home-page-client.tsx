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
import { Reveal, AnimatedCounter } from "@/components/ui/reveal";
import type { ProductWithRelations, ModelWithCount, CategoryWithCount } from "@/lib/db/products";
import { ShieldIcon, TruckIcon, ChatIcon, PhoneIcon } from "@/components/ui/icons";
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
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Atmospheric gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gold/[0.03] blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[90px]" />
        </div>

        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 w-full lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-6 sm:space-y-8">
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
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-semibold text-gold tracking-widest uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  {t("hero_eyebrow")}
                </span>
              </div>

              <div
                className={cn(
                  "transition-all duration-700 delay-75",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-bold text-white">
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
                <p className="max-w-md text-base sm:text-lg leading-relaxed text-warm-gray">
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
                  className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
                >
                  {t("hero_cta")}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-xl border border-dark-border px-7 py-3.5 text-sm font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white hover:bg-dark-surface/50"
                >
                  {t("hero_track")}
                </Link>
              </div>

              <div
                className={cn(
                  "flex flex-wrap items-center gap-6 pt-2 transition-all duration-500 delay-300",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {[
                  { icon: <ShieldIcon size={16} className="text-gold" />, label: t("hero_trust_protection") },
                  { icon: <TruckIcon size={16} className="text-gold" />, label: t("hero_trust_delivery") },
                  { icon: <ChatIcon size={16} className="text-gold" />, label: t("hero_trust_whatsapp") },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-warm-gray">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product showcase */}
            <div
              className={cn(
                "hidden lg:block transition-all duration-700 delay-200",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              )}
            >
              {featured[0] && (
                <div className="relative max-w-md mx-auto">
                  <div className="relative rounded-3xl border border-dark-border/60 bg-dark-surface/40 p-6 backdrop-blur-sm shadow-2xl shadow-black/80">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-black/60 relative">
                      <Image
                        src={featured[0].images[0]}
                        alt={featured[0].name}
                        fill
                        className="object-contain p-6 transition-transform duration-500 hover:scale-105"
                        priority
                        sizes="400px"
                      />
                      {featured[0].comparePrice && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                            {getDiscountPercent(featured[0].price, featured[0].comparePrice)}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gold tracking-widest uppercase font-semibold">
                          {featured[0].badge === "bestseller" ? "BESTSELLER" : featured[0].badge === "new" ? "NEW" : "FEATURED"}
                        </p>
                        <p className="font-display text-lg font-bold text-white mt-0.5">
                          {featured[0].name}
                        </p>
                        <Price price={featured[0].price} comparePrice={featured[0].comparePrice} size="md" />
                      </div>
                      <Link
                        href={`/shop/${featured[0].modelSlug}/${featured[0].slug}`}
                        className="rounded-xl bg-gold px-5 py-2.5 text-xs font-semibold text-black transition-all hover:bg-gold-light hover:shadow-md hover:shadow-gold/20"
                      >
                        Shop Now →
                      </Link>
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
                "4.9/5 Customer Rating",
                "Free Delivery Over QR 100",
                "Military Grade Protection",
                "WhatsApp Quick Ordering",
                "500+ Satisfied Customers in Qatar",
                "Same Day Dispatch",
                "Precision Engineered Cases",
              ].map((text, i) => (
                <span key={`${setIdx}-${i}`} className="text-xs text-warm-gray/60 font-medium tracking-wide flex-shrink-0 flex items-center gap-4">
                  <span>{text}</span>
                  <span className="text-gold/40 text-xs">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="border-b border-dark-border/50 bg-dark-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: 500, suffix: "+", label: t("stat_customers") },
              { value: featured.length > 0 ? featured.length * 6 : 50, suffix: "+", label: t("stat_cases") },
              { value: 4.9, suffix: "", label: t("stat_rating"), isDecimal: true },
            ].map((stat) => (
              <Reveal key={stat.label}>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-gold">
                    {stat.isDecimal ? (
                      <span>{stat.value}</span>
                    ) : (
                      <AnimatedCounter target={stat.value as number} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="text-xs text-warm-gray mt-1">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SHOP BY MODEL ═══════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-gold tracking-widest uppercase mb-2">{t("shop_by_model_eyebrow")}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {t("shop_by_model_title")}
            </h2>
            <p className="mt-2 text-warm-gray text-sm max-w-md mx-auto">
              {t("shop_by_model_subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {models.map((model, i) => (
            <Reveal key={model.id} delay={i * 40}>
              <Link
                href={`/shop/${model.slug}`}
                className="spotlight-card group relative rounded-2xl border border-dark-border/60 bg-dark-surface/50 p-4 text-center transition-all duration-300 hover:border-gold/40 hover:bg-dark-surface/80"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-black text-gold transition-all duration-200 group-hover:border-gold/30 group-hover:bg-gold/10">
                  <PhoneIcon size={18} />
                </div>
                <p className="text-xs font-semibold text-white group-hover:text-gold transition-colors duration-200 leading-tight">
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
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-gold tracking-widest uppercase mb-2">{t("featured_eyebrow")}</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                  {t("featured_title")}
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-dark-border px-4 py-2 text-xs font-medium text-warm-gray transition-all hover:border-gold/30 hover:text-white"
              >
                {t("featured_view_all")}
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </Reveal>

          {/* Clean 4-column product grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.slice(0, 4).map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
                <ProductCardHome product={product} index={i} mounted={mounted} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-border px-6 py-3 text-xs font-semibold text-warm-gray transition-all hover:border-gold/30 hover:text-white"
            >
              View all cases →
            </Link>
          </div>
        </section>
      )}

      {/* ═══════ COLLECTIONS ═══════ */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-gold tracking-widest uppercase mb-2">{t("collections_eyebrow")}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                {t("collections_title")}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 60}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="spotlight-card group relative overflow-hidden rounded-2xl border border-dark-border/60 bg-dark-surface/50 p-6 sm:p-8 transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                    e.currentTarget.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                  }}
                >
                  <p className="font-display text-2xl font-bold text-white group-hover:text-gold transition-colors duration-200">
                    {cat.name}
                  </p>
                  <p className="mt-2 text-xs text-warm-gray leading-relaxed">{cat.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-gold">
                    <span>{cat.count} cases</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ BRAND PROMISE ═══════ */}
      <section className="border-t border-dark-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-gold tracking-widest uppercase mb-2">{t("promise_eyebrow")}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                {t("promise_title")}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: t("promise_protection_title"),
                desc: t("promise_protection_desc"),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183-.394-1.183.394a2.25 2.25 0 00-1.423-1.423z" />
                  </svg>
                ),
                title: t("promise_express_title"),
                desc: t("promise_express_desc"),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                ),
                title: t("promise_whatsapp_title"),
                desc: t("promise_whatsapp_desc"),
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="spotlight-card group rounded-2xl border border-dark-border/60 bg-dark-surface/40 p-6 sm:p-8 text-center transition-all duration-300 hover:border-gold/30 hover:bg-dark-surface/70"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                    e.currentTarget.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                  }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-dark-border bg-black text-gold transition-all duration-200 group-hover:border-gold/30 group-hover:bg-gold/10">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white group-hover:text-gold transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-warm-gray">
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
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] via-gold/[0.02] to-transparent p-10 text-center md:p-16">
              <div className="relative z-10">
                <p className="text-xs font-semibold text-gold tracking-widest uppercase mb-3">{t("cta_ready")}</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {t("cta_title")}
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-warm-gray text-sm sm:text-base">
                  {t("cta_desc")}
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
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

// ═══════ Product Card for Homepage ═══════
function ProductCardHome({
  product,
  index,
  mounted,
}: {
  product: ProductWithRelations;
  index: number;
  mounted: boolean;
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
      className="spotlight-card group relative flex flex-col rounded-2xl border border-dark-border/50 bg-dark-surface/40 overflow-hidden transition-all duration-300 hover:border-gold/30 hover:bg-dark-surface/70"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={cn(
            "object-contain p-4 transition-all duration-500 ease-out",
            "group-hover:scale-105",
            hasSecondImage && "group-hover:opacity-0"
          )}
          sizes="(max-width: 640px) 50vw, 25vw"
        />

        {/* Second image crossfade */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — alternate view`}
            fill
            className="object-contain p-4 transition-all duration-500 ease-out opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          <ProductBadge badge={product.badge} />
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] text-warm-gray/60 tracking-widest uppercase font-medium">{product.modelName}</p>
        <h3 className="mt-1 text-sm font-medium text-white line-clamp-1 group-hover:text-gold transition-colors duration-200">
          {product.name}
        </h3>

        <div className="mt-auto pt-2.5">
          <Price price={product.price} comparePrice={product.comparePrice} size="sm" />
        </div>

        <button
          onClick={handleAdd}
          className={cn(
            "mt-2.5 flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.97]",
            isAdded
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-dark-surface border border-dark-border text-white hover:border-gold/40 hover:text-gold"
          )}
        >
          {isAdded ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gold">
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
