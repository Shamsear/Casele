"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, LayoutGrid, List, Tag, Eye, Edit2, Package, Sparkles } from "lucide-react";

interface AdminProduct {
  id: string;
  name: string;
  price: string | number;
  comparePrice?: string | number | null;
  badge?: string | null;
  status: string;
  stock: number;
  images?: string[];
  categoryName?: string;
}

const SAMPLE_PRODUCTS: AdminProduct[] = [
  { id: "1", name: "Titanium Armor MagSafe Case", price: "85", comparePrice: "110", badge: "bestseller", status: "active", stock: 45, images: ["/products/leather-case-black.png"], categoryName: "Luxe Series" },
  { id: "2", name: "Gold Edge Bespoke Case", price: "95", comparePrice: null, badge: "new", status: "active", stock: 30, images: ["/products/leather-case-saddle.png"], categoryName: "Designer Atelier" },
  { id: "3", name: "Midnight Nappa Leather Case", price: "80", comparePrice: "100", badge: "sale", status: "active", stock: 12, images: ["/products/leather-case-blue.png"], categoryName: "Classic" },
  { id: "4", name: "Matte Carbon Fiber Enclosure", price: "75", comparePrice: null, badge: null, status: "active", stock: 18, images: ["/products/carbon-case.png"], categoryName: "Sport" },
  { id: "5", name: "Ultra-Clear Anti-Yellow Shield", price: "65", comparePrice: null, badge: null, status: "active", stock: 24, images: ["/products/clear-case.png"], categoryName: "Classic" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(SAMPLE_PRODUCTS);
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              comparePrice: p.comparePrice,
              badge: p.badge,
              status: "active",
              stock: p.models?.reduce((acc: number, m: any) => acc + (m.stock || 0), 0) || 25,
              images: p.images || ["/products/leather-case-black.png"],
              categoryName: p.categoryName || "Collection",
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Product Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            Create, edit, and monitor pricing, stock, and promotional badges
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C5A869] to-[#DFCA9B] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-md shadow-[#C5A869]/20 hover:brightness-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by case name or collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-neutral-500 focus:border-[#C5A869] focus:outline-none focus:ring-1 focus:ring-[#C5A869]/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-neutral-800 bg-neutral-900 p-1">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                view === "table"
                  ? "bg-[#C5A869]/20 text-[#DFCA9B]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                view === "grid"
                  ? "bg-[#C5A869]/20 text-[#DFCA9B]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-4 py-3.5">Collection</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Badge</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden p-1">
                        <Image
                          src={product.images?.[0] || "/products/leather-case-black.png"}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-white">{product.name}</span>
                        <p className="text-[10px] text-neutral-500 font-mono">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-400 font-medium">
                    {product.categoryName || "Cases"}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-white">
                    <span className="text-[#DFCA9B]">QR {product.price}</span>
                    {product.comparePrice && (
                      <span className="ml-2 text-[10px] text-neutral-500 line-through">
                        QR {product.comparePrice}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {product.badge ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#C5A869]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#DFCA9B] border border-[#C5A869]/20">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`font-mono font-semibold ${
                        product.stock === 0 ? "text-rose-400" : product.stock < 10 ? "text-amber-400" : "text-neutral-300"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4 transition-all hover:border-[#C5A869]/40 hover:bg-neutral-900/90"
            >
              <div className="relative aspect-square w-full rounded-xl bg-neutral-950 border border-neutral-800/80 p-3 flex items-center justify-center overflow-hidden">
                <Image
                  src={product.images?.[0] || "/products/leather-case-black.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 rounded-full bg-[#C5A869] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-neutral-950 shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#DFCA9B]">QR {product.price}</p>
                  <span className="text-[10px] text-neutral-500 font-mono">{product.stock} in stock</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
