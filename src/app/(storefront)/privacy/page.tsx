import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE.name} privacy policy — how we collect, use, and protect your information in Qatar.`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
            Legal & Compliance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-neutral-950">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400">
            Effective Date: 2026 • CASELÉ Doha
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">1. Data We Collect</h2>
            <p>To fulfill your mobile case order and deliver across Qatar, we collect:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-2">
              <li>Client name</li>
              <li>Mobile / WhatsApp contact number</li>
              <li>Delivery address and municipality details</li>
              <li>Order history and device model preferences</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">2. Purpose of Processing</h2>
            <p>Your details are strictly used to coordinate dispatch, generate WhatsApp delivery confirmations, and manage customer support inquiries.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">3. Confidentiality</h2>
            <p>We do not share, sell, or disclose your contact information to unapproved third parties. Delivery drivers receive only the necessary contact information required for package drop-off.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-sm text-neutral-950 uppercase tracking-wider">4. Contact Atelier</h2>
            <p>For data inquiries or record modifications, reach out directly to info@casele.qa or WhatsApp +974 5536 4455.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
