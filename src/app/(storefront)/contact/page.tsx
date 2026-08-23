import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE.name} — reach us via WhatsApp, email, or visit us in Doha, Qatar.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-5xl font-bold text-white text-center">
        Contact <span className="text-gold">Us</span>
      </h1>
      <p className="mt-4 text-center text-warm-gray max-w-lg mx-auto">
        We&apos;re here to help. Reach out to us through any of the channels below.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* WhatsApp */}
        <div className="rounded-xl border border-dark-border bg-dark-surface/50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-white">WhatsApp</h3>
          <p className="mt-2 text-sm text-warm-gray">
            Fastest way to reach us. Chat anytime.
          </p>
          <a
            href={`https://wa.me/${SITE.phone.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            Open WhatsApp
          </a>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-dark-border bg-dark-surface/50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-white">Email</h3>
          <p className="mt-2 text-sm text-warm-gray">
            For business inquiries and support.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dark-border px-5 py-2.5 text-sm font-medium text-warm-gray hover:border-gold/30 hover:text-white transition-colors"
          >
            {SITE.email}
          </a>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-dark-border bg-dark-surface/50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-white">Location</h3>
          <p className="mt-2 text-sm text-warm-gray">
            {SITE.address.city}, {SITE.address.region}
          </p>
          <p className="mt-1 text-xs text-warm-gray/60">
            {SITE.address.country === "QA" ? "Qatar" : SITE.address.country}
          </p>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="mt-16 rounded-2xl border border-dark-border bg-dark-surface/30 p-8">
        <h2 className="font-display text-2xl font-bold text-white text-center">
          Quick Answers
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              q: "How long does delivery take?",
              a: "Most orders are delivered within 1-2 business days across Qatar, including Doha, Al Wakrah, and Al Khor.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept cash on delivery and WhatsApp-based payment. Simply order on WhatsApp and choose your preferred method.",
            },
            {
              q: "Can I return or exchange my case?",
              a: "Yes! We offer a 7-day return policy. Contact us on WhatsApp and we'll arrange an exchange or refund.",
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-lg border border-dark-border/50 bg-dark-surface/50 p-4">
              <p className="font-medium text-white">{faq.q}</p>
              <p className="mt-1 text-sm text-warm-gray">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="/faq" className="text-sm text-gold hover:text-gold-light transition-colors">
            View all FAQs →
          </a>
        </div>
      </div>
    </div>
  );
}
