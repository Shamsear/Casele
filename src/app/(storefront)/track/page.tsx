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
  Sparkles,
  Calendar,
  Zap,
  X
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
  deliverySpeed?: string;
  createdAt: string;
  updatedAt: string;
  address?: string | null;
  notes?: string | null;
}

const DELIVERY_SPEED_CONFIG: Record<
  string,
  { label: string; icon: any; bg: string; text: string; border: string; desc: string }
> = {
  same_day: {
    label: "Doha Same-Day Delivery",
    icon: Zap,
    bg: "bg-[#C5A869]/10",
    text: "text-[#A88B4D]",
    border: "border-[#C5A869]/20",
    desc: "Courier on the way for same-day delivery in Doha",
  },
  next_day: {
    label: "Next-Day Qatar Delivery",
    icon: Clock,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    desc: "Dispatched for next-day delivery across Qatar",
  },
  standard: {
    label: "Standard Delivery (1-2 Days)",
    icon: Truck,
    bg: "bg-neutral-100",
    text: "text-neutral-700",
    border: "border-neutral-200",
    desc: "Courier delivering within 1-2 business days",
  },
  express: {
    label: "Express 2-Hour VIP Delivery",
    icon: Sparkles,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    desc: "Priority VIP courier dispatched (within 2 hours)",
  },
  scheduled: {
    label: "Scheduled Delivery",
    icon: Calendar,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    desc: "Courier scheduled for delivery on your requested date/time",
  },
};

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+97455364455");
  const { formatPrice } = useI18n();

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.whatsapp_number) {
          setWhatsappNumber(data.settings.whatsapp_number);
        }
      })
      .catch(() => {});
  }, []);

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
            Track real-time delivery progress across Doha, The Pearl, Lusail, and Qatar
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
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
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
              const speedConfig = DELIVERY_SPEED_CONFIG[order.deliverySpeed || "same_day"] || DELIVERY_SPEED_CONFIG.same_day;
              const SpeedIcon = speedConfig.icon;

              const statusSteps = [
                { key: "pending", label: "Order Received", desc: "Order logged in Atelier" },
                { key: "confirmed", label: "Confirmed", desc: "Cases verified & packaged" },
                { key: "dispatched", label: "Out for Delivery", desc: speedConfig.desc },
                { key: "delivered", label: "Delivered", desc: "Handed over to customer" },
              ];

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

                    {/* Dynamic Delivery Speed / Method Badge */}
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${speedConfig.bg} ${speedConfig.text} ${speedConfig.border}`}>
                        <SpeedIcon className="h-3.5 w-3.5" />
                        <span>{speedConfig.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner or Stepper */}
                  {order.status === "cancelled" ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 space-y-1 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                        <X className="h-4 w-4" />
                        <span>Order Cancelled</span>
                      </div>
                      <p className="text-xs text-rose-700">
                        This order was cancelled per customer request on WhatsApp.
                      </p>
                    </div>
                  ) : (
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
                  )}

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
                      href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
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
