"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Smartphone } from "lucide-react";

export default function NewPhoneModelPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [brand, setBrand] = useState("iPhone");
  const [modelName, setModelName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (val: string) => {
    setModelName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();

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
        toast(`Phone model ${modelName.trim()} created successfully!`, "success");
        router.push("/admin/models");
      } else {
        toast("Failed to create phone model", "error");
      }
    } catch {
      toast("Failed to create phone model", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/models"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Phone Models</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Add Supported Phone Model
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          Add flagship devices (iPhone 16 Pro Max, Samsung S25 Ultra) to the compatibility list
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleCreateModel}
        className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Brand / Manufacturer *
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-950 focus:border-neutral-950 focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="iPhone">Apple (iPhone)</option>
              <option value="Samsung">Samsung (Galaxy)</option>
              <option value="Google">Google (Pixel)</option>
              <option value="Huawei">Huawei</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Model Name *
            </label>
            <input
              type="text"
              placeholder="e.g. iPhone 16 Pro Max, Galaxy S25 Ultra"
              value={modelName}
              onChange={(e) => handleNameChange(e.target.value)}
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
              placeholder="e.g. iphone-16-pro-max"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link
            href="/admin/models"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Phone Model"}
          </button>
        </div>
      </form>
    </div>
  );
}
