"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Percent,
  Search,
  Power,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Inbox
} from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
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
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("0");
  const [maxUses, setMaxUses] = useState("");
  const [initialActive, setInitialActive] = useState(true);
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
    } catch (err) {
      console.error("Failed to load promo codes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) {
      toast("Please provide code name and discount value", "error");
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
        toast(`Promo code ${code.trim().toUpperCase()} created!`, "success");
        setCode("");
        setDiscountValue("");
        setMinOrder("0");
        setMaxUses("");
        setInitialActive(true);
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
      setTogglingId(promo.id);
      const nextState = !promo.isActive;
      const res = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promo.id,
          isActive: nextState,
        }),
      });

      if (res.ok) {
        toast(
          `Promo code ${promo.code} is now ${nextState ? "ACTIVE" : "DEACTIVATED"}`,
          nextState ? "success" : "info"
        );
        setPromos((prev) =>
          prev.map((p) => (p.id === promo.id ? { ...p, isActive: nextState } : p))
        );
      } else {
        toast("Failed to update promo code status", "error");
      }
    } catch {
      toast("Failed to update promo code status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeletePromo = async (id: string, codeName: string) => {
    if (!confirm(`Are you sure you want to delete promo code "${codeName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/promo-codes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast(`Promo code ${codeName} deleted`, "success");
        setPromos((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast("Failed to delete promo code", "error");
      }
    } catch {
      toast("Failed to delete promo code", "error");
    }
  };

  const filtered = promos.filter((p) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && p.isActive) ||
      (activeTab === "inactive" && !p.isActive);
    const matchesSearch = p.code.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCount = promos.filter((p) => p.isActive).length;
  const inactiveCount = promos.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Promo Codes & Vouchers
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Manage promotional discounts and instantly activate or deactivate codes
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? "Cancel" : "New Promo Code"}</span>
        </button>
      </div>

      {/* Add Promo Code Form */}
      {isAdding && (
        <form
          onSubmit={handleCreatePromo}
          className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-md space-y-4 animate-scale-in"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-display text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Create New Promotional Code
            </h3>
            <span className="text-xs text-neutral-400 font-medium">PostgreSQL Database</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Code Name *
              </label>
              <input
                type="text"
                placeholder="e.g. VIP20, DOHA10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-mono font-bold text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none uppercase shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full h-9 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-950 focus:border-neutral-950 focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="percentage">Percentage (% OFF)</option>
                <option value="flat">Fixed QAR Amount (QR OFF)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Discount Value *
              </label>
              <input
                type="number"
                placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 20"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                min="1"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Min. Order (QR)
              </label>
              <input
                type="number"
                placeholder="0 (No minimum)"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                min="0"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-neutral-100">
            {/* Active Switch */}
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

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Promo Code"}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Codes", count: promos.length },
            { id: "active", label: "Active", count: activeCount },
            { id: "inactive", label: "Inactive", count: inactiveCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeTab === tab.id
                    ? "bg-neutral-800 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search promo code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Promo Codes Table */}
      {loading ? (
        <AdminTableSkeleton rows={5} cols={6} />
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3.5">Voucher Code</th>
                  <th className="px-4 py-3.5">Discount Rate</th>
                  <th className="px-4 py-3.5">Min. Order</th>
                  <th className="px-4 py-3.5">Times Used</th>
                  <th className="px-4 py-3.5">Status & Action</th>
                  <th className="px-5 py-3.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400">
                      <div className="space-y-3">
                        <Inbox className="h-8 w-8 text-neutral-300 mx-auto" />
                        <p className="text-xs text-neutral-500 font-medium">
                          No promo codes found in database.
                        </p>
                        <button
                          onClick={() => setIsAdding(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Create First Promo Code</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((promo) => {
                    const isToggling = togglingId === promo.id;
                    return (
                      <tr
                        key={promo.id}
                        className={`hover:bg-neutral-50/60 transition-colors ${
                          !promo.isActive ? "bg-neutral-50/30 opacity-75" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs font-bold text-neutral-950 tracking-wider bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg shadow-2xs">
                            {promo.code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-neutral-950">
                          {promo.discountType === "percentage"
                            ? `${promo.discountValue}% OFF`
                            : `QR ${promo.discountValue} OFF`}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-600 font-medium">
                          {promo.minOrder > 0 ? `QR ${promo.minOrder}` : "None"}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-500 font-mono">
                          {promo.usedCount}
                          {promo.maxUses ? ` / ${promo.maxUses}` : " (Unlimited)"}
                        </td>
                        <td className="px-4 py-3.5">
                          {/* 1-Click Activate / Deactivate Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(promo)}
                            disabled={isToggling}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-all cursor-pointer shadow-2xs disabled:opacity-50 ${
                              promo.isActive
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
                            }`}
                            title={promo.isActive ? "Click to Deactivate Promo Code" : "Click to Activate Promo Code"}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                promo.isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                              }`}
                            />
                            <span>{promo.isActive ? "Active (Deactivate)" : "Inactive (Activate)"}</span>
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDeletePromo(promo.id, promo.code)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Promo Code"
                            aria-label="Delete Promo Code"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
