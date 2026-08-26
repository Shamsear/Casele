"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Tag, Percent, DollarSign } from "lucide-react";

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
      }
    } catch {
      toast("Failed to delete promo code", "error");
    }
  };

  const filtered = promos.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Promo Codes</h1>
          <p className="mt-1 text-warm-gray">Create, edit, and monitor customer discount codes</p>
        </div>
        {!isAdding && (
          <Button variant="cta" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create Promo Code
          </Button>
        )}
      </div>

      {/* Add New Promo Code Form */}
      {isAdding && (
        <div className="rounded-xl border border-gold/30 bg-dark-surface p-6 space-y-4 animate-scale-in">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-white">Create New Promo Code</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <Input
              label="Promo Code"
              placeholder="e.g. DOHA25"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-warm-gray">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-dark-border bg-dark-surface text-white text-sm focus:outline-none focus:border-gold"
              >
                <option value="percentage">Percentage (%) Off</option>
                <option value="flat">Fixed Flat Amount (QR) Off</option>
              </select>
            </div>
            <Input
              label={discountType === "percentage" ? "Discount Percentage (%)" : "Flat Amount (QR)"}
              type="number"
              placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 25"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
            <Input
              label="Minimum Order Spend (QR)"
              type="number"
              placeholder="0 for no minimum"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
            <Input
              label="Max Usages (Optional)"
              type="number"
              placeholder="Leave empty for unlimited"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button variant="cta" size="sm" onClick={handleCreatePromo} loading={submitting}>
              Save Promo Code
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search promo codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-xs text-warm-gray font-mono">{filtered.length} total codes</span>
      </div>

      <div className="rounded-xl border border-dark-border overflow-hidden bg-dark-surface/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Discount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Min Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Uses</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-warm-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-warm-gray text-sm">
                  Loading promo codes...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-warm-gray text-sm">
                  No promo codes found.
                </td>
              </tr>
            ) : (
              filtered.map((promo) => (
                <tr key={promo.id} className="border-b border-dark-border/50 hover:bg-dark-surface/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-bold text-gold tracking-wider">{promo.code}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {promo.discountType === "percentage" ? `${promo.discountValue}% OFF` : `QR ${promo.discountValue} OFF`}
                  </td>
                  <td className="px-4 py-3 text-sm text-warm-gray">
                    {promo.minOrder > 0 ? `QR ${promo.minOrder}` : "None"}
                  </td>
                  <td className="px-4 py-3 text-sm text-warm-gray font-mono">
                    {promo.usedCount}{promo.maxUses ? ` / ${promo.maxUses}` : " (Unlimited)"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(promo)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-colors ${
                        promo.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-1 text-warm-gray hover:text-rose-400 transition-colors cursor-pointer"
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
  );
}
