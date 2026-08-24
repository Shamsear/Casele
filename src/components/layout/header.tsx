"use client";

import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav_home") },
    { href: "/shop", label: t("nav_shop") },
    { href: "/track", label: t("nav_track") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden md:block border-b backdrop-blur-xl transition-all duration-500",
        scrolled
          ? "border-dark-border/50 bg-black/90 shadow-lg shadow-black/10"
          : "border-transparent bg-black/50"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8 transition-all duration-500",
          scrolled ? "h-14" : "h-16"
        )}
      >
        {/* Logo */}
        <Logo size="sm" />

        {/* Nav with animated underlines */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "animated-underline relative text-sm font-medium transition-colors duration-300 py-1",
                pathname === link.href
                  ? "text-white active"
                  : "text-warm-gray hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <SearchBar />
          <LanguageToggle />
          <ThemeToggle />
          <CartBubble />
        </div>
      </div>

      {/* Gold line at bottom */}
      <div className={cn(
        "h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-opacity duration-500",
        scrolled ? "opacity-100" : "opacity-0"
      )} />
    </header>
  );
}
