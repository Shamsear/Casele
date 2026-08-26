"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Tag, Percent, DollarSign, Search } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
}

export default function AdminPromoCodesPage() {
  const { toast } = useToast();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create form state
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("0");
  const [maxUses, setMaxUses] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/promo-codes");
      if (res.ok) {
        const data = await res.json();
        setPromos(data.promos || []);
      }
    } catch (error) {
      console.error("Failed to load promos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async () => {
    if (!code.trim() || !discountValue) {
      toast("Please enter code and discount value", "error");
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
          isActive: true,
        }),
      });

      if (res.ok) {
        toast("Promo code created successfully", "success");
        setCode("");
        setDiscountValue("");
        setMinOrder("0");
        setMaxUses("");
        setIsAdding(false);
        fetchPromos();
      } else {
        toast("Failed to create promo code", "error");
      }
    } catch {
      toast("Failed to create promo code", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (promo: PromoCode) => {
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promo.id,
          isActive: !promo.isActive,
        }),
      });

      if (res.ok) {
        toast(`Promo code ${!promo.isActive ? "activated" : "deactivated"}`, "success");
        setPromos((prev) =>
          prev.map((p) => (p.id === promo.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } catch {
      toast("Failed to update promo code", "error");
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;

    try {
      const res = await fetch(`/api/admin/promo-codes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Promo code deleted", "success");
        setPromos((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast("Failed to delete promo code", "error");
      }
    } catch {
      toast("Failed to delete promo code", "error");
    }
  };

  const filtered = promos.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Promo Codes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Create, edit, and track customer coupon codes and influencer vouchers
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        )}
      </div>

      {/* Add New Promo Code Form */}
      {isAdding && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-2xs animate-scale-in">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Tag className="w-4 h-4 text-[#A88B4D]" />
            <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">New Promo Voucher</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Promo Code</label>
              <input
                type="text"
                placeholder="e.g. DOHA20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono font-bold text-neutral-950 uppercase placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
              >
                <option value="percentage">Percentage (%) Off</option>
                <option value="flat">Fixed Flat Amount (QR) Off</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                {discountType === "percentage" ? "Discount Percentage (%)" : "Flat Amount (QR)"}
              </label>
              <input
                type="number"
                placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 25"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Minimum Order Spend (QR)</label>
              <input
                type="number"
                placeholder="0 for no minimum"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Max Usages (Optional)</label>
              <input
                type="number"
                placeholder="Leave empty for unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
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
              onClick={handleCreatePromo}
              disabled={submitting}
              className="rounded-xl bg-neutral-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Promo Code"}
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
            placeholder="Search promo codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono font-medium">{filtered.length} total codes</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3.5">Code</th>
                <th className="px-4 py-3.5">Discount</th>
                <th className="px-4 py-3.5">Min Order</th>
                <th className="px-4 py-3.5">Usage</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Loading promo codes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No promo codes found.
                  </td>
                </tr>
              ) : (
                filtered.map((promo) => (
                  <tr key={promo.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold text-neutral-950 tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-lg shadow-2xs">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-neutral-950">
                      {promo.discountType === "percentage" ? `${promo.discountValue}% OFF` : `QR ${promo.discountValue} OFF`}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 font-medium">
                      {promo.minOrder > 0 ? `QR ${promo.minOrder}` : "None"}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-500 font-mono">
                      {promo.usedCount}{promo.maxUses ? ` / ${promo.maxUses}` : " (Unlimited)"}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(promo)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                          promo.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                        }`}
                      >
                        {promo.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Promo Code"
                        aria-label="Delete Promo Code"
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
    </div>
  );
}
