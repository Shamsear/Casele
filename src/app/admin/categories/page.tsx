"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      }
    } catch {
      toast("Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Categories & Collections</h1>
          <p className="mt-1 text-warm-gray">Manage case collections, descriptions, and category sales</p>
        </div>
        {!isAdding && (
          <Button variant="cta" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </Button>
        )}
      </div>

      {/* Add / Edit Category Form */}
      {isAdding && (
        <div className="rounded-xl border border-gold/30 bg-dark-surface p-6 space-y-4 animate-scale-in">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-white">
              {editingId ? "Edit Category" : "Create New Category"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Category Name"
              placeholder="e.g. Luxe Series"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            <Input
              label="URL Slug"
              placeholder="e.g. luxe-series"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <Input
              label="Category Description"
              placeholder="Brief description for category banner..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label="Category-Wide Sale (%)"
              type="number"
              placeholder="e.g. 15 for 15% off all cases in category"
              value={salePercent}
              onChange={(e) => setSalePercent(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="cta" size="sm" onClick={handleSaveCategory} loading={submitting}>
              {editingId ? "Update Category" : "Save Category"}
            </Button>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-warm-gray text-sm">Loading categories...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-dark-border bg-dark-surface p-5 flex flex-col justify-between hover:border-dark-border-hover transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-white text-base">{cat.name}</h3>
                  <span className="text-xs font-mono text-warm-gray">/{cat.slug}</span>
                </div>
                {cat.description && (
                  <p className="mt-1 text-xs text-warm-gray line-clamp-2">{cat.description}</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-neutral-300 font-medium">{cat.productsCount} products</span>
                  {cat.salePercent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold border border-gold/20">
                      <Percent className="w-3 h-3" /> {cat.salePercent}% Category Sale
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-dark-border/60 flex items-center justify-between">
                <Button variant="secondary" size="sm" onClick={() => startEdit(cat)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 text-warm-gray hover:text-rose-400 transition-colors cursor-pointer"
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
