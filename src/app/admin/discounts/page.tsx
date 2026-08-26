"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import {
  Percent,
  Plus,
  Trash2,
  Tag,
  Clock,
  Sparkles,
  Zap,
  Power,
  PowerOff,
  Inbox
} from "lucide-react";

interface TierDiscount {
  id: string;
  minAmount: number;
  discountPercent: number;
  isActive: boolean;
}

interface FlashSale {
  id: string;
  name: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  timingStatus: "upcoming" | "live" | "expired";
}

export default function AdminDiscountsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"tiered" | "flash" | "bundle">("tiered");

  // Tier discounts state
  const [tiers, setTiers] = useState<TierDiscount[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);

  // Flash sales state
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loadingFlash, setLoadingFlash] = useState(true);

  // Bundle & Threshold settings
  const [bundleBuy2, setBundleBuy2] = useState("5");
  const [bundleBuy3, setBundleBuy3] = useState("10");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("100");
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState("true");
  const [bundleEnabled, setBundleEnabled] = useState("true");
  const [tierEnabled, setTierEnabled] = useState("true");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchTiers();
    fetchFlashSales();
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
    } catch (err) {
      console.error("Failed to load tiers:", err);
    } finally {
      setLoadingTiers(false);
    }
  };

  const fetchFlashSales = async () => {
    try {
      setLoadingFlash(true);
      const res = await fetch("/api/admin/flash-sales");
      if (res.ok) {
        const data = await res.json();
        setFlashSales(data.sales || []);
      }
    } catch (err) {
      console.error("Failed to load flash sales:", err);
    } finally {
      setLoadingFlash(false);
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
          if (data.settings.free_delivery_enabled !== undefined) setFreeDeliveryEnabled(data.settings.free_delivery_enabled);
          if (data.settings.bundle_discounts_enabled) setBundleEnabled(data.settings.bundle_discounts_enabled);
          if (data.settings.tier_discounts_enabled) setTierEnabled(data.settings.tier_discounts_enabled);
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  // ─── Tiers Actions ─────────────────────────────────────────────
  const handleToggleTierMaster = async () => {
    const nextVal = tierEnabled === "true" ? "false" : "true";
    setTierEnabled(nextVal);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            tier_discounts_enabled: nextVal,
          },
        }),
      });
      if (res.ok) {
        toast(
          `Tiered spend discounts are now ${nextVal === "true" ? "ACTIVE" : "DEACTIVATED"}`,
          nextVal === "true" ? "success" : "info"
        );
      }
    } catch {
      toast("Failed to update tier discount setting", "error");
    }
  };

  const handleToggleTier = async (tier: TierDiscount) => {
    try {
      const nextActive = !tier.isActive;
      const res = await fetch("/api/admin/discounts/tiered", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tier.id,
          isActive: nextActive,
        }),
      });

      if (res.ok) {
        toast(`Spend Tier (QR ${tier.minAmount}+) is now ${nextActive ? "ACTIVE" : "DEACTIVATED"}`, nextActive ? "success" : "info");
        setTiers((prev) =>
          prev.map((t) => (t.id === tier.id ? { ...t, isActive: nextActive } : t))
        );
      } else {
        toast("Failed to update tier status", "error");
      }
    } catch {
      toast("Failed to update tier status", "error");
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spend tier?")) return;
    try {
      const res = await fetch(`/api/admin/discounts/tiered?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Spend tier deleted", "success");
        setTiers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      toast("Failed to delete tier", "error");
    }
  };

  // ─── Flash Sales Actions ──────────────────────────────────────
  const handleToggleFlashSale = async (sale: FlashSale) => {
    try {
      const nextActive = !sale.isActive;
      const res = await fetch("/api/admin/flash-sales", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sale.id,
          isActive: nextActive,
        }),
      });

      if (res.ok) {
        toast(
          `Flash sale is now ${nextActive ? "ACTIVE" : "DEACTIVATED"}`,
          nextActive ? "success" : "info"
        );
        setFlashSales((prev) =>
          prev.map((s) => (s.id === sale.id ? { ...s, isActive: nextActive } : s))
        );
      }
    } catch {
      toast("Failed to update flash sale status", "error");
    }
  };

  const handleDeleteFlashSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flash sale?")) return;
    try {
      const res = await fetch(`/api/admin/flash-sales?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Flash sale deleted", "success");
        setFlashSales((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      toast("Failed to delete flash sale", "error");
    }
  };

  // ─── Bundle Settings Actions ──────────────────────────────────
  const handleToggleBundleMaster = async () => {
    const nextVal = bundleEnabled === "true" ? "false" : "true";
    setBundleEnabled(nextVal);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            bundle_discounts_enabled: nextVal,
            bundle_buy_2_discount: String(bundleBuy2),
            bundle_buy_3_discount: String(bundleBuy3),
          },
        }),
      });
      if (res.ok) {
        toast(
          `Multi-case bundle discounts are now ${nextVal === "true" ? "ACTIVE" : "DEACTIVATED"}`,
          nextVal === "true" ? "success" : "info"
        );
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Failed to update bundle discount setting", "error");
      }
    } catch {
      toast("Failed to update bundle discount setting", "error");
    }
  };

  const handleToggleFreeDelivery = async () => {
    const nextVal = freeDeliveryEnabled === "false" ? "true" : "false";
    setFreeDeliveryEnabled(nextVal);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            free_delivery_enabled: nextVal,
            free_delivery_threshold: String(freeDeliveryThreshold),
          },
        }),
      });
      if (res.ok) {
        toast(
          `Free delivery threshold is now ${nextVal === "true" ? "ACTIVE" : "DEACTIVATED"} across all store pages`,
          nextVal === "true" ? "success" : "info"
        );
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Failed to update free delivery setting", "error");
      }
    } catch {
      toast("Failed to update free delivery setting", "error");
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
            bundle_buy_2_discount: String(bundleBuy2),
            bundle_buy_3_discount: String(bundleBuy3),
            free_delivery_threshold: String(freeDeliveryThreshold),
            free_delivery_enabled: String(freeDeliveryEnabled),
            bundle_discounts_enabled: String(bundleEnabled),
            tier_discounts_enabled: String(tierEnabled),
          },
        }),
      });

      if (res.ok) {
        toast("Bundle savings and delivery rules saved successfully!", "success");
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Failed to save settings", "error");
      }
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Discounts & Promotional Sales
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Manage live tiered spend incentives, time/date-scheduled flash deals, and instant deactivation toggles
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
          onClick={() => setActiveTab("flash")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "flash"
              ? "bg-neutral-950 text-white shadow-xs"
              : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Time & Date Flash Sales</span>
          <span className="rounded-full bg-neutral-200/60 px-1.5 py-0.2 text-[10px] font-mono text-neutral-700">
            {flashSales.length}
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
          <span>Multi-Case Bundles & Delivery</span>
        </button>
      </div>

      {/* ═══ TAB 1: TIERED SPEND DISCOUNTS ═══ */}
      {activeTab === "tiered" && (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-950">Spend Tier Rules</h3>
                {tierEnabled === "false" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 uppercase">
                    Master Deactivated
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                Automatic percentage savings triggered when cart subtotal reaches target amount
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* Master 1-Click Activate / Deactivate Toggle Button */}
              <button
                type="button"
                onClick={handleToggleTierMaster}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs ${
                  tierEnabled === "true"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                }`}
              >
                {tierEnabled === "true" ? <Power className="h-3.5 w-3.5" /> : <PowerOff className="h-3.5 w-3.5" />}
                <span>{tierEnabled === "true" ? "Tiers Active" : "Tiers Deactivated"}</span>
              </button>

              <Link
                href="/admin/discounts/tiered/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spend Tier</span>
              </Link>
            </div>
          </div>

          {/* Tiers List */}
          {loadingTiers ? (
            <AdminTableSkeleton rows={3} cols={3} />
          ) : tiers.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              <div className="space-y-3">
                <Inbox className="h-8 w-8 text-neutral-300 mx-auto" />
                <p className="text-xs text-neutral-500 font-medium">No spend tiers created in database yet.</p>
                <Link
                  href="/admin/discounts/tiered/new"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Spend Tier</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-all hover:bg-neutral-50 ${
                    tier.isActive && tierEnabled === "true"
                      ? "bg-neutral-50/50 border-neutral-200/70"
                      : "bg-neutral-50/20 border-neutral-200/40 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 font-medium">Cart Subtotal</span>
                    <span className="text-xs font-bold text-neutral-950 font-mono">QR {tier.minAmount}+</span>
                    <span className="text-xs text-neutral-400">→</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">{tier.discountPercent}% OFF</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Individual Tier Active / Deactivate Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleTier(tier)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider cursor-pointer transition-all shadow-2xs ${
                        tier.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      {tier.isActive ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                      <span>{tier.isActive ? "Active (Deactivate)" : "Inactive (Activate)"}</span>
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

      {/* ═══ TAB 2: TIME & DATE BASED FLASH SALES ═══ */}
      {activeTab === "flash" && (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-950">Time & Date Scheduled Flash Sales</h3>
              <p className="text-xs text-neutral-500">
                Create countdown sales with specific start & end dates/times, or deactivate instantly with 1 click
              </p>
            </div>
            <Link
              href="/admin/discounts/flash-sales/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Flash Sale</span>
            </Link>
          </div>

          {/* Flash Sales List */}
          {loadingFlash ? (
            <AdminTableSkeleton rows={3} cols={4} />
          ) : flashSales.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              <div className="space-y-3">
                <Inbox className="h-8 w-8 text-neutral-300 mx-auto" />
                <p className="text-xs text-neutral-500 font-medium">No scheduled flash sales in database.</p>
                <Link
                  href="/admin/discounts/flash-sales/new"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Schedule First Flash Sale</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {flashSales.map((sale) => {
                const isLive = sale.isActive && sale.timingStatus === "live";
                const isUpcoming = sale.isActive && sale.timingStatus === "upcoming";
                const isExpired = sale.timingStatus === "expired";
                const isDeactivated = !sale.isActive;

                return (
                  <div
                    key={sale.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-neutral-50/50 border border-neutral-200/70 p-4 transition-all hover:bg-neutral-50 hover:border-neutral-300"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-neutral-950 text-sm">{sale.name}</h4>
                        {/* Live Timing Badge */}
                        {isLive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live on Store
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
                            Scheduled
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200">
                            Expired
                          </span>
                        )}
                        {isDeactivated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                            Hidden / Deactivated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600">
                        <span className="font-bold text-neutral-950">
                          {sale.discountType === "percentage" ? `${sale.discountValue}% OFF` : `QR ${sale.discountValue} OFF`}
                        </span>{" "}
                        • Window: <span className="font-mono text-neutral-500">{new Date(sale.startsAt).toLocaleString()} → {new Date(sale.endsAt).toLocaleString()}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* One-Click Instant Deactivate / Activate Button */}
                      <button
                        onClick={() => handleToggleFlashSale(sale)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          sale.isActive
                            ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                        title={sale.isActive ? "Click to deactivate and immediately hide from storefront" : "Click to activate"}
                      >
                        {sale.isActive ? (
                          <>
                            <PowerOff className="h-3.5 w-3.5" />
                            <span>Deactivate Sale</span>
                          </>
                        ) : (
                          <>
                            <Power className="h-3.5 w-3.5" />
                            <span>Activate Sale</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteFlashSale(sale.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Sale"
                        aria-label="Delete Sale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB 3: MULTI-CASE BUNDLES & DELIVERY ═══ */}
      {activeTab === "bundle" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-950">Multi-Case Bundle Volume Discounts</h3>
                <p className="text-xs text-neutral-500">
                  Automatic percentage savings calculated when shoppers buy 2 or 3+ cases in a single order
                </p>
              </div>
              {/* Deactivate switch */}
              <button
                type="button"
                onClick={handleToggleBundleMaster}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  bundleEnabled === "true"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                }`}
              >
                {bundleEnabled === "true" ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                <span>{bundleEnabled === "true" ? "Bundles Active" : "Bundles Deactivated"}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-1">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-950">Free Express Delivery Threshold</h3>
                <p className="text-xs text-neutral-500">
                  Orders at or above this amount automatically receive complimentary same-day Doha delivery.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleFreeDelivery}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  freeDeliveryEnabled !== "false"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                }`}
              >
                {freeDeliveryEnabled !== "false" ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                <span>{freeDeliveryEnabled !== "false" ? "Free Delivery Active" : "Free Delivery Deactivated"}</span>
              </button>
            </div>
            <div className="max-w-xs pt-1 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Free Delivery Minimum (QR)</label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                placeholder="100"
                disabled={freeDeliveryEnabled === "false"}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs disabled:opacity-50"
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
