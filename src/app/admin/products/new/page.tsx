"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/components/ui/toast";

export default function CreateProductPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    badge: "",
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast("Please fill in required fields", "error");
      return;
    }
    if (images.length === 0) {
      toast("Please upload at least one image", "error");
      return;
    }
    // TODO: Save product with images to database
    toast("Product created successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h1 font-bold text-white">
          Create Product
        </h1>
        <p className="mt-1 text-warm-gray">Add a new product to your catalog</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
            <h2 className="text-lg font-semibold text-white">Basic Info</h2>
            <div className="mt-4 space-y-4">
              <Input
                label="Product Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Midnight Black Premium Case"
              />
              <div>
                <label className="block text-sm font-medium text-warm-gray mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="flex w-full rounded-lg border border-dark-border bg-dark-surface px-3 py-2 text-sm text-white placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                  placeholder="Describe your product..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
            <h2 className="text-lg font-semibold text-white">Images *</h2>
            <p className="mt-1 text-sm text-warm-gray/60">
              First image will be used as the primary product image
            </p>
            <div className="mt-4">
              <ImageUpload
                value={images}
                onChange={setImages}
                maxFiles={5}
                folder="products"
              />
            </div>
          </section>

          <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
            <h2 className="text-lg font-semibold text-white">SEO</h2>
            <div className="mt-4 space-y-4">
              <Input
                label="Meta Title"
                value={form.metaTitle}
                onChange={(e) =>
                  setForm({ ...form, metaTitle: e.target.value })
                }
              />
              <Input
                label="Meta Description"
                value={form.metaDescription}
                onChange={(e) =>
                  setForm({ ...form, metaDescription: e.target.value })
                }
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
            <h2 className="text-lg font-semibold text-white">Pricing</h2>
            <div className="mt-4 space-y-4">
              <Input
                label="Price (QR) *"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <Input
                label="Compare Price (QR)"
                type="number"
                value={form.comparePrice}
                onChange={(e) =>
                  setForm({ ...form, comparePrice: e.target.value })
                }
              />
            </div>
          </section>

          <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
            <h2 className="text-lg font-semibold text-white">Organization</h2>
            <div className="mt-4 space-y-4">
              <Select
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                options={[
                  { value: "classic", label: "Classic" },
                  { value: "premium", label: "Premium" },
                  { value: "sport", label: "Sport" },
                  { value: "designer", label: "Designer" },
                ]}
                placeholder="Select category"
              />
              <Select
                label="Badge"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                options={[
                  { value: "new", label: "NEW" },
                  { value: "bestseller", label: "BESTSELLER" },
                  { value: "sale", label: "SALE" },
                ]}
                placeholder="No badge"
              />
            </div>
          </section>

          <section className="rounded-xl border border-dark-border bg-dark-surface p-6">
            <h2 className="text-lg font-semibold text-white">Phone Models</h2>
            <p className="mt-2 text-sm text-warm-gray">
              Select which phone models this case fits
            </p>
            <div className="mt-3 space-y-2">
              {[
                "iPhone 15 Pro Max",
                "iPhone 15 Pro",
                "iPhone 15",
                "iPhone 14 Pro Max",
                "Samsung Galaxy S24 Ultra",
                "Samsung Galaxy S24+",
                "Samsung Galaxy S24",
                "Samsung Galaxy S23 Ultra",
                "Samsung Galaxy Z Fold5",
                "Huawei P60 Pro",
                "Huawei Mate 60 Pro",
                "OnePlus 12",
              ].map((model) => (
                <label
                  key={model}
                  className="flex items-center gap-2 text-sm text-warm-gray"
                >
                  <input type="checkbox" className="rounded border-dark-border bg-dark-surface text-gold focus:ring-gold/30" />
                  {model}
                </label>
              ))}
            </div>
          </section>

          <Button variant="cta" className="w-full" onClick={handleSave}>
            Create Product
          </Button>
        </div>
      </div>
    </div>
  );
}
