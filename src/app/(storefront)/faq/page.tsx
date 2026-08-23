import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Answers to common questions about ${SITE.name} phone cases, delivery, returns, and ordering in Qatar.`,
};

const FAQS = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How do I order a phone case?",
        a: "Simply browse our collection, pick your case and phone model, add it to your cart, then place your order via WhatsApp. We'll confirm and deliver to your doorstep.",
      },
      {
        q: "How long does delivery take?",
        a: "Most orders are delivered within 1-2 business days across Qatar, including Doha, Al Wakrah, Al Khor, and all other cities.",
      },
      {
        q: "Is there free delivery?",
        a: "Yes! Orders over QR 100 qualify for free delivery across Qatar.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We offer cash on delivery and WhatsApp-based payment. Simply order on WhatsApp and choose your preferred payment method.",
      },
    ],
  },
  {
    category: "Products & Compatibility",
    items: [
      {
        q: "What phone models do you support?",
        a: "We offer cases for iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15, iPhone 14 Pro Max, Samsung Galaxy S24 Ultra, S24+, S24, S23 Ultra, Z Fold5, Huawei P60 Pro, Mate 60 Pro, OnePlus 12, and more.",
      },
      {
        q: "Are CASELÉ phone cases protective?",
        a: "Absolutely. All our cases use military-grade materials engineered for maximum protection while maintaining a premium, stylish design.",
      },
      {
        q: "Will a case from one model fit another?",
        a: "Each case is precision-engineered for a specific phone model. Make sure to select the correct model when ordering to ensure a perfect fit.",
      },
    ],
  },
  {
    category: "Returns & Support",
    items: [
      {
        q: "Can I return or exchange my phone case?",
        a: "Yes, we offer a 7-day return policy. If you're not satisfied with your case, contact us on WhatsApp and we'll arrange an exchange or refund.",
      },
      {
        q: "How do I track my order?",
        a: "Visit our Track Order page and enter the phone number you used when placing your order. You'll see real-time status updates.",
      },
      {
        q: "How can I contact support?",
        a: "The fastest way is WhatsApp. You can also email us at info@casele.qa. We typically respond within a few hours.",
      },
    ],
  },
  {
    category: "Promotions & Discounts",
    items: [
      {
        q: "Do you offer discounts?",
        a: "Yes! We regularly run flash sales, offer promo codes, and have tiered discounts — the more you buy, the more you save.",
      },
      {
        q: "How do promo codes work?",
        a: "Add items to your cart, and you'll see an option to enter a promo code. The discount is applied automatically at checkout.",
      },
      {
        q: "Can I combine multiple discounts?",
        a: "Some promo codes are stackable with tier discounts. Check the promo code terms for details.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-5xl font-bold text-white text-center">
        Frequently Asked <span className="text-gold">Questions</span>
      </h1>
      <p className="mt-4 text-center text-warm-gray max-w-lg mx-auto">
        Everything you need to know about ordering from CASELÉ.
      </p>

      <div className="mt-12 space-y-12">
        {FAQS.map((section) => (
          <section key={section.category}>
            <h2 className="font-display text-2xl font-bold text-gold mb-6">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.items.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-dark-border bg-dark-surface/50 p-6"
                >
                  <h3 className="font-medium text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm text-warm-gray leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-16 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] via-gold/[0.03] to-transparent p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-white">
          Still Have Questions?
        </h2>
        <p className="mt-3 text-warm-gray">
          We&apos;re happy to help. Reach out to us on WhatsApp.
        </p>
        <a
          href={`https://wa.me/${SITE.phone.replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
