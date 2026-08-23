import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.name} — Qatar's premium phone case brand. Our story, mission, and commitment to quality.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-5xl font-bold text-white text-center">
        About <span className="text-gold">CASELÉ</span>
      </h1>

      <div className="mt-12 space-y-12">
        {/* Our Story */}
        <section>
          <h2 className="font-display text-3xl font-bold text-white">Our Story</h2>
          <p className="mt-4 text-warm-gray leading-relaxed">
            CASELÉ was born from a simple observation: people shouldn&apos;t have to choose
            between protecting their phone and expressing their style. Based in Doha, Qatar,
            we set out to create phone cases that are as beautiful as they are protective.
          </p>
          <p className="mt-4 text-warm-gray leading-relaxed">
            Every case in our collection is carefully selected and designed to meet the highest
            standards of quality, from premium materials to precision engineering. We believe
            your phone case is an extension of who you are.
          </p>
        </section>

        {/* Our Mission */}
        <section>
          <h2 className="font-display text-3xl font-bold text-white">Our Mission</h2>
          <p className="mt-4 text-warm-gray leading-relaxed">
            To provide Qatar with the finest selection of premium phone cases, combining
            military-grade protection with designs that make a statement. We want every
            customer to feel confident that their device is safe while looking incredible.
          </p>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="font-display text-3xl font-bold text-white">Why Choose Us</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                title: "Premium Materials",
                desc: "Every case uses military-grade materials designed to absorb impact and resist daily wear.",
              },
              {
                title: "Fast Delivery",
                desc: "We deliver across Qatar, including Doha, Al Wakrah, Al Khor, and all other cities. Most orders arrive within 1-2 days.",
              },
              {
                title: "Easy Ordering",
                desc: "Browse our collection, pick your case, and order via WhatsApp. No complicated checkout process.",
              },
              {
                title: "Customer First",
                desc: "7-day return policy, responsive WhatsApp support, and a commitment to your satisfaction.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-dark-border bg-dark-surface/50 p-6"
              >
                <h3 className="font-display text-lg font-bold text-gold">{item.title}</h3>
                <p className="mt-2 text-sm text-warm-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] via-gold/[0.03] to-transparent p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Get in Touch</h2>
          <p className="mt-3 text-warm-gray">
            Have questions? We&apos;d love to hear from you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${SITE.phone.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              WhatsApp Us
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-dark-border px-6 py-3 text-sm font-medium text-warm-gray hover:border-gold/30 hover:text-white transition-colors"
            >
              Send Email
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
