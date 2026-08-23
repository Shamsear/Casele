"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";

const SAMPLE_FLASH_SALES = [
  { id: "1", name: "Qatar National Day Sale", type: "percentage", value: 20, status: "active", startsAt: "2026-12-18", endsAt: "2026-12-21", orders: 89, revenue: "QR 1,520" },
  { id: "2", name: "Weekend Flash", type: "flat", value: 10, status: "upcoming", startsAt: "2026-08-30", endsAt: "2026-09-01", orders: 0, revenue: "QR 0" },
];

const SAMPLE_TIERS = [
  { min: 50, percent: 5, active: true },
  { min: 100, percent: 10, active: true },
  { min: 200, percent: 15, active: true },
];

export default function AdminDiscountsPage() {
  const [activeTab, setActiveTab] = useState("flash");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Discounts</h1>
          <p className="mt-1 text-warm-gray">Manage flash sales and tiered discounts</p>
        </div>
        <Button variant="cta">+ Create Sale</Button>
      </div>

      <Tabs
        tabs={[
          { id: "flash", label: "Flash Sales", count: SAMPLE_FLASH_SALES.length },
          { id: "tiered", label: "Tiered Discounts", count: SAMPLE_TIERS.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "flash" && (
        <div className="space-y-4">
          {SAMPLE_FLASH_SALES.map((sale) => (
            <div key={sale.id} className="rounded-xl border border-dark-border bg-dark-surface p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{sale.name}</h3>
                  <p className="mt-1 text-sm text-warm-gray">
                    {sale.type === "percentage" ? `${sale.value}% off` : `QR ${sale.value} off`}
                  </p>
                  <p className="mt-1 text-xs text-warm-gray">
                    {sale.startsAt} → {sale.endsAt}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    sale.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-dark-surface text-warm-gray"
                  }`}
                >
                  {sale.status}
                </span>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <span className="text-warm-gray">Orders: <span className="text-white">{sale.orders}</span></span>
                <span className="text-warm-gray">Revenue: <span className="text-gold">{sale.revenue}</span></span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Deactivate</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "tiered" && (
        <div className="rounded-xl border border-dark-border bg-dark-surface p-6">
          <h3 className="text-lg font-semibold text-white">Tiered Discount Rules</h3>
          <p className="mt-1 text-sm text-warm-gray">Automatic discounts based on cart total</p>
          <div className="mt-4 space-y-3">
            {SAMPLE_TIERS.map((tier, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-dark-surface/50 p-3">
                <span className="text-sm text-warm-gray">Spend</span>
                <span className="text-sm font-medium text-white">QR {tier.min}+</span>
                <span className="text-sm text-warm-gray">→</span>
                <span className="text-sm font-medium text-gold">{tier.percent}% off</span>
                <span className="ml-auto text-xs text-emerald-400">Active</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-4" size="sm">
            + Add Tier
          </Button>
        </div>
      )}
    </div>
  );
}
