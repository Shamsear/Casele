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

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const navLinks = [
    { href: "/", label: t("nav_home") || "Home" },
    { href: "/shop", label: t("nav_shop") || "Collection" },
    { href: "/category/premium", label: "Luxe Series" },
    { href: "/track", label: t("nav_track") || "Track Order" },
    { href: "/about", label: "Atelier" },
  ];

  return (
    <header className="sticky top-0 z-40 hidden md:block border-b border-neutral-200/70 bg-white/80 backdrop-blur-md transition-colors duration-200">
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
                  "relative py-1 text-xs font-semibold uppercase tracking-widest transition-colors duration-200",
                  isActive
                    ? "text-neutral-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-950"
                    : "text-neutral-500 hover:text-neutral-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-neutral-950 after:transition-all after:duration-200"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <SearchBar />

          {/* Wishlist Link */}
          <Link
            href="/shop"
            aria-label="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 active:scale-95 shadow-xs"
          >
            <Heart className="h-4 w-4" />
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
