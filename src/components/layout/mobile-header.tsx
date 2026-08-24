"use client";

import { Logo } from "@/components/brand/logo";
import { CartBubble } from "@/components/cart/cart-bubble";
import { SearchBar } from "@/components/search/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 md:hidden border-b border-dark-border/50 bg-black/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Logo size="sm" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <LanguageToggle />
          <ThemeToggle />
          <CartBubble />
        </div>
      </div>
    </header>
  );
}
