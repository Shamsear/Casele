"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SAMPLE_MODELS = [
  { id: "1", brand: "iPhone", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", products: 12, active: true },
  { id: "2", brand: "iPhone", name: "iPhone 15 Pro", slug: "iphone-15-pro", products: 10, active: true },
  { id: "3", brand: "iPhone", name: "iPhone 14 Pro Max", slug: "iphone-14-pro-max", products: 8, active: true },
  { id: "4", brand: "Samsung", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", products: 8, active: true },
  { id: "5", brand: "Samsung", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", products: 7, active: true },
  { id: "6", brand: "Samsung", name: "Samsung Galaxy Z Fold5", slug: "samsung-galaxy-z-fold5", products: 5, active: true },
  { id: "7", brand: "Huawei", name: "Huawei P60 Pro", slug: "huawei-p60-pro", products: 4, active: true },
  { id: "8", brand: "OnePlus", name: "OnePlus 12", slug: "oneplus-12", products: 3, active: true },
];

export default function AdminModelsPage() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_MODELS.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Phone Models</h1>
          <p className="mt-1 text-warm-gray">Manage phone models for your cases</p>
        </div>
        <Button variant="cta">+ Add Model</Button>
      </div>

      <Input
        placeholder="Search models..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Model</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-warm-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((model) => (
              <tr key={model.id} className="border-b border-dark-border/50 hover:bg-dark-surface/50">
                <td className="px-4 py-3 text-sm text-warm-gray">{model.brand}</td>
                <td className="px-4 py-3 text-sm font-medium text-white">{model.name}</td>
                <td className="px-4 py-3 text-sm text-warm-gray">{model.products} cases</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                    Active
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
