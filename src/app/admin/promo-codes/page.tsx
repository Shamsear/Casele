"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

const SAMPLE_PROMOS = [
  { id: "1", code: "WELCOME10", type: "percentage", value: 10, uses: 42, maxUses: 100, minOrder: 50, active: true },
  { id: "2", code: "FLAT10QR", type: "flat", value: 10, uses: 15, maxUses: null, minOrder: 80, active: true },
  { id: "3", code: "SUMMER20", type: "percentage", value: 20, uses: 0, maxUses: 50, minOrder: 100, active: false },
];

export default function AdminPromoCodesPage() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_PROMOS.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Promo Codes</h1>
          <p className="mt-1 text-warm-gray">Create and manage discount codes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Bulk Generate</Button>
          <Button variant="cta">+ Create Code</Button>
        </div>
      </div>

      <Input
        placeholder="Search codes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Discount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Min Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Uses</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-warm-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((promo) => (
              <tr key={promo.id} className="border-b border-dark-border/50 hover:bg-dark-surface/50">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-gold">{promo.code}</span>
                </td>
                <td className="px-4 py-3 text-sm text-white">
                  {promo.type === "percentage" ? `${promo.value}%` : `QR ${promo.value}`}
                </td>
                <td className="px-4 py-3 text-sm text-warm-gray">QR {promo.minOrder}</td>
                <td className="px-4 py-3 text-sm text-warm-gray">
                  {promo.uses}{promo.maxUses ? ` / ${promo.maxUses}` : ""}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      promo.active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-dark-surface text-warm-gray"
                    }`}
                  >
                    {promo.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-gold hover:text-gold-light">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
