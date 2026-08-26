"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { Settings as SettingsIcon, MessageSquare, Store, Globe, Tag, Truck, Percent, ShieldCheck, Plus, Trash2, Sliders } from "lucide-react";

interface Settings {
  whatsapp_number: string;
  store_name: string;
  store_email: string;
  currency: string;
  tax_rate: string;
  free_delivery_threshold: string;
  express_delivery_fee: string;
  bundle_buy_2_discount: string;
  bundle_buy_3_discount: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  announcement_text: string;
  meta_title: string;
  meta_description: string;
  instagram: string;
  website: string;
  social_proof_enabled: string;
  flash_sale_banner_enabled: string;
  bundle_suggestions_enabled: string;
  tier_discounts_enabled: string;
  bundle_discounts_enabled: string;
}

const DEFAULT_SETTINGS: Settings = {
  whatsapp_number: "+97455364455",
  store_name: "CASELÉ",
  store_email: "info@casele.qa",
  currency: "QAR",
  tax_rate: "0",
  free_delivery_threshold: "100",
  express_delivery_fee: "20",
  bundle_buy_2_discount: "5",
  bundle_buy_3_discount: "10",
  hero_badge: "Doha, Qatar • Luxury Protection",
  hero_title: "Sculpted for Flagships.",
  hero_subtitle: "Artistry in Armor.",
  hero_description: "Every silhouette is machined with aerospace-grade composites and tactile metallic accents. Hand-finished in Qatar for discerning device owners.",
  announcement_text: "Complimentary Doha Express Delivery on Orders Over QR 100",
  meta_title: "CASELÉ — Premium Phone Cases in Qatar",
  meta_description: "Premium mobile phone cases designed for style and durability. Shop now in Qatar.",
  instagram: "https://www.instagram.com/casele_premium_mobile_case?igsi=MW55cTM4MmN6dGF3ag%3D%3D&utm_source=qr",
  website: "www.casele.co",
  social_proof_enabled: "true",
  flash_sale_banner_enabled: "true",
  bundle_suggestions_enabled: "true",
  tier_discounts_enabled: "true",
  bundle_discounts_enabled: "true",
};

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Database Admin Users State
  const [adminUsers, setAdminUsers] = useState<{ id: string; name: string; email: string; createdAt: string }[]>([]);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.admins || []);
      }
    } catch {}
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdminUser = async () => {
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      toast("Please enter name, email, and password", "error");
      return;
    }

    try {
      setAddingAdmin(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdminName.trim(),
          email: newAdminEmail.trim(),
          password: newAdminPassword.trim(),
        }),
      });

      if (res.ok) {
        toast("New database admin user created", "success");
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setShowAddAdminModal(false);
        fetchAdmins();
      } else {
        const data = await res.json();
        toast(data.error || "Failed to create admin user", "error");
      }
    } catch {
      toast("Failed to create admin user", "error");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleDeleteAdminUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin account from the database?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Admin user deleted", "success");
        setAdminUsers((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json();
        toast(data.error || "Failed to delete admin user", "error");
      }
    } catch {
      toast("Failed to delete admin user", "error");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast("Settings saved successfully", "success");
      } else {
        const error = await response.json();
        toast(error.error || "Failed to save settings", "error");
      }
    } catch (error) {
      toast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2 animate-pulse">
          <div className="h-8 w-64 rounded-xl bg-neutral-200" />
          <div className="h-4 w-96 rounded-lg bg-neutral-100" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4 animate-pulse">
              <div className="h-5 w-48 rounded-md bg-neutral-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 rounded-xl bg-neutral-100" />
                <div className="h-10 rounded-xl bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Title & Save Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Store Settings & Copy
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Configure WhatsApp ordering, landing hero texts, announcement offers, and database administrator accounts
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800 active:scale-95 transition-all self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save All Settings"}
        </button>
      </div>

      {/* 1. Hero Section & Announcement Bar */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <h2 className="text-base font-bold text-neutral-950">Hero Landing & Editorial Copy</h2>
          <p className="text-xs text-neutral-500">
            Control the main headline, subtitle, location badge, and announcement bar on the storefront
          </p>
        </div>
        <div className="grid gap-4 max-w-2xl pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Top Announcement Bar Offer Text</label>
            <input
              type="text"
              value={settings.announcement_text}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              placeholder="Complimentary Doha Express Delivery on Orders Over QR 100"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Hero Badge Pill</label>
            <input
              type="text"
              value={settings.hero_badge}
              onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })}
              placeholder="Doha, Qatar • Luxury Protection"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Headline Line 1</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                placeholder="Sculpted for Flagships."
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Headline Line 2 (Italic Accent)</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                placeholder="Artistry in Armor."
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Editorial Description Paragraph</label>
            <textarea
              rows={2}
              value={settings.hero_description}
              onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
              placeholder="Every silhouette is machined with aerospace-grade composites..."
              className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* 2. WhatsApp Checkout Integration */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <h2 className="text-base font-bold text-neutral-950">WhatsApp Order Destination</h2>
          <p className="text-xs text-neutral-500">
            Customers will automatically forward their cart items and delivery addresses to this WhatsApp number
          </p>
        </div>
        <div className="max-w-md space-y-1 pt-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">WhatsApp Phone Number (with Country Code)</label>
          <input
            type="text"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+97455364455"
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono font-bold text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
          />
          <p className="text-[10.5px] text-neutral-500">Example format: +97455364455</p>
        </div>
      </section>

      {/* 3. Delivery Rates & Free Threshold */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <h2 className="text-base font-bold text-neutral-950">Doha Express Delivery</h2>
          <p className="text-xs text-neutral-500">
            Delivery fees and minimum cart value for free same-day shipping
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Free Express Delivery Minimum (QR)</label>
            <input
              type="number"
              value={settings.free_delivery_threshold}
              onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
              placeholder="100"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Standard Delivery Fee (QR)</label>
            <input
              type="number"
              value={settings.express_delivery_fee}
              onChange={(e) => setSettings({ ...settings, express_delivery_fee: e.target.value })}
              placeholder="20"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* 4. Database Admin Accounts Management */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-neutral-950">Database Administrator Accounts</h2>
            <p className="text-xs text-neutral-500">
              Manage authorized administrator users stored and authenticated in your PostgreSQL database
            </p>
          </div>
          {!showAddAdminModal && (
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Admin User</span>
            </button>
          )}
        </div>

        {/* Add Admin User Form */}
        {showAddAdminModal && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-3 animate-scale-in shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">Create Database Admin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Admin Name</label>
                <input
                  type="text"
                  placeholder="e.g. Operations Manager"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Email Address</label>
                <input
                  type="email"
                  placeholder="ops@casele.co"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAdminUser}
                disabled={addingAdmin}
                className="rounded-xl bg-neutral-950 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {addingAdmin ? "Saving..." : "Save Admin Account"}
              </button>
            </div>
          </div>
        )}

        {/* Admins Table */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Storage</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-neutral-400">
                    Primary Database Admin active (admin@casele.co)
                  </td>
                </tr>
              ) : (
                adminUsers.map((admin) => (
                  <tr key={admin.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-neutral-950">
                      {admin.name}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-neutral-950">
                      {admin.email}
                    </td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">
                      PostgreSQL Database
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteAdminUser(admin.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                        title="Remove Admin Account"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
