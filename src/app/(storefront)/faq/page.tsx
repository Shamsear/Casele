import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Answers to common questions about ${SITE.name} phone cases, delivery, returns, and WhatsApp ordering in Qatar.`,
};

const FAQS = [
  {
    category: "Orders & Express Delivery",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our collection, choose your case style and phone model, then click 'Checkout via WhatsApp'. Our concierge will confirm your delivery address and dispatch your order.",
      },
      {
        q: "How fast is delivery in Qatar?",
        a: "Most orders are delivered within 24 hours across Doha, Al Wakrah, Al Khor, and surrounding areas.",
      },
      {
        q: "Is delivery complimentary?",
        a: "Yes! Orders over QR 100 qualify for complimentary Doha express delivery.",
      },
      {
        q: "What payment methods are supported?",
        a: "We offer Cash on Delivery (COD) and direct WhatsApp electronic payment methods.",
      },
    ],
  },
  {
    category: "Protection & Device Compatibility",
    items: [
      {
        q: "Which flagship models are supported?",
        a: "We carry precision cases for iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15, Samsung Galaxy S24 Ultra, S24+, S24, Pixel 8 Pro, and selected flagships.",
      },
      {
        q: "How protective are CASELÉ cases?",
        a: "All cases incorporate high-impact shock-dissipating perimeter bumpers, raised camera bevels, and reinforced corner geometry tested for everyday drops.",
      },
      {
        q: "Is wireless charging supported?",
        a: "Yes, our cases are engineered with optimal thickness to ensure seamless Qi and MagSafe wireless charging compatibility.",
      },
    ],
  },
  {
    category: "Returns & Concierge Support",
    items: [
      {
        q: "What is your return and exchange policy?",
        a: "We provide a 7-day hassle-free exchange policy. Simply message our WhatsApp team to arrange an instant swap.",
      },
      {
        q: "How can I contact client support?",
        a: "Our WhatsApp concierge is active daily. You can also email us at info@casele.qa.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help Center</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-normal text-neutral-950">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Everything you need to know regarding materials, WhatsApp ordering, and delivery in Qatar.
          </p>
        </div>

        <div className="space-y-10">
          {FAQS.map((section) => (
            <div key={section.category} className="space-y-4">
              <h2 className="font-semibold text-xs text-neutral-400 uppercase tracking-widest px-1">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs"
                  >
                    <h3 className="font-medium text-sm sm:text-base text-neutral-950">{faq.q}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Concierge Help */}
        <div className="mt-14 rounded-3xl border border-neutral-200/80 bg-neutral-900 text-white p-8 text-center space-y-4">
          <h3 className="font-display text-2xl text-white font-normal">Need assistance with your phone model?</h3>
          <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
            Our concierge team is available on WhatsApp to assist with compatibility checks and instant orders.
          </p>
          <a
            href={`https://wa.me/${SITE.phone.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-950 hover:bg-[#C5A869] transition-colors shadow-sm"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
