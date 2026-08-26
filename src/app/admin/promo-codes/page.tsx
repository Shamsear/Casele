"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const [togglingId, setTogglingId] = useState<string | null>(null);

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
        <Link
          href="/admin/promo-codes/new"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Promo Code</span>
        </Link>
      </div>

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
                        <Link
                          href="/admin/promo-codes/new"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Create First Promo Code</span>
                        </Link>
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
