"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminTableSkeleton, AdminGridSkeleton } from "@/components/admin/admin-skeletons";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, LayoutGrid, List, Tag, Eye, Edit2, Package, Sparkles, Inbox } from "lucide-react";

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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              comparePrice: p.comparePrice,
              badge: p.badge,
              status: "active",
              stock: p.models?.reduce((acc: number, m: any) => acc + (m.stock || 0), 0) || 0,
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Product Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Manage your case collection, live pricing, stock inventory, and badges
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Case</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search cases or collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 shadow-2xs">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                view === "table"
                  ? "bg-neutral-950 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                view === "grid"
                  ? "bg-neutral-950 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shimmer Skeleton or Real Content */}
      {loading ? (
        view === "table" ? (
          <AdminTableSkeleton rows={6} cols={7} />
        ) : (
          <AdminGridSkeleton cards={8} />
        )
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center space-y-3 shadow-2xs">
          <Package className="h-8 w-8 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-neutral-950 text-sm">No Products Found in Database</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Get started by adding your first luxury case silhouette to your catalog.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Product</span>
          </Link>
        </div>
      ) : view === "table" ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Collection</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Badge</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-xl bg-neutral-100 border border-neutral-200/60 overflow-hidden p-1">
                          <Image
                            src={product.images?.[0] || "/products/leather-case-black.png"}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-950">{product.name}</span>
                          <p className="text-[10px] text-neutral-400 font-mono">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 font-medium">
                      {product.categoryName || "Cases"}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-neutral-950">
                      <span>QR {product.price}</span>
                      {product.comparePrice && (
                        <span className="ml-2 text-[10px] text-neutral-400 font-normal line-through">
                          QR {product.comparePrice}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {product.badge ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-900 border border-neutral-200 shadow-2xs">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`font-mono font-semibold ${
                          product.stock === 0 ? "text-rose-600" : product.stock < 10 ? "text-amber-600" : "text-neutral-700"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:border-neutral-300 transition-colors shadow-2xs"
                      >
                        <Edit2 className="h-3 w-3 text-neutral-400" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group rounded-2xl border border-neutral-200/80 bg-white p-4 transition-all hover:border-neutral-400 hover:shadow-md shadow-2xs"
            >
              <div className="relative aspect-square w-full rounded-xl bg-neutral-50 border border-neutral-200/60 p-3 flex items-center justify-center overflow-hidden">
                <Image
                  src={product.images?.[0] || "/products/leather-case-black.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 rounded-full bg-neutral-950 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-neutral-950 truncate">{product.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-neutral-950">QR {product.price}</p>
                  <span className="text-[10px] text-neutral-500 font-mono font-medium">{product.stock} in stock</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
