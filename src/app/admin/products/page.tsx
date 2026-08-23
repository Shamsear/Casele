"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

const SAMPLE_PRODUCTS = [
  { id: "1", name: "Midnight Black Premium Case", price: "799", comparePrice: "999", badge: "bestseller", status: "active", stock: 45 },
  { id: "2", name: "Gold Edge Luxe Case", price: "1299", comparePrice: null, badge: "new", status: "active", stock: 30 },
  { id: "3", name: "Royal Blue Classic Case", price: "599", comparePrice: "799", badge: "sale", status: "active", stock: 12 },
  { id: "4", name: "Matte Carbon Fiber Case", price: "899", comparePrice: null, badge: null, status: "active", stock: 0 },
  { id: "5", name: "Clear Crystal Case", price: "499", comparePrice: null, badge: null, status: "draft", stock: 8 },
];

export default function AdminProductsPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">
            Products
          </h1>
          <p className="mt-1 text-warm-gray">
            Manage your product catalog
          </p>
        </div>
        <a href="/admin/products/new">
          <Button variant="cta">+ Add Product</Button>
        </a>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              view === "table"
                ? "bg-gold text-black"
                : "bg-dark-surface text-warm-gray"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setView("grid")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              view === "grid"
                ? "bg-gold text-black"
                : "bg-dark-surface text-warm-gray"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" && (
        <div className="rounded-xl border border-dark-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-surface">
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">
                  Badge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-warm-gray">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-dark-border/50 hover:bg-dark-surface/50"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gold">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="ml-2 text-xs text-warm-gray line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.badge && (
                      <span className="inline-flex items-center rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        product.stock === 0 ? "text-red-400" : "text-warm-gray"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        product.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-dark-surface text-warm-gray"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/admin/products/${product.id}`}
                      className="text-sm text-gold hover:text-gold-light"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <a
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="rounded-xl border border-dark-border bg-dark-surface p-3 transition-colors hover:border-gold/30"
            >
              <div className="aspect-square rounded-lg bg-dark-border" />
              <div className="mt-3">
                <p className="text-sm font-medium text-white line-clamp-1">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-gold">
                  {formatPrice(product.price)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
