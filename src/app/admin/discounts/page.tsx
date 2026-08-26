"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface Tier {
  id: string;
  minAmount: number;
  discountPercent: number;
  isActive: boolean;
  sortOrder?: number;
}

const SAMPLE_FLASH_SALES = [
  { id: "1", name: "Qatar National Day Sale", type: "percentage", value: 20, status: "active", startsAt: "2026-12-18", endsAt: "2026-12-21", orders: 89, revenue: "QR 1,520" },
  { id: "2", name: "Weekend Flash", type: "flat", value: 10, status: "upcoming", startsAt: "2026-08-30", endsAt: "2026-09-01", orders: 0, revenue: "QR 0" },
];

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Discounts & Savings</h1>
          <p className="mt-1 text-warm-gray">Manage tiered spend rules, bundle savings, and delivery thresholds</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "tiered", label: "Tiered Spend Discounts", count: tiers.length },
          { id: "bundle", label: "Bundle & Delivery Savings" },
          { id: "flash", label: "Flash Sales", count: SAMPLE_FLASH_SALES.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ═══ TAB 1: TIERED SPEND DISCOUNTS ═══ */}
      {activeTab === "tiered" && (
        <div className="rounded-xl border border-dark-border bg-dark-surface p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Spend Tier Rules</h3>
              <p className="mt-1 text-sm text-warm-gray">Automatic discounts applied when cart subtotal crosses the threshold</p>
            </div>
            {!isAddingTier && (
              <Button variant="secondary" size="sm" onClick={() => setIsAddingTier(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Tier
              </Button>
            )}
          </div>

          {/* Add New Tier Form */}
          {isAddingTier && (
            <div className="rounded-lg border border-gold/30 bg-dark-surface/80 p-4 space-y-4 animate-scale-in">
              <h4 className="text-sm font-semibold text-white">Create New Spend Tier</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Minimum Cart Spend (QR)"
                  type="number"
                  placeholder="e.g. 150"
                  value={newMinAmount}
                  onChange={(e) => setNewMinAmount(e.target.value)}
                />
                <Input
                  label="Discount Percentage (%)"
                  type="number"
                  placeholder="e.g. 12"
                  value={newDiscountPercent}
                  onChange={(e) => setNewDiscountPercent(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddingTier(false)}>
                  Cancel
                </Button>
                <Button variant="cta" size="sm" onClick={handleCreateTier} loading={submittingTier}>
                  Save Tier Rule
                </Button>
              </div>
            </div>
          )}

          {/* Tiers List */}
          {loadingTiers ? (
            <div className="py-8 text-center text-warm-gray text-sm">Loading discount tiers...</div>
          ) : tiers.length === 0 ? (
            <div className="py-8 text-center text-warm-gray text-sm">No spend tiers created yet.</div>
          ) : (
            <div className="space-y-3">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-dark-surface/60 border border-dark-border p-4 transition-colors hover:border-dark-border-hover"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-warm-gray">Spend</span>
                    <span className="text-sm font-bold text-white font-mono">QR {tier.minAmount}+</span>
                    <span className="text-sm text-warm-gray">→</span>
                    <span className="text-sm font-bold text-gold font-mono">{tier.discountPercent}% OFF</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTier(tier)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                        tier.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                      }`}
                    >
                      {tier.isActive ? "Active" : "Disabled"}
                    </button>
                    <button
                      onClick={() => handleDeleteTier(tier.id)}
                      className="p-1 text-warm-gray hover:text-rose-400 transition-colors cursor-pointer"
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

      {/* ═══ TAB 2: BUNDLE SAVINGS & DELIVERY THRESHOLDS ═══ */}
      {activeTab === "bundle" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-dark-border bg-dark-surface p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Multi-Item Bundle Discounts</h3>
            <p className="text-sm text-warm-gray">
              Automatically calculate savings when shoppers purchase multiple protective cases in one order.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-2">
              <Input
                label="Buy 2 Cases Discount (%)"
                type="number"
                value={bundleBuy2}
                onChange={(e) => setBundleBuy2(e.target.value)}
                placeholder="5"
              />
              <Input
                label="Buy 3+ Cases Discount (%)"
                type="number"
                value={bundleBuy3}
                onChange={(e) => setBundleBuy3(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-surface p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Free Express Delivery Threshold</h3>
            <p className="text-sm text-warm-gray">
              Orders at or above this amount automatically receive complimentary same-day Doha delivery.
            </p>
            <div className="max-w-xs pt-2">
              <Input
                label="Free Delivery Minimum (QR)"
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="cta" onClick={handleSaveBundleSettings} loading={savingSettings}>
              {savingSettings ? "Saving..." : "Save Bundle & Delivery Settings"}
            </Button>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: FLASH SALES ═══ */}
      {activeTab === "flash" && (
        <div className="space-y-4">
          {SAMPLE_FLASH_SALES.map((sale) => (
            <div key={sale.id} className="rounded-xl border border-dark-border bg-dark-surface p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{sale.name}</h3>
                  <p className="mt-1 text-sm text-warm-gray">
                    {sale.type === "percentage" ? `${sale.value}% off` : `QR ${sale.value} off`}
                  </p>
                  <p className="mt-1 text-xs text-warm-gray">
                    {sale.startsAt} → {sale.endsAt}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    sale.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-dark-surface text-warm-gray"
                  }`}
                >
                  {sale.status}
                </span>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <span className="text-warm-gray">Orders: <span className="text-white">{sale.orders}</span></span>
                <span className="text-warm-gray">Revenue: <span className="text-gold">{sale.revenue}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
