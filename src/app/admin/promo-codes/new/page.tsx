"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Tag, Percent, Sparkles, CheckCircle2 } from "lucide-react";

export default function NewPromoCodePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("0");
  const [maxUses, setMaxUses] = useState("");
  const [initialActive, setInitialActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !discountValue) {
      toast("Please provide voucher code name and discount value", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: Number(discountValue),
          minOrder: Number(minOrder || 0),
          maxUses: maxUses ? Number(maxUses) : null,
          isActive: initialActive,
        }),
      });

      if (res.ok) {
        toast(`Promo code ${code.trim().toUpperCase()} created successfully!`, "success");
        router.push("/admin/promo-codes");
      } else {
        toast("Failed to create promo code", "error");
      }
    } catch {
      toast("Failed to create promo code", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/promo-codes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Promo Codes</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Create Promotional Code
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          Add a new discount code or voucher stored in the PostgreSQL database
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleCreatePromo}
        className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Voucher Code *
            </label>
            <input
              type="text"
              placeholder="e.g. VIP20, DOHA10, WELCOME15"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-sm font-mono font-bold text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none uppercase shadow-2xs"
            />
            <p className="text-[10px] text-neutral-400">Uppercase letters and numbers only.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-950 focus:border-neutral-950 focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="percentage">Percentage (% OFF)</option>
                <option value="flat">Fixed QAR Amount (QR OFF)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Discount Rate *
              </label>
              <input
                type="number"
                placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 20"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                min="1"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Minimum Cart Spend (QR)
              </label>
              <input
                type="number"
                placeholder="0 (No minimum required)"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                min="0"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Usage Limit
              </label>
              <input
                type="number"
                placeholder="Leave blank for unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="1"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Initial Status Switch */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div>
              <span className="text-xs font-bold text-neutral-900">Voucher Status</span>
              <p className="text-[11px] text-neutral-500">
                Choose whether this code goes live immediately upon saving
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInitialActive(!initialActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  initialActive ? "bg-neutral-950" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    initialActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-neutral-800">
                {initialActive ? "Active Immediately" : "Inactive (Draft)"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link
            href="/admin/promo-codes"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Promo Code"}
          </button>
        </div>
      </form>
    </div>
  );
}
