"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Percent, Layers } from "lucide-react";

export default function NewTieredDiscountPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [minAmount, setMinAmount] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!minAmount || !discountPercent) {
      toast("Please enter minimum spend amount and discount percentage", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/discounts/tiered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minAmount: Number(minAmount),
          discountPercent: Number(discountPercent),
          isActive: true,
        }),
      });

      if (res.ok) {
        toast(`Spend incentive tier (QR ${minAmount}+) created successfully!`, "success");
        router.push("/admin/discounts");
      } else {
        toast("Failed to create tier discount", "error");
      }
    } catch {
      toast("Failed to create tier discount", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/discounts"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Discounts & Promotions</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Create Tiered Spend Incentive
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          Automatically award cart discounts when shoppers reach cart spend milestones (e.g. Spend QR 200, Get 10% OFF)
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleCreateTier}
        className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Minimum Cart Spend (QR) *
            </label>
            <input
              type="number"
              placeholder="e.g. 200"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              required
              min="10"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Discount Percentage (%) *
            </label>
            <input
              type="number"
              placeholder="e.g. 10 for 10% OFF"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              required
              min="1"
              max="90"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link
            href="/admin/discounts"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Spend Tier"}
          </button>
        </div>
      </form>
    </div>
  );
}
