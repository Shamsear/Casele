"use client";

import { useCallback } from "react";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n/context";

const INSTAGRAM_URL = "https://www.instagram.com/casele_premium_mobile_case?igsi=MW55cTM4MmN6dGF3ag%3D%3D&utm_source=qr";

export function Footer() {
  const { t } = useI18n();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="border-t border-dark-border/50 bg-black pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div>
              <Logo size="sm" />
              <p className="mt-4 text-sm text-warm-gray leading-relaxed max-w-sm">
                {t("footer_tagline")}
              </p>
              <p className="mt-2 text-xs text-warm-gray/50">
                {t("footer_desc")}
              </p>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-border bg-dark-surface/50 text-warm-gray transition-all hover:border-gold/30 hover:text-gold hover:bg-gold/10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://casele.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-border bg-dark-surface/50 text-warm-gray transition-all hover:border-gold/30 hover:text-gold hover:bg-gold/10"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{t("footer_quick_links")}</h3>
            <div className="mt-1 h-0.5 w-6 bg-gold/50" />
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "/shop", label: t("footer_shop_all") },
                { href: "/track", label: t("footer_track_order") },
                { href: "/about", label: t("footer_about") },
                { href: "/faq", label: t("footer_faq") },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-warm-gray hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{t("footer_contact")}</h3>
            <div className="mt-1 h-0.5 w-6 bg-gold/50" />
            <ul className="mt-4 space-y-2.5 text-xs text-warm-gray">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-block truncate max-w-[200px]"
                >
                  @casele_premium_mobile_case
                </a>
              </li>
              <li>
                <a
                  href="https://casele.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-block"
                >
                  www.casele.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-warm-gray/50">
            &copy; {new Date().getFullYear()} CASELÉ. {t("footer_rights")}
          </p>
          <div className="flex items-center gap-6 text-xs text-warm-gray/50">
            <a href="/privacy" className="hover:text-white transition-colors">{t("footer_privacy")}</a>
            <a href="/terms" className="hover:text-white transition-colors">{t("footer_terms")}</a>
            <a href="/contact" className="hover:text-white transition-colors">{t("footer_contact")}</a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-dark-border bg-dark-surface/50 text-warm-gray transition-all hover:border-gold/30 hover:text-gold hover:bg-gold/10"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.04 1.08l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
