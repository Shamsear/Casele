import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { ShieldCheck, Truck, MessageSquare, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "About CASELÉ — Qatar's Premier Luxury Protection",
  description: `Learn about ${SITE.name} — Qatar's premier luxury phone case brand. Our heritage, philosophy, and commitment to precision.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />

        {/* Hero Header */}
        <div className="mt-8 text-center space-y-3">
          <span className="text-[10px] font-bold text-[#A88B4D] uppercase tracking-[0.2em]">
            Doha • Qatar
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-neutral-950 font-normal tracking-tight">
            About CASELÉ
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Doha&apos;s luxury mobile design studio dedicated to engineering uncompromising protection for contemporary flagships.
          </p>
        </div>

        <div className="space-y-12">
          {/* Story */}
          <section className="rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-xs space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">Our Story</h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              CASELÉ was founded on the philosophy that protection should never compromise aesthetic elegance. Operating from Doha, Qatar, we collaborate with precision engineering specialists to produce enclosures that harmonize aerospace composites with bespoke leather and metallic accents.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Each piece undergoes stringent quality verification to ensure tactile button feedback, zero-gap perimeter sealing, and seamless wireless connectivity.
            </p>
          </section>

          {/* Pillars */}
          <section>
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-[#A88B4D] tracking-widest uppercase block mb-1">Our Commitments</span>
              <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">The CASELÉ Standard</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Aerospace Materials",
                  desc: "Utilizing ballistic-grade polycarbonates, impact shock-dampening polymers, and premium treated leathers.",
                },
                {
                  icon: Truck,
                  title: "Doha Express Dispatch",
                  desc: "Direct concierge delivery across Doha, Al Wakrah, Al Khor, and all municipalities with same-day routing.",
                },
                {
                  icon: MessageSquare,
                  title: "WhatsApp Concierge",
                  desc: "Direct client interaction for order placement, device inquiries, and live tracking updates.",
                },
                {
                  icon: RefreshCw,
                  title: "7-Day Replacement",
                  desc: "Complete peace of mind with our 7-day fit and satisfaction assurance program.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Banner */}
          <section className="rounded-3xl border border-neutral-200/80 bg-neutral-900 text-white p-8 sm:p-12 text-center space-y-4">
            <span className="text-[10px] font-bold text-[#DFCA9B] uppercase tracking-[0.2em]">Concierge Inquiries</span>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-normal">Connect With Our Team</h2>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              Have specific device questions or bulk gifting requests? Speak directly with our Doha concierge team on WhatsApp.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${SITE.phone.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-950 hover:bg-[#C5A869] transition-colors shadow-sm"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
