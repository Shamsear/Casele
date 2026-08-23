"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchBar } from "@/components/search/search-bar";
import { AnnouncementBar } from "@/components/promo/announcement-bar";
import { ToastProvider } from "@/components/ui/toast";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AnnouncementBar />
      <ScrollProgress />
      <Header />
      <SearchBar />
      <CartDrawer />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </ToastProvider>
  );
}
