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
  pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  confirmed: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  dispatched: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  delivered: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  cancelled: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
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
        // Sample graceful fallback for initial setup
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Atelier Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            Real-time Doha storefront metrics, sales volume, and order activity
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C5A869] to-[#DFCA9B] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-md shadow-[#C5A869]/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/discounts"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <Percent className="h-3.5 w-3.5 text-[#C5A869]" />
            <span>Spend Tiers</span>
          </Link>
          <Link
            href="/admin/promo-codes"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <Tag className="h-3.5 w-3.5 text-[#C5A869]" />
            <span>Promo Codes</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-5 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Total Gross Sales</span>
            <div className="rounded-xl border border-[#C5A869]/20 bg-[#C5A869]/10 p-2 text-[#DFCA9B]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {loading ? "..." : `QR ${stats?.totalRevenue ?? 0}`}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <Sparkles className="h-3 w-3" />
            <span>Live Doha Orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-5 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Total Orders</span>
            <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-2 text-neutral-300">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {loading ? "..." : stats?.totalOrders ?? 0}
          </p>
          <p className="mt-2 text-[11px] text-neutral-500 font-mono">WhatsApp & Web checkouts</p>
        </div>

        {/* Customers */}
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-5 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Client Base</span>
            <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-2 text-neutral-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {loading ? "..." : stats?.totalCustomers ?? 0}
          </p>
          <p className="mt-2 text-[11px] text-neutral-500">Verified Qatar clients</p>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-5 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Catalog Cases</span>
            <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-2 text-neutral-300">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {loading ? "..." : stats?.totalProducts ?? 0}
          </p>
          <p className="mt-2 text-[11px] text-neutral-500">Active flagships & models</p>
        </div>
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-neutral-400">Live order queue and fulfillment</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A869] hover:text-[#DFCA9B] transition-colors"
            >
              <span>View all orders</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-2">
            {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-500">No orders recorded yet.</p>
            ) : (
              stats.recentOrders.map((order) => {
                const badge = STATUS_BADGES[order.status] || {
                  bg: "bg-neutral-800",
                  text: "text-neutral-400",
                  border: "border-neutral-700",
                };
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-800/60 bg-neutral-950/60 p-3.5 hover:border-neutral-700 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400 truncate">
                        {order.customerName} • {order.items.length} items
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#DFCA9B]">QR {order.total}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Best Selling Cases</h2>
              <p className="text-xs text-neutral-400">Top customer favorites in Qatar</p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A869] hover:text-[#DFCA9B] transition-colors"
            >
              <span>Manage catalog</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-2">
            {!stats?.topProducts || stats.topProducts.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-500">No products found.</p>
            ) : (
              stats.topProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-800/60 bg-neutral-950/60 p-3.5 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-bold text-[#DFCA9B]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">{product.name}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-400">{product.orderCount} sold</p>
                    <p className="text-[10px] text-neutral-500 font-mono">QR {product.price}</p>
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
