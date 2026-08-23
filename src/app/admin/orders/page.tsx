"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";

const SAMPLE_ORDERS = [
  { id: "ORD-248", customer: "John D.", phone: "9876543210", items: 3, total: 1299, status: "pending", time: "2m ago", address: "Mumbai" },
  { id: "ORD-247", customer: "Sarah M.", phone: "9876543211", items: 1, total: 499, status: "confirmed", time: "15m ago", address: "Delhi" },
  { id: "ORD-246", customer: "Alex K.", phone: "9876543212", items: 2, total: 899, status: "dispatched", time: "1h ago", address: "Bangalore" },
  { id: "ORD-245", customer: "Priya S.", phone: "9876543213", items: 1, total: 799, status: "delivered", time: "2h ago", address: "Chennai" },
  { id: "ORD-244", customer: "Rahul V.", phone: "9876543214", items: 4, total: 2199, status: "confirmed", time: "3h ago", address: "Pune" },
  { id: "ORD-243", customer: "Neha G.", phone: "9876543215", items: 2, total: 1098, status: "pending", time: "4h ago", address: "Hyderabad" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  dispatched: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "all", label: "All", count: SAMPLE_ORDERS.length },
    { id: "pending", label: "Pending", count: SAMPLE_ORDERS.filter((o) => o.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: SAMPLE_ORDERS.filter((o) => o.status === "confirmed").length },
    { id: "dispatched", label: "Dispatched", count: SAMPLE_ORDERS.filter((o) => o.status === "dispatched").length },
    { id: "delivered", label: "Delivered", count: SAMPLE_ORDERS.filter((o) => o.status === "delivered").length },
  ];

  const filtered = SAMPLE_ORDERS.filter((o) => {
    const matchesTab = activeTab === "all" || o.status === activeTab;
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Orders</h1>
          <p className="mt-1 text-warm-gray">Manage customer orders</p>
        </div>
        <Button variant="secondary">Export CSV</Button>
      </div>

      <Input
        placeholder="Search by name, order ID, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-warm-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="border-b border-dark-border/50 hover:bg-dark-surface/50"
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-white">{order.id}</span>
                  <p className="text-xs text-warm-gray">{order.time}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-white">{order.customer}</span>
                  <p className="text-xs text-warm-gray">{order.phone}</p>
                </td>
                <td className="px-4 py-3 text-sm text-warm-gray">{order.items}</td>
                <td className="px-4 py-3 text-sm font-medium text-gold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <a href={`/admin/orders/${order.id}`} className="text-sm text-gold hover:text-gold-light">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
