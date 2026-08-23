"use client";

import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-dark-border/50 bg-black pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Logo size="sm" />
            <p className="mt-3 text-sm text-warm-gray">
              {t("footer_tagline")}
            </p>
            <p className="mt-2 text-xs text-warm-gray/60">
              {t("footer_desc")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">{t("footer_quick_links")}</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/shop", label: t("footer_shop_all") },
                { href: "/track", label: t("footer_track_order") },
                { href: "/about", label: t("footer_about") },
                { href: "/faq", label: t("footer_faq") },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-warm-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">{t("footer_contact")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-gray">
              <li>
                <a
                  href="https://instagram.com/casele.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @casele.co
                </a>
              </li>
              <li>
                <a
                  href="https://casele.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  www.casele.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-warm-gray/60">
            &copy; {new Date().getFullYear()} CASELÉ. {t("footer_rights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-warm-gray/60">
            <a href="/privacy" className="hover:text-white transition-colors">{t("footer_privacy")}</a>
            <a href="/terms" className="hover:text-white transition-colors">{t("footer_terms")}</a>
            <a href="/contact" className="hover:text-white transition-colors">{t("footer_contact")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
