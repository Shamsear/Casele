import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { MessageSquare, Mail, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Concierge",
  description: `Contact ${SITE.name} Doha atelier — WhatsApp concierge, email inquiries, and atelier information in Qatar.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
            Atelier Concierge
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal text-neutral-950">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Our Doha-based concierge is at your service for device consultations, bespoke orders, and order inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* WhatsApp */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-neutral-950 uppercase tracking-wider">WhatsApp Concierge</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Direct mobile support & instant checkout.
              </p>
            </div>
            <a
              href={`https://wa.me/${SITE.phone.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-xs w-full justify-center"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Email */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-neutral-950 uppercase tracking-wider">Corporate & Inquiries</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                For partnerships and bulk gifting requests.
              </p>
            </div>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 transition-colors w-full justify-center"
            >
              <span>{SITE.email}</span>
            </a>
          </div>

          {/* Location */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-neutral-950 uppercase tracking-wider">Atelier Location</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Doha, Qatar. Serving all regions with express dispatch.
              </p>
            </div>
            <span className="mt-5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              State of Qatar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
