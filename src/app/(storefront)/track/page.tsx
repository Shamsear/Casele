"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { getOrdersByPhone } from "@/lib/data";

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      setOrders(getOrdersByPhone(phone.trim()));
      setLoading(false);
    }, 800);
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
      <h1 className="font-display text-h1 font-bold text-white text-center">Track Your Order</h1>
      <p className="mt-2 text-center text-warm-gray">Enter your phone number to see your order status</p>

      <form onSubmit={handleTrack} className="mt-8 flex gap-3">
        <Input type="tel" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1" />
        <Button type="submit" variant="cta" loading={loading}>Track</Button>
      </form>

      <p className="mt-3 text-center text-xs text-warm-gray/60">
        Try: 9876543210, 9876543211, 9876543212, 9876543213
      </p>

      {searched && !loading && orders.length === 0 && (
        <div className="mt-12 rounded-xl border border-dark-border bg-dark-surface p-8 text-center">
          <p className="text-warm-gray">No orders found for this phone number.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-dark-border bg-dark-surface p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{order.id}</span>
                <span className="text-xs text-warm-gray">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const currentIdx = statusSteps.indexOf(order.status);
                  const isComplete = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isComplete ? "bg-gold text-black" : "bg-dark-border text-warm-gray"} ${isCurrent ? "ring-2 ring-gold/30" : ""}`}>
                          {isComplete ? "✓" : i + 1}
                        </div>
                        <span className="mt-1 text-[10px] text-warm-gray">{statusLabels[step]}</span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`mx-1 h-0.5 flex-1 ${i < currentIdx ? "bg-gold" : "bg-dark-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-dark-border pt-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white">{item.name} ({item.model}) × {item.qty}</span>
                    <span className="text-warm-gray">{formatPrice(item.price)}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between border-t border-dark-border pt-3">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-display text-lg font-semibold text-gold">{formatPrice(order.total)}</span>
                </div>
              </div>

              {order.status === "delivered" && (
                <Button variant="secondary" className="mt-4 w-full">Re-order these items</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
