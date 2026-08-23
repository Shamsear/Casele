import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${SITE.name} terms of service — the rules and guidelines for using our website and services.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-5xl font-bold text-white text-center">
        Terms of <span className="text-gold">Service</span>
      </h1>
      <p className="mt-4 text-center text-warm-gray text-sm">
        Last updated: August 24, 2026
      </p>

      <div className="mt-12 space-y-8 text-warm-gray leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the {SITE.name} website and services, you agree to be
            bound by these Terms of Service. If you do not agree to these terms, please
            do not use our services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">2. Products and Orders</h2>
          <p>
            All products displayed on our website are subject to availability. We reserve
            the right to discontinue any product at any time. Prices are listed in Qatari
            Riyals (QAR) and are subject to change without notice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">3. Ordering Process</h2>
          <p>Orders are placed via WhatsApp. By placing an order, you agree to:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>Provide accurate contact and delivery information</li>
            <li>Be available to receive your delivery</li>
            <li>Pay the agreed amount upon delivery (for cash on delivery orders)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">4. Delivery</h2>
          <p>
            We deliver across Qatar. Delivery times are estimates and may vary based on
            location and order volume. {SITE.name} is not responsible for delays caused
            by incorrect address information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">5. Returns and Refunds</h2>
          <p>
            We offer a 7-day return policy. To be eligible for a return, the product must
            be unused and in its original packaging. Contact us on WhatsApp to initiate
            a return. Refunds will be processed within 5-7 business days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is
            the property of {SITE.name} and is protected by applicable intellectual
            property laws.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
          <p>
            {SITE.name} shall not be liable for any indirect, incidental, or consequential
            damages arising from the use of our products or services. Our total liability
            shall not exceed the purchase price of the product.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">8. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the
            State of Qatar. Any disputes shall be subject to the exclusive jurisdiction
            of the courts of Qatar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Changes will be
            posted on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-4">10. Contact</h2>
          <p>
            For questions about these Terms of Service, contact us via WhatsApp at
            {SITE.phone} or email at {SITE.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
