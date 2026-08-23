"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

const STATS = [
  { label: "Revenue", value: "QR 8,942", change: "+12%", up: true },
  { label: "Orders", value: "248", change: "+8%", up: true },
  { label: "Avg Order", value: "QR 36", change: "+3%", up: true },
  { label: "Promo Used", value: "42", change: "+15%", up: true },
];

const RECENT_ORDERS = [
  { id: "ORD-248", customer: "Mohammed A.", items: 3, total: 129, status: "pending", time: "2m ago" },
  { id: "ORD-247", customer: "Fatima K.", items: 1, total: 49, status: "confirmed", time: "15m ago" },
  { id: "ORD-246", customer: "Ahmed S.", items: 2, total: 89, status: "dispatched", time: "1h ago" },
  { id: "ORD-245", customer: "Sara M.", items: 1, total: 79, status: "delivered", time: "2h ago" },
  { id: "ORD-244", customer: "Omar H.", items: 4, total: 219, status: "confirmed", time: "3h ago" },
];

const TOP_PRODUCTS = [
  { name: "Midnight Black Premium", revenue: "QR 1,240", orders: 89 },
  { name: "Gold Edge Luxe", revenue: "QR 920", orders: 34 },
  { name: "Royal Blue Classic", revenue: "QR 710", orders: 67 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  dispatched: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-h1 font-bold text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-warm-gray">
          Welcome back. Here&apos;s your store overview.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-dark-border bg-dark-surface p-4"
          >
            <p className="text-sm text-warm-gray">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {stat.value}
            </p>
            <p
              className={`mt-1 text-xs font-medium ${
                stat.up ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <div className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
        <p className="text-sm text-warm-gray">Last 30 days</p>
        <div className="mt-4 flex h-48 items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gold/30 transition-all hover:bg-gold/50"
              style={{
                height: `${20 + Math.random() * 80}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="rounded-xl border border-dark-border bg-dark-surface p-6">
          <h2 className="text-lg font-semibold text-white">Top Products</h2>
          <div className="mt-4 space-y-3">
            {TOP_PRODUCTS.map((product, i) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-border text-xs text-warm-gray">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gold">
                    {product.revenue}
                  </p>
                  <p className="text-xs text-warm-gray">
                    {product.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-xl border border-dark-border bg-dark-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <a
              href="/admin/orders"
              className="text-sm text-gold hover:text-gold-light"
            >
              View all →
            </a>
          </div>
          <div className="mt-4 space-y-3">
            {RECENT_ORDERS.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-dark-surface/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {order.id}
                  </p>
                  <p className="text-xs text-warm-gray">
                    {order.customer} • {order.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gold">
                    {formatPrice(order.total)}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      STATUS_COLORS[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
