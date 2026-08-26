"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, ShoppingBag, MessageSquare, ExternalLink, Filter } from "lucide-react";

interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  items: number;
  total: number;
  status: string;
  time: string;
  address: string;
}

const SAMPLE_ORDERS: AdminOrder[] = [
  { id: "ORD-9481", customer: "Rashid Al-Kuwari", phone: "+974 5512 3456", items: 2, total: 170, status: "delivered", time: "10m ago", address: "The Pearl, Doha" },
  { id: "ORD-9482", customer: "Fatima Al-Thani", phone: "+974 6623 4567", items: 1, total: 95, status: "dispatched", time: "45m ago", address: "West Bay Lagoon, Doha" },
  { id: "ORD-9483", customer: "Mohammed Hassan", phone: "+974 7734 5678", items: 1, total: 100, status: "confirmed", time: "2h ago", address: "Lusail Marina, Doha" },
  { id: "ORD-9484", customer: "Sara Al-Attiyah", phone: "+974 5545 6789", items: 3, total: 245, status: "pending", time: "3h ago", address: "Al Waab, Doha" },
  { id: "ORD-9485", customer: "Hamad Al-Marri", phone: "+974 3356 7890", items: 2, total: 160, status: "pending", time: "5h ago", address: "Al Wakrah" },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  dispatched: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(SAMPLE_ORDERS);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === "all" || o.status === activeTab;
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.address.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Client Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Monitor WhatsApp and online orders, dispatch status, and client delivery addresses
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Orders", count: counts.all },
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed },
            { id: "dispatched", label: "Dispatched", count: counts.dispatched },
            { id: "delivered", label: "Delivered", count: counts.delivered },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeTab === tab.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by client name, ID, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Client</th>
                <th className="px-4 py-3.5">Delivery Destination</th>
                <th className="px-4 py-3.5">Items</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Fulfillment Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const badge = STATUS_CONFIG[order.status] || {
                    bg: "bg-neutral-100",
                    text: "text-neutral-700",
                    border: "border-neutral-200",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-neutral-950">{order.id}</span>
                        <p className="text-[10px] text-neutral-400 font-mono">{order.time}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-neutral-950">{order.customer}</span>
                        <p className="text-[11px] text-neutral-500 font-mono">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700 font-medium">
                        {order.address}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-neutral-500 font-medium">
                        {order.items} cases
                      </td>
                      <td className="px-4 py-3.5 font-bold text-neutral-950">
                        QR {order.total}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-neutral-200 bg-white text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors shadow-2xs"
                            title="Open WhatsApp Chat"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </a>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:border-neutral-300 transition-colors shadow-2xs"
                          >
                            <span>Review</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
