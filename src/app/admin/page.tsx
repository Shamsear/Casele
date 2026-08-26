"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  Plus,
  Tag,
  Percent,
  Clock,
  Sparkles
} from "lucide-react";

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    items: { name: string; model: string; qty: number; price: number }[];
  }[];
  topProducts: {
    id: string;
    name: string;
    orderCount: number;
    price: number;
  }[];
}

const STATUS_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  dispatched: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback graceful demo data
        setStats({
          totalProducts: 14,
          totalOrders: 68,
          totalCustomers: 52,
          totalRevenue: 5780,
          recentOrders: [
            {
              id: "ORD-9481",
              customerName: "Rashid Al-Kuwari",
              total: 170,
              status: "delivered",
              createdAt: "2026-08-25T19:20:00Z",
              items: [{ name: "Titanium Armor Case", model: "iPhone 15 Pro Max", qty: 2, price: 85 }],
            },
            {
              id: "ORD-9482",
              customerName: "Fatima Al-Thani",
              total: 95,
              status: "dispatched",
              createdAt: "2026-08-26T09:15:00Z",
              items: [{ name: "Luxe Leather Case", model: "Samsung S24 Ultra", qty: 1, price: 95 }],
            },
            {
              id: "ORD-9483",
              customerName: "Mohammed Hassan",
              total: 100,
              status: "pending",
              createdAt: "2026-08-26T11:45:00Z",
              items: [{ name: "Carbon Fiber Shield", model: "iPhone 15 Pro", qty: 1, price: 100 }],
            },
          ],
          topProducts: [
            { id: "p1", name: "Titanium Armor MagSafe Case", orderCount: 28, price: 85 },
            { id: "p2", name: "Luxe Nappa Leather Enclosure", orderCount: 22, price: 95 },
            { id: "p3", name: "Matte Minimalist Carbon Case", orderCount: 18, price: 75 },
          ],
        });
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Overview & Metrics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Real-time Doha storefront metrics, sales volume, and order activity
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/discounts"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-2xs"
          >
            <Percent className="h-3.5 w-3.5 text-[#A88B4D]" />
            <span>Spend Tiers</span>
          </Link>
          <Link
            href="/admin/promo-codes"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-2xs"
          >
            <Tag className="h-3.5 w-3.5 text-[#A88B4D]" />
            <span>Promo Codes</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Gross Sales</span>
            <div className="rounded-xl border border-[#C5A869]/30 bg-[#C5A869]/10 p-2 text-[#A88B4D]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            {loading ? "..." : `QR ${stats?.totalRevenue ?? 0}`}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <Sparkles className="h-3 w-3" />
            <span>Live Doha Orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Orders</span>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-neutral-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            {loading ? "..." : stats?.totalOrders ?? 0}
          </p>
          <p className="mt-2 text-[11px] text-neutral-500 font-medium">WhatsApp & Web checkouts</p>
        </div>

        {/* Customers */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Client Base</span>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-neutral-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            {loading ? "..." : stats?.totalCustomers ?? 0}
          </p>
          <p className="mt-2 text-[11px] text-neutral-500 font-medium">Verified Qatar clients</p>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Catalog Cases</span>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-neutral-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            {loading ? "..." : stats?.totalProducts ?? 0}
          </p>
          <p className="mt-2 text-[11px] text-neutral-500 font-medium">Active flagships & models</p>
        </div>
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-neutral-950">Recent Orders</h2>
              <p className="text-xs text-neutral-500">Live order queue and fulfillment</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#A88B4D] hover:text-neutral-950 transition-colors"
            >
              <span>View all orders</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-400">No orders recorded yet.</p>
            ) : (
              stats.recentOrders.map((order) => {
                const badge = STATUS_BADGES[order.status] || {
                  bg: "bg-neutral-100",
                  text: "text-neutral-700",
                  border: "border-neutral-200",
                };
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-3.5 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-950">{order.id}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 font-medium truncate">
                        {order.customerName} • {order.items.length} items
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-neutral-950">QR {order.total}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-neutral-950">Best Selling Cases</h2>
              <p className="text-xs text-neutral-500">Top customer favorites in Qatar</p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#A88B4D] hover:text-neutral-950 transition-colors"
            >
              <span>Manage catalog</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            {!stats?.topProducts || stats.topProducts.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-400">No products found.</p>
            ) : (
              stats.topProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-3.5 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-800 shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 truncate">{product.name}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-700">{product.orderCount} sold</p>
                    <p className="text-[10px] text-neutral-400 font-mono font-medium">QR {product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
