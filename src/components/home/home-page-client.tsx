"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/products/product-card";
import { Price } from "@/components/ui/price";
import type { ProductWithRelations, ModelWithCount, CategoryWithCount } from "@/lib/db/products";
import { PhoneIcon } from "@/components/ui/icons";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/lib/i18n/context";

interface HomePageClientProps {
  featured: ProductWithRelations[];
  models: ModelWithCount[];
  categories: CategoryWithCount[];
}

export function HomePageClient({ featured, models, categories }: HomePageClientProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-black">
      {/* ═══════ HERO SECTION — IMMEDIATELY VISIBLE (NO SCROLL NEEDED) ═══════ */}
      <section className="relative border-b border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-8 sm:pb-16 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Brand Identity, Logo, and Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Company Logo & Name Prominently Featured */}
              <div className="flex items-center gap-4">
                <Logo size="lg" />
                <div className="h-8 w-px bg-dark-border hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold tracking-[0.25em] text-white uppercase">CASELÉ</p>
                  <p className="text-[10px] tracking-widest text-gold uppercase">Doha, Qatar</p>
                </div>
              </div>

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-5 bg-gold" />
                <span className="text-[11px] font-semibold text-gold uppercase tracking-[0.2em]">
                  {t("hero_eyebrow")}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08]">
                Refined Protection.
                <br />
                <span className="italic font-light text-white/90">Uncompromised Design.</span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-lg text-xs sm:text-sm leading-relaxed text-warm-gray font-normal">
                {t("hero_subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-gold active:bg-gold-light"
                >
                  {t("hero_cta")}
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center border border-white/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white/5"
                >
                  {t("hero_track")}
                </Link>
              </div>

              {/* Minimal Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dark-border/60">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/90">Precision Fit</p>
                  <p className="text-[11px] text-warm-gray mt-0.5">Engineered to 0.1mm</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/90">Doha Delivery</p>
                  <p className="text-[11px] text-warm-gray mt-0.5">Same-day dispatch</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/90">Instant Order</p>
                  <p className="text-[11px] text-warm-gray mt-0.5">Via WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Right: Studio Product Display */}
            <div className="lg:col-span-5">
              {featured[0] && (
                <div className="relative bg-[#111111] border border-dark-border p-6 sm:p-8">
                  <div className="aspect-[4/5] max-h-[380px] relative flex items-center justify-center">
                    <Image
                      src={featured[0].images[0]}
                      alt={featured[0].name}
                      fill
                      className="object-contain p-2"
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-border flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-warm-gray font-medium">
                        {featured[0].modelName}
                      </p>
                      <h3 className="font-display text-lg text-white font-medium mt-0.5">
                        {featured[0].name}
                      </h3>
                    </div>
                    <Price price={featured[0].price} comparePrice={featured[0].comparePrice} size="md" />
                  </div>

                  <Link
                    href={`/shop/${featured[0].modelSlug}/${featured[0].slug}`}
                    className="mt-3 block w-full text-center border border-white/10 bg-white/5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:border-gold hover:text-gold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SIGNATURE FEATURED GRID ═══════ */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-dark-border">
            <div>
              <p className="text-[11px] font-semibold text-gold tracking-widest uppercase mb-1">
                {t("featured_eyebrow")}
              </p>
              <h2 className="font-display text-2xl sm:text-4xl text-white font-normal">
                {t("featured_title")}
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-widest text-warm-gray hover:text-gold transition-colors"
            >
              {t("featured_view_all")} →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════ ARCHITECTURAL MODEL SELECTOR ═══════ */}
      <section className="border-t border-dark-border bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[11px] font-semibold text-gold tracking-widest uppercase mb-1">
              {t("shop_by_model_eyebrow")}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-normal">
              {t("shop_by_model_title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-warm-gray leading-relaxed">
              {t("shop_by_model_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {models.map((model) => (
              <Link
                key={model.id}
                href={`/shop/${model.slug}`}
                className="group border border-dark-border bg-black/60 p-4 text-center transition-colors hover:border-gold/50 hover:bg-black"
              >
                <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center text-white/70 group-hover:text-gold transition-colors">
                  <PhoneIcon size={18} />
                </div>
                <p className="text-xs font-medium text-white group-hover:text-gold transition-colors">
                  {model.name}
                </p>
                <p className="mt-1 text-[10px] text-warm-gray/60 uppercase tracking-wider">
                  {model.count} {t("cases_count")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ EDITORIAL COLLECTIONS ═══════ */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-8 pb-4 border-b border-dark-border">
            <p className="text-[11px] font-semibold text-gold tracking-widest uppercase mb-1">
              {t("collections_eyebrow")}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-normal">
              {t("collections_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative border border-dark-border bg-[#111111] p-6 sm:p-8 flex flex-col justify-between min-h-[200px] transition-colors hover:border-gold/40"
              >
                <div>
                  <p className="font-display text-2xl text-white font-medium group-hover:text-gold transition-colors">
                    {cat.name}
                  </p>
                  <p className="mt-2 text-xs text-warm-gray leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-dark-border/40 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-warm-gray font-medium">
                    {cat.count} styles
                  </span>
                  <span className="text-xs text-white group-hover:text-gold transition-colors font-medium">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ BRAND PHILOSOPHY / CRAFTSMANSHIP ═══════ */}
      <section className="border-t border-dark-border bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-2">01 / Material</p>
              <h3 className="font-display text-xl sm:text-2xl text-white font-normal mb-2">
                {t("promise_protection_title")}
              </h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                {t("promise_protection_desc")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-2">02 / Design</p>
              <h3 className="font-display text-xl sm:text-2xl text-white font-normal mb-2">
                {t("promise_express_title")}
              </h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                {t("promise_express_desc")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-2">03 / Experience</p>
              <h3 className="font-display text-xl sm:text-2xl text-white font-normal mb-2">
                {t("promise_whatsapp_title")}
              </h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                {t("promise_whatsapp_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL STATEMENT BANNER ═══════ */}
      <section className="border-t border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <p className="text-[11px] font-semibold text-gold uppercase tracking-widest">
              {t("cta_ready")}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-normal leading-tight">
              {t("cta_title")}
            </h2>
            <p className="text-xs text-warm-gray max-w-md mx-auto leading-relaxed">
              {t("cta_desc")}
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-black hover:bg-gold transition-colors"
              >
                {t("cta_shop")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
