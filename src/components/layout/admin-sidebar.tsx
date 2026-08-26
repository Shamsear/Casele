"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Layers,
  Smartphone,
  Percent,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  Activity,
  ExternalLink,
  LogOut,
  ChevronRight
} from "lucide-react";

interface NavGroup {
  group: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Catalog & Devices",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Collections", icon: Layers },
      { href: "/admin/models", label: "Phone Models", icon: Smartphone },
    ],
  },
  {
    group: "Marketing & Discounts",
    items: [
      { href: "/admin/discounts", label: "Discounts & Bundles", icon: Percent },
      { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
    ],
  },
  {
    group: "Sales & Operations",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
    ],
  },
  {
    group: "Store Configuration",
    items: [
      { href: "/admin/settings", label: "Settings & Hero", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col bg-white border-r border-neutral-200/80 text-neutral-900 selection:bg-[#C5A869]/25">
      {/* Top Header / Branding */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-neutral-200/80 bg-white">
        <Logo size="sm" />
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2 py-0.5 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
            Store Live
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {NAV_GROUPS.map((section) => (
          <div key={section.group} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              {section.group}
            </p>
            <nav className="space-y-0.5 pt-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200",
                      isActive
                        ? "bg-neutral-950 text-white shadow-xs"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-[#DFCA9B]" : "text-neutral-400 group-hover:text-neutral-900"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-3 w-3 text-neutral-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Footer Actions */}
      <div className="border-t border-neutral-200/80 p-3 space-y-1 bg-neutral-50/70">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-white hover:text-neutral-950 hover:shadow-2xs transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            View Storefront
          </span>
          <span className="text-[10px] text-neutral-400">↗</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
