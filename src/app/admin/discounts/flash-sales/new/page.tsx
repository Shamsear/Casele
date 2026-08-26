"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Zap, Calendar, Sparkles } from "lucide-react";

interface ProductOption {
  id: string;
  name: string;
  price: string | number;
}

export default function NewFlashSalePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [productsCatalog, setProductsCatalog] = useState<ProductOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [saleTitle, setSaleTitle] = useState("");
  const [saleDiscount, setSaleDiscount] = useState("20");
  const [saleStartDate, setSaleStartDate] = useState("");
  const [saleEndDate, setSaleEndDate] = useState("");
  const [saleProductId, setSaleProductId] = useState("");
  const [saleBannerText, setSaleBannerText] = useState("");
  const [initialActive, setInitialActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCatalog();
    // Default start to right now, and end to 48 hours later
    const now = new Date();
    const future = new Date(Date.now() + 48 * 3600 * 1000);
    setSaleStartDate(toLocalISO(now));
    setSaleEndDate(toLocalISO(future));
  }, []);

  const toLocalISO = (d: Date) => {
    const pad = (n: number) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fetchCatalog = async () => {
    try {
      setLoadingCatalog(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setProductsCatalog(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingCatalog(false);
    }
  };

  const handleCreateFlashSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!saleTitle.trim() || !saleDiscount || !saleStartDate || !saleEndDate) {
      toast("Please provide title, discount %, start date, and end date", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/flash-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: saleTitle.trim(),
          discountPercent: Number(saleDiscount),
          startDate: new Date(saleStartDate).toISOString(),
          endDate: new Date(saleEndDate).toISOString(),
          productId: saleProductId || null,
          bannerText: saleBannerText.trim() || null,
          isActive: initialActive,
        }),
      });

      if (res.ok) {
        toast("Flash sale scheduled successfully!", "success");
        router.push("/admin/discounts");
      } else {
        toast("Failed to schedule flash sale", "error");
      }
    } catch {
      toast("Failed to schedule flash sale", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/discounts"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Discounts & Promotions</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Schedule Time & Date Flash Sale
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          Create countdown promotions with precise start/end datetime ranges and storefront banners
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleCreateFlashSale}
        className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Flash Sale Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Qatar National Day Sale, Weekend Flash"
                value={saleTitle}
                onChange={(e) => setSaleTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Discount Percentage (%) *
              </label>
              <input
                type="number"
                placeholder="e.g. 20 for 20% OFF"
                value={saleDiscount}
                onChange={(e) => setSaleDiscount(e.target.value)}
                min="1"
                max="90"
                required
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Start Date & Time (Qatar Time) *
              </label>
              <input
                type="datetime-local"
                value={saleStartDate}
                onChange={(e) => setSaleStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-mono text-neutral-950 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                End Date & Time (Qatar Time) *
              </label>
              <input
                type="datetime-local"
                value={saleEndDate}
                onChange={(e) => setSaleEndDate(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-mono text-neutral-950 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Apply Discount To
            </label>
            <select
              value={saleProductId}
              onChange={(e) => setSaleProductId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs cursor-pointer"
            >
              <option value="">⚡ Entire Storefront (All Luxury Cases)</option>
              {productsCatalog.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (QR {p.price})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Storefront Announcement Banner Text (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. FLASH DEAL: 20% OFF Everything for 48 Hours!"
              value={saleBannerText}
              onChange={(e) => setSaleBannerText(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Initial Active Switch */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div>
              <span className="text-xs font-bold text-neutral-900">Sale Status</span>
              <p className="text-[11px] text-neutral-500">
                Choose whether this sale should be active within its scheduled date window
              </p>
            </div>
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
                {initialActive ? "Active" : "Deactivated"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link
            href="/admin/discounts"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {submitting ? "Scheduling..." : "Schedule Flash Sale"}
          </button>
        </div>
      </form>
    </div>
  );
}
