import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { MessageSquare, Mail, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Concierge",
  description: `Contact ${SITE.name} Doha concierge — WhatsApp concierge, Instagram, and email inquiries in Qatar.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase block">
            Client Concierge
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal text-neutral-950">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Our Doha-based concierge is at your service for device consultations, bespoke orders, and order inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* WhatsApp */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-xs text-neutral-950 uppercase tracking-wider">WhatsApp Concierge</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Direct mobile support & instant checkout.
              </p>
            </div>
            <a
              href={`https://wa.me/${SITE.phone.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-xs w-full justify-center"
            >
              <span>WhatsApp</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Instagram */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-xs text-neutral-950 uppercase tracking-wider">Instagram Atelier</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Follow new drops & direct DM support.
              </p>
            </div>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 transition-colors w-full justify-center"
            >
              <span>@casele</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Email */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-xs text-neutral-950 uppercase tracking-wider">Corporate Inquiries</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                For bulk gifting & corporate requests.
              </p>
            </div>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-50 transition-colors w-full justify-center truncate"
            >
              <span>{SITE.email}</span>
            </a>
          </div>

          {/* Location */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 text-center shadow-xs flex flex-col items-center justify-between">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-xs text-neutral-950 uppercase tracking-wider">Atelier Location</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Doha, Qatar. Same-day express dispatch.
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
