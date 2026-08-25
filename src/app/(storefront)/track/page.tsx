"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { Search, Package, CheckCircle2, Truck, Check, MapPin, Compass } from "lucide-react";

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
  address?: string | null;
}

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { formatPrice } = useI18n();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ["pending", "confirmed", "dispatched", "delivered"];
  const statusLabels: Record<string, string> = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    delivered: "Delivered",
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 py-12 lg:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A88B4D] tracking-widest uppercase mb-1">
            <Compass className="h-3.5 w-3.5" />
            <span>Order Concierge</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-neutral-950">
            Track Your Delivery
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Enter your mobile number to view live order progress and courier status
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2.5 rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-sm">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 font-mono">+974</span>
            <input
              type="tel"
              placeholder="e.g. 55123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl bg-transparent py-2 pl-14 pr-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>

        <p className="mt-3 text-center text-[11px] text-neutral-400">
          Enter the exact phone number provided during WhatsApp checkout
        </p>

        {searched && !loading && orders.length === 0 && (
          <div className="mt-10 rounded-3xl border border-neutral-200/80 bg-white p-10 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-950">No orders found for this number</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              Please verify your phone digits or reach out to our Doha concierge directly on WhatsApp.
            </p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs"
              >
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tracking Reference</span>
                    <p className="text-sm font-bold text-neutral-950">{order.id}</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-QA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Status stepper */}
                <div className="mt-6 flex items-center justify-between px-2">
                  {statusSteps.map((step, i) => {
                    const currentIdx = statusSteps.indexOf(order.status);
                    const isComplete = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={step} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                              isComplete
                                ? "bg-neutral-950 text-white shadow-xs"
                                : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                            } ${isCurrent ? "ring-4 ring-neutral-900/10" : ""}`}
                          >
                            {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                          </div>
                          <span className={`mt-2 text-[10px] uppercase tracking-wider font-semibold text-center ${isCurrent ? "text-neutral-950" : "text-neutral-400"}`}>
                            {statusLabels[step]}
                          </span>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div
                            className={`mx-2 h-0.5 flex-1 mb-5 transition-colors ${
                              i < currentIdx ? "bg-neutral-950" : "bg-neutral-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="mt-6 border-t border-neutral-100 pt-4 space-y-2">
                  {order.items.map((item: OrderItem, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800">
                        {item.name} <span className="text-neutral-400">({item.model})</span> × {item.qty}
                      </span>
                      <span className="font-semibold text-neutral-950">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 text-sm">
                    <span className="font-bold text-neutral-950">Total Amount</span>
                    <span className="font-display text-base font-bold text-neutral-950">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
