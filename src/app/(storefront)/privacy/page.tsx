import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE.name} privacy policy — how we collect, use, and protect your personal information.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-5xl font-bold text-white text-center">
        Privacy <span className="text-gold">Policy</span>
      </h1>
      <p className="mt-4 text-center text-warm-gray text-sm">
        Last updated: August 24, 2026
      </p>

      <div className="mt-12 space-y-8 text-warm-gray leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p>When you place an order through CASELÉ, we collect the following information:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>Name</li>
            <li>Phone number (for order tracking and delivery)</li>
            <li>Delivery address</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>Process and deliver your orders</li>
            <li>Send order status updates</li>
            <li>Provide customer support</li>
            <li>Improve our products and services</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties.
            Your information is only shared with delivery partners to fulfill your orders.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">6. Cookies</h2>
          <p>
            Our website uses cookies to improve your browsing experience and remember your
            preferences (such as cart contents and theme settings). You can control cookies
            through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us via
            WhatsApp at {SITE.phone} or email at {SITE.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
