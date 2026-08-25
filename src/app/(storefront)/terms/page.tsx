import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${SITE.name} terms of service — ordering policies and client guidelines in Qatar.`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
            Legal & Compliance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-neutral-950">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-400">
            Effective Date: 2026 • CASELÉ Doha
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">1. Agreement to Terms</h2>
            <p>By browsing CASELÉ or placing an order via our WhatsApp concierge, you acknowledge and agree to these terms.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">2. Pricing & Availability</h2>
            <p>All prices are denominated in Qatari Riyals (QAR). Products are subject to stock availability at the time of order confirmation.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">3. Deliveries in Qatar</h2>
            <p>We deliver across Doha, Al Wakrah, Al Khor, and all Qatar municipalities. Delivery timelines are typically 24-48 hours from order confirmation.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">4. 7-Day Exchange Policy</h2>
            <p>Items in original condition may be exchanged within 7 days of delivery. Contact our WhatsApp concierge to initiate an exchange.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
