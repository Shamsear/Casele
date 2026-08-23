"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/promo/announcement-bar";
import { ToastProvider } from "@/components/ui/toast";
import { I18nProvider } from "@/lib/i18n/context";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <ToastProvider>
        <AnnouncementBar />
        <ScrollProgress />
        <Header />
        <CartDrawer />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </ToastProvider>
    </I18nProvider>
  );
}
