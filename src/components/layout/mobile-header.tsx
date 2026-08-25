"use client";

import { Logo } from "@/components/brand/logo";
import { CartBubble } from "@/components/cart/cart-bubble";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { Search } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 md:hidden border-b border-neutral-200/70 bg-white/85 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Logo size="sm" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              document.dispatchEvent(new CustomEvent("open-search"));
            }}
            aria-label="Search cases"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-600 hover:text-neutral-950 transition-colors shadow-xs"
          >
            <Search className="h-4 w-4" />
          </button>
          <LanguageToggle />
          <CartBubble />
        </div>
      </div>
    </header>
  );
}
