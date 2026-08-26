"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import { Plus, Trash2, Smartphone, Search } from "lucide-react";

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

  // Modal / form state
  const [isAdding, setIsAdding] = useState(false);
  const [brand, setBrand] = useState("iPhone");
  const [modelName, setModelName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleNameChange = (val: string) => {
    setModelName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const handleCreateModel = async () => {
    if (!brand || !modelName.trim() || !slug.trim()) {
      toast("Brand, Model Name, and Slug are required", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          modelName: modelName.trim(),
          slug: slug.trim(),
          isActive: true,
        }),
      });

      if (res.ok) {
        toast("Phone model created successfully", "success");
        setModelName("");
        setSlug("");
        setIsAdding(false);
        fetchModels();
      } else {
        toast("Failed to create phone model", "error");
      }
    } catch {
      toast("Failed to create phone model", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this phone model?")) return;

    try {
      const res = await fetch(`/api/admin/models?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Model deleted", "success");
        setModels((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast("Failed to delete model", "error");
      }
    } catch {
      toast("Failed to delete model", "error");
    }
  };

  const filtered = models.filter((m) =>
    m.modelName.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
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
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Model</span>
          </button>
        )}
      </div>

      {/* Add New Model Form */}
      {isAdding && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-2xs animate-scale-in">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Smartphone className="w-4 h-4 text-[#A88B4D]" />
            <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Add New Phone Model
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
              >
                <option value="iPhone">Apple iPhone</option>
                <option value="Samsung">Samsung Galaxy</option>
                <option value="Google">Google Pixel</option>
                <option value="Huawei">Huawei</option>
                <option value="OnePlus">OnePlus</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Model Name</label>
              <input
                type="text"
                placeholder="e.g. iPhone 16 Pro Max"
                value={modelName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">URL Slug</label>
              <input
                type="text"
                placeholder="e.g. iphone-16-pro-max"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateModel}
              disabled={submitting}
              className="rounded-xl bg-neutral-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Phone Model"}
            </button>
          </div>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search phone models or brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono font-medium">{filtered.length} supported devices</span>
      </div>

      {/* Table or Shimmer Skeleton */}
      {loading ? (
        <AdminTableSkeleton rows={6} cols={5} />
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3.5">Brand</th>
                  <th className="px-4 py-3.5">Model</th>
                  <th className="px-4 py-3.5">Available Cases</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No phone models found in database.
                    </td>
                  </tr>
                ) : (
                  filtered.map((model) => (
                  <tr key={model.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-neutral-950">
                      <span className="bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md text-xs font-semibold">
                        {model.brand}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-neutral-900">{model.modelName}</td>
                    <td className="px-4 py-3.5 text-neutral-600 font-mono">{model.productsCount} cases</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] text-emerald-700 font-bold uppercase tracking-wider border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteModel(model.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
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
