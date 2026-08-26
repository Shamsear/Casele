"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Menu, X, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render clean standalone full-screen page WITHOUT sidebar or navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex selection:bg-[#C5A869]/30 selection:text-white">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-Out Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-neutral-950 transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
          <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800/80 bg-neutral-950/85 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-xl lg:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wide text-white">
                Admin Atelier
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-[10px] font-mono text-neutral-400">
                <ShieldCheck className="h-3 w-3 text-[#C5A869]" />
                Doha Node
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
