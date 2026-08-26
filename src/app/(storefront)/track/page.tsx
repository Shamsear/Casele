"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Check,
  MapPin,
  Compass,
  MessageSquare,
  Clock,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface OrderItem {
  name: string;
  model: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  address?: string | null;
  notes?: string | null;
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { formatPrice } = useI18n();

  useEffect(() => {
    const idParam = searchParams.get("id");
    const phoneParam = searchParams.get("phone");

    if (idParam) {
      setQuery(idParam);
      executeSearch(idParam, "id");
    } else if (phoneParam) {
      setQuery(phoneParam);
      executeSearch(phoneParam, "phone");
    }
  }, [searchParams]);

  const executeSearch = async (val: string, type: "id" | "phone" | "auto") => {
    if (!val.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      let endpoint = `/api/orders/track?`;
      if (type === "id" || val.includes("-") || val.length > 15) {
        endpoint += `id=${encodeURIComponent(val.trim())}`;
      } else {
        endpoint += `phone=${encodeURIComponent(val.trim())}`;
      }

      const res = await fetch(endpoint);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, "auto");
  };

  const statusSteps = [
    { key: "pending", label: "Order Received", desc: "Order details logged in Atelier" },
    { key: "confirmed", label: "Confirmed", desc: "Cases verified & packaged" },
    { key: "dispatched", label: "Out for Delivery", desc: "Courier on the way in Doha" },
    { key: "delivered", label: "Delivered", desc: "Handed over to customer" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 lg:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1">
            <Compass className="h-3.5 w-3.5" />
            <span>CASELÉ Concierge Service</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-950">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            Track same-day delivery progress across Doha, The Pearl, Lusail, and Qatar
          </p>
        </div>

        {/* Tracking Search Input */}
        <form onSubmit={handleTrack} className="flex gap-2.5 rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-sm">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Enter phone number or Order Reference ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-xl bg-transparent py-2 pl-10 pr-3 text-xs sm:text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-5 sm:px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>

        <p className="mt-2.5 text-center text-[11px] text-neutral-400">
          Enter your WhatsApp phone digits or the order reference ID received in your confirmation message.
        </p>

        {/* Empty Result State */}
        {searched && !loading && orders.length === 0 && (
          <div className="mt-8 rounded-3xl border border-neutral-200/80 bg-white p-10 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-950">No orders found</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              Please double check your phone number or Order ID. If you placed an order via WhatsApp, our concierge is available 24/7.
            </p>
            <a
              href="https://wa.me/97455000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Contact Concierge on WhatsApp</span>
            </a>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="mt-8 space-y-6">
            {orders.map((order) => {
              const currentStepIdx = statusSteps.findIndex((s) => s.key === order.status);
              const activeIdx = currentStepIdx === -1 ? 0 : currentStepIdx;

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6"
                >
                  {/* Order Reference Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#A88B4D] uppercase tracking-wider">
                          Verified Order
                        </span>
                        <span className="h-1 w-1 rounded-full bg-neutral-300" />
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {new Date(order.createdAt).toLocaleDateString("en-QA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="font-mono text-base font-bold text-neutral-950 mt-0.5">
                        #{order.id}
                      </p>
                    </div>

                    {/* Delivery Method Badge */}
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C5A869]/10 px-3 py-1 text-xs font-semibold text-[#A88B4D] border border-[#C5A869]/20">
                        <Truck className="h-3.5 w-3.5" />
                        <span>Doha Same-Day Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Status Stepper */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      {statusSteps.map((step, i) => {
                        const isComplete = i <= activeIdx;
                        const isCurrent = i === activeIdx;
                        return (
                          <div key={step.key} className="flex flex-1 items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                  isComplete
                                    ? "bg-neutral-950 text-white shadow-xs"
                                    : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                                } ${isCurrent ? "ring-4 ring-[#C5A869]/30" : ""}`}
                              >
                                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                              </div>
                              <span
                                className={`mt-2 text-[10px] uppercase tracking-wider font-semibold text-center ${
                                  isCurrent ? "text-neutral-950 font-bold" : "text-neutral-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div
                                className={`mx-2 h-0.5 flex-1 mb-5 transition-colors ${
                                  i < activeIdx ? "bg-neutral-950" : "bg-neutral-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Location & Instructions */}
                  <div className="rounded-2xl bg-neutral-50/70 border border-neutral-200/80 p-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 text-neutral-700">
                      <MapPin className="h-4 w-4 text-[#A88B4D] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-neutral-950">Destination Address:</span>
                        <p className="text-neutral-600 mt-0.5">{order.address || "Doha, Qatar"}</p>
                      </div>
                    </div>
                    {order.notes && (
                      <p className="text-neutral-500 text-[11px] pt-1 border-t border-neutral-200/60 font-mono">
                        Note: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Purchased Items List */}
                  <div className="border-t border-neutral-100 pt-4 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Order Summary
                    </span>
                    {order.items.map((item: OrderItem, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-800">
                          {item.name} <span className="text-neutral-400">({item.model})</span> × {item.qty}
                        </span>
                        <span className="font-semibold text-neutral-950">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 text-sm">
                      <span className="font-bold text-neutral-950">Total Amount</span>
                      <span className="font-display text-lg font-bold text-neutral-950">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Direct Concierge Help */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/97455000000?text=${encodeURIComponent(
                        `Hello CASELÉ Concierge, I am inquiring about my order #${order.id}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
                    >
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                      <span>Contact Delivery Courier via WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <TrackPageContent />
    </Suspense>
  );
}
