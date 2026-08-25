"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Home, Layers, Compass, Search, ShoppingBag } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const isCartOpen = useCartStore((s) => s.isOpen);
  const setOpenCart = useCartStore((s) => s.setOpen);
  const { t, locale } = useI18n();

  const navItems = [
    {
      href: "/",
      label: t("nav_home") || (locale === "ar" ? "الرئيسية" : "Home"),
      icon: Home,
    },
    {
      href: "/shop",
      label: t("nav_shop") || (locale === "ar" ? "المتجر" : "Shop"),
      icon: Layers,
    },
    {
      href: "/track",
      label: t("nav_track") || (locale === "ar" ? "تتبع الطلب" : "Track"),
      icon: Compass,
    },
  ];

  const searchLabel = locale === "ar" ? "بحث" : "Search";
  const bagLabel = locale === "ar" ? "الحقيبة" : "Bag";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/80 bg-white/90 backdrop-blur-xl md:hidden safe-area-pb shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href && !isCartOpen;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpenCart(false)}
              className={cn(
                "flex flex-col items-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all min-w-[52px]",
                isActive ? "text-neutral-950 scale-105" : "text-neutral-400 hover:text-neutral-700"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                  isActive ? "bg-neutral-950 text-white shadow-xs" : ""
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Search button (Triggers Header Inline Search) */}
        <button
          onClick={() => {
            setOpenCart(false);
            document.dispatchEvent(new CustomEvent("open-search"));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-950 min-w-[52px] cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <span>{searchLabel}</span>
        </button>

        {/* Bag Toggle Button */}
        <button
          onClick={() => setOpenCart(!isCartOpen)}
          className={cn(
            "flex flex-col items-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wider min-w-[52px] relative transition-all cursor-pointer",
            isCartOpen ? "text-neutral-950 scale-105" : itemCount > 0 ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-700"
          )}
        >
          <div
            className={cn(
              "relative flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              isCartOpen ? "bg-neutral-950 text-white shadow-xs" : ""
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && !isCartOpen && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[9px] font-bold text-white shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span>{bagLabel}</span>
        </button>
      </div>
    </nav>
  );
}
