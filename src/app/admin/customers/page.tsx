"use client";

import { useState, useEffect } from "react";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import {
  Search,
  Users,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  ShieldCheck
} from "lucide-react";

interface OrderHistoryItem {
  id: string;
  createdAt: string;
  formattedDate: string;
  total: number;
  status: string;
  address: string;
  itemsCount: number;
  items: { productId?: string; name: string; model: string; qty: number; price: number }[];
}

interface AdminCustomer {
  phone: string;
  name: string;
  orders: number;
  totalSpend: number;
  averageOrderValue: number;
  primaryAddress: string;
  firstOrderDate: string;
  lastOrderDate: string;
  lastOrder: string;
  tier: "VIP Client" | "Returning Client" | "New Client";
  orderHistory: OrderHistoryItem[];
}

const TIER_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  "VIP Client": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  "Returning Client": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "New Client": { bg: "bg-neutral-100", text: "text-neutral-700", border: "border-neutral-200" },
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  dispatched: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.primaryAddress && c.primaryAddress.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Client Directory & Profiles
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-medium">
          Automatically compiled from customer checkout orders and WhatsApp bookings in PostgreSQL
        </p>
      </div>

      {/* Explanatory Info Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs flex items-start gap-3">
        <div className="rounded-xl border border-[#C5A869]/30 bg-[#C5A869]/10 p-2 text-[#A88B4D] shrink-0 mt-0.5">
          <Info className="h-4 w-4" />
        </div>
        <div className="space-y-1 text-xs text-neutral-600">
          <p className="font-bold text-neutral-950">
            How are Customer Profiles created?
          </p>
          <p className="leading-relaxed">
            Profiles are automatically generated and linked by verified phone number whenever a client places an order on CASELÉ. Click on any client row or <strong className="text-neutral-950">"View Profile"</strong> to open their complete dossier, lifetime spend, and item purchase history.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by client name, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono font-medium">
          {filtered.length} verified client{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Table or Shimmer Skeleton */}
      {loading ? (
        <AdminTableSkeleton rows={5} cols={6} />
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3.5">Client Profile</th>
                  <th className="px-4 py-3.5">Tier Status</th>
                  <th className="px-4 py-3.5">Phone Number</th>
                  <th className="px-4 py-3.5">Total Orders</th>
                  <th className="px-4 py-3.5">Lifetime Spend</th>
                  <th className="px-4 py-3.5">Last Active</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="space-y-2">
                        <Users className="h-6 w-6 text-neutral-300 mx-auto" />
                        <p className="text-xs text-neutral-500 font-medium">No customer profiles in database yet.</p>
                        <p className="text-[11px] text-neutral-400">When shoppers complete orders, their profiles and spend history will automatically be logged here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer) => {
                    const tierBadge = TIER_BADGES[customer.tier] || {
                      bg: "bg-neutral-100",
                      text: "text-neutral-700",
                      border: "border-neutral-200",
                    };

                    return (
                      <tr
                        key={customer.phone}
                        onClick={() => setSelectedCustomer(customer)}
                        className="hover:bg-neutral-50/70 transition-colors cursor-pointer group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-800 shrink-0">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-neutral-950 group-hover:text-[#A88B4D] transition-colors">
                                {customer.name}
                              </span>
                              <p className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                                {customer.primaryAddress}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${tierBadge.bg} ${tierBadge.text} ${tierBadge.border}`}
                          >
                            {customer.tier === "VIP Client" && <Sparkles className="h-2.5 w-2.5" />}
                            {customer.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-neutral-600 font-mono font-medium">
                          {customer.phone}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-700 font-mono font-semibold">
                          {customer.orders} {customer.orders === 1 ? "order" : "orders"}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-neutral-950">
                          QR {customer.totalSpend.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-500 font-medium">
                          {customer.lastOrder}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white transition-all shadow-2xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                            }}
                          >
                            <span>View Profile</span>
                            <ChevronRight className="h-3.5 w-3.5" />
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
      )}

      {/* ═══ CUSTOMER PROFILE SLIDE-OVER DRAWER / MODAL ═══ */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-neutral-950/40 backdrop-blur-xs animate-fade-in">
          {/* Backdrop dismiss */}
          <div className="absolute inset-0" onClick={() => setSelectedCustomer(null)} />

          {/* Drawer Content */}
          <div className="relative z-10 h-full w-full max-w-xl bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            {/* Drawer Header */}
            <div className="border-b border-neutral-100 p-6 flex items-start justify-between bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center text-lg font-bold shadow-md">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-950">{selectedCustomer.name}</h2>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        TIER_BADGES[selectedCustomer.tier]?.bg || "bg-neutral-100"
                      } ${TIER_BADGES[selectedCustomer.tier]?.text || "text-neutral-700"} ${
                        TIER_BADGES[selectedCustomer.tier]?.border || "border-neutral-200"
                      }`}
                    >
                      {selectedCustomer.tier}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{selectedCustomer.phone}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer shadow-2xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Lifetime Stats KPI Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Lifetime Spend
                  </span>
                  <p className="text-base font-bold text-neutral-950">
                    QR {selectedCustomer.totalSpend.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Total Orders
                  </span>
                  <p className="text-base font-bold text-neutral-950">
                    {selectedCustomer.orders}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Avg Order (AOV)
                  </span>
                  <p className="text-base font-bold text-neutral-950">
                    QR {selectedCustomer.averageOrderValue}
                  </p>
                </div>
              </div>

              {/* Delivery Address & Client Since */}
              <div className="rounded-xl border border-neutral-200/80 bg-white p-4 space-y-3 shadow-2xs">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <MapPin className="h-4 w-4 text-[#A88B4D] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-950">Delivery Destination (Qatar):</span>
                    <p className="text-neutral-600 mt-0.5">{selectedCustomer.primaryAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>
                    Client Since:{" "}
                    <strong className="text-neutral-800">
                      {new Date(selectedCustomer.firstOrderDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Chronological Order History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                    Order History ({selectedCustomer.orderHistory?.length || 0})
                  </h3>
                  <span className="text-[11px] text-neutral-400">PostgreSQL DB Records</span>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {selectedCustomer.orderHistory?.map((order) => {
                    const statusBadge = STATUS_CONFIG[order.status] || {
                      bg: "bg-neutral-100",
                      text: "text-neutral-700",
                      border: "border-neutral-200",
                    };

                    return (
                      <div
                        key={order.id}
                        className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-2.5 hover:border-neutral-300 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-neutral-950">{order.id}</span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-neutral-950">QR {order.total}</span>
                        </div>

                        <p className="text-[11px] text-neutral-400 font-mono">{order.formattedDate}</p>

                        {/* Items preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="pt-2 border-t border-neutral-200/60 space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs text-neutral-600">
                                <span>
                                  {item.qty}x {item.name} <span className="text-neutral-400 font-mono">({item.model})</span>
                                </span>
                                <span className="font-mono text-neutral-800 font-medium">QR {item.price * (item.qty || 1)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-neutral-200 bg-neutral-50 p-4 flex items-center gap-3">
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${selectedCustomer.name}, this is CASELÉ Atelier Qatar regarding your order.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
              >
                <Phone className="h-4 w-4" />
                <span>Call Client</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
