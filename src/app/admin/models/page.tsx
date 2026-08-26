"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import { Plus, Trash2, Smartphone, Search, Inbox } from "lucide-react";

interface PhoneModel {
  id: string;
  brand: string;
  modelName: string;
  slug: string;
  imageUrl?: string | null;
  productsCount: number;
  isActive: boolean;
}

export default function AdminModelsPage() {
  const { toast } = useToast();
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/models");
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete phone model "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/models?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast(`Model ${name} deleted`, "success");
        setModels((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast("Failed to delete phone model", "error");
      }
    } catch {
      toast("Failed to delete phone model", "error");
    }
  };

  const filtered = models.filter(
    (m) =>
      m.modelName.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Supported Phone Models
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Manage iPhone, Samsung Galaxy, Google Pixel, and other flagship device compatibility
          </p>
        </div>
        <Link
          href="/admin/models/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Model</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search models or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
        />
      </div>

      {/* Models Table or Shimmer Skeleton */}
      {loading ? (
        <AdminTableSkeleton rows={8} cols={5} />
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3.5">Device Name</th>
                  <th className="px-4 py-3.5">Brand</th>
                  <th className="px-4 py-3.5">Slug Reference</th>
                  <th className="px-4 py-3.5">Compatible Cases</th>
                  <th className="px-5 py-3.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-400">
                      <div className="space-y-3">
                        <Inbox className="h-8 w-8 text-neutral-300 mx-auto" />
                        <p className="text-xs text-neutral-500 font-medium">
                          No phone models found in database.
                        </p>
                        <Link
                          href="/admin/models/new"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add First Phone Model</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-neutral-950">{m.modelName}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                          {m.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-400 font-mono text-xs">
                        {m.slug}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-600 font-medium font-mono">
                        {m.productsCount} cases
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteModel(m.id, m.modelName)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Model"
                          aria-label="Delete Model"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
