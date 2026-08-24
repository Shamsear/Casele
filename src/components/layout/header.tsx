"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { CartBubble } from "@/components/cart/cart-bubble";
import { SearchBar } from "@/components/search/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/shop", label: t("nav_shop") },
    { href: "/track", label: t("nav_track") },
  ];

  return (
    <header className="sticky top-0 z-40 hidden md:block border-b border-dark-border bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo size="sm" />

        {/* Minimal Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold uppercase tracking-widest transition-colors py-1",
                pathname === link.href
                  ? "text-white border-b-2 border-gold"
                  : "text-warm-gray hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <LanguageToggle />
          <ThemeToggle />
          <CartBubble />
        </div>
      </div>
    </header>
  );
}
