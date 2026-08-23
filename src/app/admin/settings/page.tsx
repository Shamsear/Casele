"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";

interface Settings {
  whatsapp_number: string;
  store_name: string;
  store_email: string;
  currency: string;
  tax_rate: string;
  meta_title: string;
  meta_description: string;
  instagram: string;
  website: string;
  social_proof_enabled: string;
  flash_sale_banner_enabled: string;
  bundle_suggestions_enabled: string;
}

const DEFAULT_SETTINGS: Settings = {
  whatsapp_number: "+97455364455",
  store_name: "CASELÉ",
  store_email: "info@casele.qa",
  currency: "QAR",
  tax_rate: "0",
  meta_title: "CASELÉ — Premium Phone Cases in Qatar",
  meta_description: "Premium mobile phone cases designed for style and durability. Shop now in Qatar.",
  instagram: "@casele.qa",
  website: "www.casele.qa",
  social_proof_enabled: "true",
  flash_sale_banner_enabled: "true",
  bundle_suggestions_enabled: "true",
};

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

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
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-h1 font-bold text-white">Settings</h1>
          <p className="mt-1 text-warm-gray">Loading...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-xl bg-dark-surface" />
          <div className="h-32 rounded-xl bg-dark-surface" />
          <div className="h-32 rounded-xl bg-dark-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-h1 font-bold text-white">Settings</h1>
        <p className="mt-1 text-warm-gray">Configure your store settings</p>
      </div>

      {/* WhatsApp */}
      <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">WhatsApp</h2>
        <p className="mt-1 text-sm text-warm-gray">
          Customers will send orders to this number
        </p>
        <div className="mt-4 max-w-md">
          <Input
            label="WhatsApp Number (with country code)"
            value={settings.whatsapp_number}
            onChange={(e) =>
              setSettings({ ...settings, whatsapp_number: e.target.value })
            }
            placeholder="+97455364455"
          />
          <p className="mt-1 text-xs text-warm-gray">
            Include country code without spaces. Example: +97455364455
          </p>
        </div>
      </section>

      {/* Shop Info */}
      <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">Shop Info</h2>
        <div className="mt-4 grid gap-4 max-w-md">
          <Input
            label="Shop Name"
            value={settings.store_name}
            onChange={(e) =>
              setSettings({ ...settings, store_name: e.target.value })
            }
          />
          <Input
            label="Store Email"
            type="email"
            value={settings.store_email}
            onChange={(e) =>
              setSettings({ ...settings, store_email: e.target.value })
            }
          />
        </div>
      </section>

      {/* Currency & Tax */}
      <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">Currency & Tax</h2>
        <div className="mt-4 grid gap-4 max-w-md">
          <Input
            label="Currency Code"
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
            placeholder="QAR"
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            value={settings.tax_rate}
            onChange={(e) =>
              setSettings({ ...settings, tax_rate: e.target.value })
            }
            placeholder="0"
          />
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">SEO</h2>
        <div className="mt-4 grid gap-4 max-w-md">
          <Input
            label="Meta Title"
            value={settings.meta_title}
            onChange={(e) =>
              setSettings({ ...settings, meta_title: e.target.value })
            }
          />
          <Input
            label="Meta Description"
            value={settings.meta_description}
            onChange={(e) =>
              setSettings({ ...settings, meta_description: e.target.value })
            }
          />
        </div>
      </section>

      {/* Social Links */}
      <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">Social Links</h2>
        <div className="mt-4 grid gap-4 max-w-md">
          <Input
            label="Instagram"
            value={settings.instagram}
            onChange={(e) =>
              setSettings({ ...settings, instagram: e.target.value })
            }
          />
          <Input
            label="Website"
            value={settings.website}
            onChange={(e) =>
              setSettings({ ...settings, website: e.target.value })
            }
          />
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
        <h2 className="text-lg font-semibold text-white">Features</h2>
        <div className="mt-4 space-y-4">
          <Switch
            checked={settings.social_proof_enabled === "true"}
            onCheckedChange={(v) =>
              setSettings({ ...settings, social_proof_enabled: String(v) })
            }
            label='Show "X people ordered today" on products'
          />
          <Switch
            checked={settings.flash_sale_banner_enabled === "true"}
            onCheckedChange={(v) =>
              setSettings({ ...settings, flash_sale_banner_enabled: String(v) })
            }
            label="Show flash sale countdown banner"
          />
          <Switch
            checked={settings.bundle_suggestions_enabled === "true"}
            onCheckedChange={(v) =>
              setSettings({ ...settings, bundle_suggestions_enabled: String(v) })
            }
            label="Show bundle suggestions after add-to-cart"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button variant="cta" onClick={handleSave} loading={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
