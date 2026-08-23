"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-dark-border bg-black/80 backdrop-blur-xl px-4 lg:hidden">
          <a href="/admin" className="text-lg font-display font-semibold text-gold">
            CASELÉ
          </a>
          <span className="text-sm text-warm-gray">Admin</span>
        </div>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
