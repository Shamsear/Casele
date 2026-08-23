"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

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

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  dispatched: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
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
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-warm-gray">Loading...</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-dark-border bg-dark-surface p-4 animate-pulse">
              <div className="h-4 w-20 rounded bg-dark-border" />
              <div className="mt-2 h-8 w-24 rounded bg-dark-border" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-warm-gray">
            Could not load dashboard data. Make sure the database is connected.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Revenue", value: formatPrice(stats.totalRevenue), change: "" },
    { label: "Orders", value: String(stats.totalOrders), change: "" },
    { label: "Customers", value: String(stats.totalCustomers), change: "" },
    { label: "Products", value: String(stats.totalProducts), change: "" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-h1 font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-warm-gray">Welcome back. Here&apos;s your store overview.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-dark-border bg-dark-surface p-4"
          >
            <p className="text-sm text-warm-gray">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="rounded-xl border border-dark-border bg-dark-surface p-6">
          <h2 className="text-lg font-semibold text-white">Top Products</h2>
          <div className="mt-4 space-y-3">
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-warm-gray">No products yet.</p>
            ) : (
              stats.topProducts.map((product, i) => (
                <div
                  key={product.id}
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
                      {product.orderCount} orders
                    </p>
                  </div>
                </div>
              ))
            )}
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
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-warm-gray">No orders yet.</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg bg-dark-surface/50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{order.id}</p>
                    <p className="text-xs text-warm-gray">
                      {order.customerName} • {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gold">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        STATUS_COLORS[order.status] || ""
                      }`}
                    >
                      {order.status}
                    </span>
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
