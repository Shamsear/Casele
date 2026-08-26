"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Layers, Trash2 } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const catId = params.id as string;
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [salePercent, setSalePercent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [catId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        const found = (data.categories || []).find((c: any) => c.id === catId);
        if (found) {
          setName(found.name);
          setSlug(found.slug);
          setDescription(found.description || "");
          setSalePercent(found.salePercent ? String(found.salePercent) : "");
        }
      }
    } catch {
      toast("Failed to load category details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast("Category Name and Slug are required", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: catId,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          salePercent: salePercent ? Number(salePercent) : null,
        }),
      });

      if (res.ok) {
        toast(`Collection ${name.trim()} updated successfully!`, "success");
        router.push("/admin/categories");
      } else {
        toast("Failed to update collection", "error");
      }
    } catch {
      toast("Failed to update collection", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirm(`Are you sure you want to delete collection "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${catId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Category deleted", "success");
        router.push("/admin/categories");
      } else {
        toast("Failed to delete category", "error");
      }
    } catch {
      toast("Failed to delete category", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-xs text-neutral-400">
        Loading collection details...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Collections</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Edit Collection: {name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Update category properties, slug, and category-wide discounts
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeleteCategory}
          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Delete collection"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleUpdateCategory}
        className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Collection Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Category-Wide Sale (%) (Optional)
            </label>
            <input
              type="number"
              value={salePercent}
              onChange={(e) => setSalePercent(e.target.value)}
              min="0"
              max="90"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link
            href="/admin/categories"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Update Collection"}
          </button>
        </div>
      </form>
    </div>
  );
}
