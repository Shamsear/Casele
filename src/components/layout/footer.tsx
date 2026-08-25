"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/lib/i18n/context";
import { ArrowUp, Instagram, Globe, Mail, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/casele_premium_mobile_case?igsi=MW55cTM4MmN6dGF3ag%3D%3D&utm_source=qr";

export function Footer() {
  const { t } = useI18n();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="border-t border-neutral-200/80 bg-neutral-100/60 pb-24 md:pb-0 text-neutral-900">
      {/* Brand Perks Strip */}
      <div className="border-b border-neutral-200/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/80 text-neutral-950 shadow-xs">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-950">Doha Express Dispatch</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Complimentary delivery over QR 100</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/80 text-neutral-950 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-950">0.1mm Precision Fit</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Engineered with aerospace composites</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/80 text-neutral-950 shadow-xs">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-950">7-Day Guarantee</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Hassle-free replacement policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="md" showLocation={true} />
            <p className="text-xs leading-relaxed text-neutral-600 max-w-sm">
              CASELÉ is Doha&apos;s premier mobile atelier. We design high-calibre protective enclosures tailored to contemporary flagships.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 transition-colors shadow-xs"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://casele.co"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official Website"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 transition-colors shadow-xs"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@casele.qa"
                aria-label="Email Support"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 transition-colors shadow-xs"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-950">Collection</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  All Cases
                </Link>
              </li>
              <li>
                <Link href="/category/premium" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Luxe & Leather Series
                </Link>
              </li>
              <li>
                <Link href="/shop/iphone-15-pro" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  iPhone 15 Pro Collection
                </Link>
              </li>
              <li>
                <Link href="/shop/samsung-galaxy-s24-ultra" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Galaxy S24 Ultra Edition
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier & Client Care */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-950">Client Services</h3>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link href="/about" className="hover:text-neutral-950 transition-colors">
                  About CASELÉ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-neutral-950 transition-colors">
                  FAQ & WhatsApp Ordering
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950 transition-colors">
                  Contact Atelier
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Concierge: </span>
                <span className="font-semibold text-neutral-900">+974 5536 4455 (Doha)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} CASELÉ Doha. All rights reserved. Precision Luxury Enclosures.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <Link href="/privacy" className="hover:text-neutral-950 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-950 transition-colors">
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 hover:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
