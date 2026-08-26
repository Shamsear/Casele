"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { CartBubble } from "@/components/cart/cart-bubble";
import { SearchBar } from "@/components/search/search-bar";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useI18n } from "@/lib/i18n/context";
import { useWishlistStore } from "@/lib/store/wishlist";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/seo";

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const navLinks = [
    { href: "/", label: t("nav_home") || "Home" },
    { href: "/shop", label: t("nav_shop") || "Collection" },
    { href: "/track", label: t("nav_track") || "Track Order" },
    { href: "/about", label: t("nav_about") || "About" },
  ];

  return (
    <header className="sticky top-0 z-40 hidden md:block border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl saturate-180 shadow-2xs transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo size="md" showLocation={true} />

        {/* Minimal Navigation with animated underline */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-xs font-bold uppercase tracking-widest transition-colors duration-200",
                  isActive
                    ? "text-neutral-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-950"
                    : "text-neutral-700 hover:text-neutral-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-neutral-950 after:transition-all after:duration-200"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <SearchBar />

          {/* Instagram Link */}
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow CASELÉ on Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 shadow-2xs cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>

          {/* Wishlist Link */}
          <Link
            href="/shop"
            aria-label="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 shadow-2xs cursor-pointer"
          >
            <Heart className="h-4 w-4 text-neutral-900" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A869] text-[9px] font-bold text-neutral-950 shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          <LanguageToggle />
          <CartBubble />
        </div>
      </div>
    </header>
  );
}
