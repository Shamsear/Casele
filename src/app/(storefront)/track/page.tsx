"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/context";

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
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-h1 font-bold text-white text-center">
        Track Your Order
      </h1>
      <p className="mt-2 text-center text-warm-gray">
        Enter your phone number to see your order status
      </p>

      <form onSubmit={handleTrack} className="mt-8 flex gap-3">
        <Input
          type="tel"
          placeholder="e.g. 97455123456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="cta" loading={loading}>
          Track
        </Button>
      </form>

      <p className="mt-3 text-center text-xs text-warm-gray/60">
        Enter the phone number you used when placing your order
      </p>

      {searched && !loading && orders.length === 0 && (
        <div className="mt-12 rounded-xl border border-dark-border bg-dark-surface p-8 text-center">
          <div className="mb-4 text-warm-gray/30"><SearchIcon size={48} /></div>
          <p className="text-warm-gray">No orders found for this phone number.</p>
          <p className="mt-2 text-sm text-warm-gray/60">
            Check the number and try again, or contact us on WhatsApp.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-dark-border bg-dark-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{order.id}</span>
                <span className="text-xs text-warm-gray">
                  {new Date(order.createdAt).toLocaleDateString("en-QA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Status stepper */}
              <div className="mt-6 flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const currentIdx = statusSteps.indexOf(order.status);
                  const isComplete = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            isComplete
                              ? "bg-gold text-black"
                              : "bg-dark-border text-warm-gray"
                          } ${isCurrent ? "ring-2 ring-gold/30" : ""}`}
                        >
                          {isComplete ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          ) : i + 1}
                        </div>
                        <span className="mt-1 text-[10px] text-warm-gray">
                          {statusLabels[step]}
                        </span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div
                          className={`mx-1 h-0.5 flex-1 ${
                            i < currentIdx ? "bg-gold" : "bg-dark-border"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Items */}
              <div className="mt-6 border-t border-dark-border pt-4">
                {order.items.map((item: OrderItem, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white">
                      {item.name} ({item.model}) × {item.qty}
                    </span>
                    <span className="text-warm-gray">{formatPrice(item.price)}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between border-t border-dark-border pt-3">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-display text-lg font-semibold text-gold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {order.status === "delivered" && (
                <Button variant="secondary" className="mt-4 w-full">
                  Re-order these items
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
