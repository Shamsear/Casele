"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Edit2, Layers, Tag, Percent } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  salePercent?: number | null;
  productsCount: number;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [salePercent, setSalePercent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSaveCategory = async () => {
    if (!name.trim() || !slug.trim()) {
      toast("Category Name and Slug are required", "error");
      return;
    }

    try {
      setSubmitting(true);
      const url = "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      const body = {
        ...(editingId && { id: editingId }),
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        salePercent: salePercent ? Number(salePercent) : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast(`Category ${editingId ? "updated" : "created"} successfully`, "success");
        resetForm();
        fetchCategories();
      } else {
        toast("Failed to save category", "error");
      }
    } catch {
      toast("Failed to save category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setSalePercent(cat.salePercent ? String(cat.salePercent) : "");
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setSalePercent("");
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Category deleted", "success");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast("Failed to delete category", "error");
      }
    } catch {
      toast("Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Collections & Categories
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Manage case collections, category-wide sales, and descriptions
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collection</span>
          </button>
        )}
      </div>

      {/* Add / Edit Category Form */}
      {isAdding && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-2xs animate-scale-in">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Layers className="w-4 h-4 text-[#A88B4D]" />
            <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
              {editingId ? "Edit Collection" : "Create New Collection"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Collection Name</label>
              <input
                type="text"
                placeholder="e.g. Titanium Atelier"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">URL Slug</label>
              <input
                type="text"
                placeholder="e.g. titanium-atelier"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Description</label>
              <input
                type="text"
                placeholder="Brief editorial headline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Collection-Wide Sale (%)</label>
              <input
                type="number"
                placeholder="e.g. 15 for 15% off all cases in this collection"
                value={salePercent}
                onChange={(e) => setSalePercent(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCategory}
              disabled={submitting}
              className="rounded-xl bg-neutral-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {editingId ? "Update Collection" : "Save Collection"}
            </button>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-neutral-400 text-xs">Loading collections...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-neutral-200/80 bg-white p-5 flex flex-col justify-between hover:border-neutral-400 transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-neutral-950 text-base">{cat.name}</h3>
                  <span className="text-xs font-mono text-neutral-400">/{cat.slug}</span>
                </div>
                {cat.description && (
                  <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2">{cat.description}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-neutral-600 font-medium bg-neutral-100 px-2 py-0.5 rounded-md">
                    {cat.productsCount} cases
                  </span>
                  {cat.salePercent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      <Percent className="w-3 h-3" /> {cat.salePercent}% Sale
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => startEdit(cat)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Collection</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Category"
                  aria-label="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
