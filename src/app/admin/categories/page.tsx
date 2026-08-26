"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { AdminGridSkeleton } from "@/components/admin/admin-skeletons";
import { Plus, Trash2, Edit2, Layers, Percent } from "lucide-react";

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

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete collection "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast(`Collection ${name} deleted`, "success");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast("Failed to delete category", "error");
      }
    } catch {
      toast("Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
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
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </Link>
      </div>

      {/* Categories Cards Grid or Shimmer Skeleton */}
      {loading ? (
        <AdminGridSkeleton cards={6} />
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center space-y-3 shadow-2xs">
          <Layers className="h-8 w-8 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-neutral-950 text-sm">No Collections Created in Database</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Organize your luxury phone cases into curated collections.
          </p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Collection</span>
          </Link>
        </div>
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
                <Link
                  href={`/admin/categories/${cat.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-800 hover:text-neutral-950 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Collection</span>
                </Link>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
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
