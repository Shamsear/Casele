"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Phone Models</h1>
          <p className="mt-1 text-warm-gray">Manage supported iPhone, Samsung, Pixel, and flagship phone models</p>
        </div>
        {!isAdding && (
          <Button variant="cta" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Model
          </Button>
        )}
      </div>

      {/* Add New Model Form */}
      {isAdding && (
        <div className="rounded-xl border border-gold/30 bg-dark-surface p-6 space-y-4 animate-scale-in">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-white">Create Supported Phone Model</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-warm-gray">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-dark-border bg-dark-surface text-white text-sm focus:outline-none focus:border-gold"
              >
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="Google">Google</option>
                <option value="Huawei">Huawei</option>
                <option value="OnePlus">OnePlus</option>
              </select>
            </div>
            <Input
              label="Model Name"
              placeholder="e.g. iPhone 16 Pro Max"
              value={modelName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            <Input
              label="URL Slug"
              placeholder="e.g. iphone-16-pro-max"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button variant="cta" size="sm" onClick={handleCreateModel} loading={submitting}>
              Save Model
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search models or brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-xs text-warm-gray font-mono">{filtered.length} supported models</span>
      </div>

      <div className="rounded-xl border border-dark-border overflow-hidden bg-dark-surface/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Model</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Available Cases</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-warm-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-warm-gray text-sm">
                  Loading phone models...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-warm-gray text-sm">
                  No phone models found.
                </td>
              </tr>
            ) : (
              filtered.map((model) => (
                <tr key={model.id} className="border-b border-dark-border/50 hover:bg-dark-surface/60 transition-colors">
                  <td className="px-4 py-3 text-sm text-warm-gray font-medium">{model.brand}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">{model.modelName}</td>
                  <td className="px-4 py-3 text-sm text-neutral-300 font-mono">{model.productsCount} cases</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400 font-semibold border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteModel(model.id)}
                      className="p-1 text-warm-gray hover:text-rose-400 transition-colors cursor-pointer"
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
  );
}
