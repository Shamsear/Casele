"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Tag, Percent, Sparkles, Truck } from "lucide-react";

interface Tier {
  id: string;
  minAmount: number;
  discountPercent: number;
  isActive: boolean;
  sortOrder?: number;
}

export default function AdminDiscountsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tiered");
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);

  // New Tier form state
  const [isAddingTier, setIsAddingTier] = useState(false);
  const [newMinAmount, setNewMinAmount] = useState("");
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  const [submittingTier, setSubmittingTier] = useState(false);

  // Bundle settings state
  const [bundleBuy2, setBundleBuy2] = useState("5");
  const [bundleBuy3, setBundleBuy3] = useState("10");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("100");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchTiers();
    fetchSettings();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoadingTiers(true);
      const res = await fetch("/api/admin/discounts/tiered");
      if (res.ok) {
        const data = await res.json();
        setTiers(data.tiers || []);
      }
    } catch (error) {
      console.error("Failed to load tiers:", error);
    } finally {
      setLoadingTiers(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          if (data.settings.bundle_buy_2_discount) setBundleBuy2(data.settings.bundle_buy_2_discount);
          if (data.settings.bundle_buy_3_discount) setBundleBuy3(data.settings.bundle_buy_3_discount);
          if (data.settings.free_delivery_threshold) setFreeDeliveryThreshold(data.settings.free_delivery_threshold);
        }
      }
    } catch (error) {
      console.error("Failed to load bundle settings:", error);
    }
  };

  const handleCreateTier = async () => {
    if (!newMinAmount || !newDiscountPercent) {
      toast("Please enter spend amount and discount percentage", "error");
      return;
    }

    try {
      setSubmittingTier(true);
      const res = await fetch("/api/admin/discounts/tiered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minAmount: Number(newMinAmount),
          discountPercent: Number(newDiscountPercent),
          isActive: true,
        }),
      });

      if (res.ok) {
        toast("Tiered discount created successfully", "success");
        setNewMinAmount("");
        setNewDiscountPercent("");
        setIsAddingTier(false);
        fetchTiers();
      } else {
        toast("Failed to create tier", "error");
      }
    } catch {
      toast("Failed to create tier", "error");
    } finally {
      setSubmittingTier(false);
    }
  };

  const handleToggleTier = async (tier: Tier) => {
    try {
      const res = await fetch("/api/admin/discounts/tiered", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tier.id,
          isActive: !tier.isActive,
        }),
      });

      if (res.ok) {
        toast(`Tier ${!tier.isActive ? "activated" : "deactivated"}`, "success");
        setTiers((prev) =>
          prev.map((t) => (t.id === tier.id ? { ...t, isActive: !t.isActive } : t))
        );
      }
    } catch {
      toast("Failed to update tier", "error");
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount tier?")) return;

    try {
      const res = await fetch(`/api/admin/discounts/tiered?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Tier deleted", "success");
        setTiers((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast("Failed to delete tier", "error");
      }
    } catch {
      toast("Failed to delete tier", "error");
    }
  };

  const handleSaveBundleSettings = async () => {
    try {
      setSavingSettings(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            bundle_buy_2_discount: bundleBuy2,
            bundle_buy_3_discount: bundleBuy3,
            free_delivery_threshold: freeDeliveryThreshold,
          },
        }),
      });

      if (res.ok) {
        toast("Bundle savings & delivery threshold saved!", "success");
      } else {
        toast("Failed to save settings", "error");
      }
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Discounts & Bundles
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Manage automatic tiered spend incentives, multi-case discounts, and free delivery thresholds
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-neutral-200 pb-1">
        <button
          onClick={() => setActiveTab("tiered")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "tiered"
              ? "bg-neutral-950 text-white shadow-xs"
              : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Percent className="h-3.5 w-3.5" />
          <span>Tiered Spend Discounts</span>
          <span className="rounded-full bg-neutral-200/60 px-1.5 py-0.2 text-[10px] font-mono text-neutral-700">
            {tiers.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("bundle")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "bundle"
              ? "bg-neutral-950 text-white shadow-xs"
              : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bundle & Delivery Savings</span>
        </button>
      </div>

      {/* TAB 1: TIERED SPEND DISCOUNTS */}
      {activeTab === "tiered" && (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-950">Active Spend Tier Rules</h3>
              <p className="text-xs text-neutral-500">
                Automatic percentage savings when cart total reaches minimum spend
              </p>
            </div>
            {!isAddingTier && (
              <button
                onClick={() => setIsAddingTier(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            )}
          </div>

          {/* Add New Tier Form */}
          {isAddingTier && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-4 animate-scale-in shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950">Create New Spend Tier</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Minimum Cart Spend (QR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={newMinAmount}
                    onChange={(e) => setNewMinAmount(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Discount Percentage (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={newDiscountPercent}
                    onChange={(e) => setNewDiscountPercent(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTier(false)}
                  className="rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateTier}
                  disabled={submittingTier}
                  className="rounded-xl bg-neutral-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submittingTier ? "Saving..." : "Save Tier Rule"}
                </button>
              </div>
            </div>
          )}

          {/* Tiers List */}
          {loadingTiers ? (
            <div className="py-8 text-center text-neutral-400 text-xs">Loading discount tiers...</div>
          ) : tiers.length === 0 ? (
            <div className="py-8 text-center text-neutral-400 text-xs">No spend tiers created yet.</div>
          ) : (
            <div className="space-y-2.5">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-neutral-50/50 border border-neutral-200/70 p-4 transition-all hover:bg-neutral-50 hover:border-neutral-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 font-medium">Cart Subtotal</span>
                    <span className="text-xs font-bold text-neutral-950 font-mono">QR {tier.minAmount}+</span>
                    <span className="text-xs text-neutral-400">→</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">{tier.discountPercent}% OFF</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTier(tier)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                        tier.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                      }`}
                    >
                      {tier.isActive ? "Active" : "Disabled"}
                    </button>
                    <button
                      onClick={() => handleDeleteTier(tier.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Tier"
                      aria-label="Delete Tier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUNDLE SAVINGS & DELIVERY THRESHOLDS */}
      {activeTab === "bundle" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-neutral-950">Multi-Item Bundle Discounts</h3>
            <p className="text-xs text-neutral-500">
              Automatically calculate savings when shoppers purchase multiple protective cases in one order.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Buy 2 Cases Discount (%)</label>
                <input
                  type="number"
                  value={bundleBuy2}
                  onChange={(e) => setBundleBuy2(e.target.value)}
                  placeholder="5"
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Buy 3+ Cases Discount (%)</label>
                <input
                  type="number"
                  value={bundleBuy3}
                  onChange={(e) => setBundleBuy3(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-neutral-950">Free Express Delivery Threshold</h3>
            <p className="text-xs text-neutral-500">
              Orders at or above this amount automatically receive complimentary same-day Doha delivery.
            </p>
            <div className="max-w-xs pt-2 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Free Delivery Minimum (QR)</label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                placeholder="100"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveBundleSettings}
              disabled={savingSettings}
              className="rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {savingSettings ? "Saving..." : "Save Bundle & Delivery Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
