"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SAMPLE_CATEGORIES = [
  { id: "1", name: "Classic", slug: "classic", products: 8, salePercent: null, active: true },
  { id: "2", name: "Premium", slug: "premium", products: 12, salePercent: 15, active: true },
  { id: "3", name: "Sport", slug: "sport", products: 6, salePercent: null, active: true },
  { id: "4", name: "Designer", slug: "designer", products: 4, salePercent: 10, active: true },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Categories</h1>
          <p className="mt-1 text-warm-gray">Manage product collections</p>
        </div>
        <Button variant="cta">+ Add Category</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE_CATEGORIES.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-dark-border bg-dark-surface p-4">
            <h3 className="font-semibold text-white">{cat.name}</h3>
            <p className="mt-1 text-sm text-warm-gray">{cat.products} products</p>
            {cat.salePercent && (
              <p className="mt-2 text-sm text-gold">{cat.salePercent}% sale active</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
