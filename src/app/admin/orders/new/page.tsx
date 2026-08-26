"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Copy,
  Wand2,
  MessageSquare,
  ShoppingBag,
  Clock,
  Truck,
  DollarSign
} from "lucide-react";

interface ProductOption {
  id: string;
  name: string;
  price: string | number;
  models?: { name: string; slug: string }[];
}

export default function NewOrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [productsCatalog, setProductsCatalog] = useState<ProductOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+974 ");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState("confirmed");
  const [deliverySpeed, setDeliverySpeed] = useState("same_day");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderDiscount, setOrderDiscount] = useState("0");
  const [pastedWhatsAppText, setPastedWhatsAppText] = useState("");
  const [showAutoFillBox, setShowAutoFillBox] = useState(false);

  const [orderItems, setOrderItems] = useState<
    { productId: string; name: string; model: string; qty: number; price: number }[]
  >([
    { productId: "", name: "", model: "iPhone 15 Pro Max", qty: 1, price: 85 },
  ]);

  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Confirmation Success State
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    customer: string;
    phone: string;
    total: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoadingCatalog(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProductsCatalog(data);
          setOrderItems([
            {
              productId: data[0].id,
              name: data[0].name,
              model: data[0].models?.[0]?.name || "iPhone 15 Pro Max",
              qty: 1,
              price: Number(data[0].price) || 85,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to load catalog:", err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  const handleAddItemRow = () => {
    const firstProd = productsCatalog[0];
    setOrderItems((prev) => [
      ...prev,
      {
        productId: firstProd?.id || "",
        name: firstProd?.name || "Luxury Case",
        model: firstProd?.models?.[0]?.name || "iPhone 15 Pro Max",
        qty: 1,
        price: Number(firstProd?.price) || 85,
      },
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (orderItems.length === 1) return;
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleProductSelect = (idx: number, prodId: string) => {
    const found = productsCatalog.find((p) => p.id === prodId);
    if (!found) return;

    setOrderItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              productId: found.id,
              name: found.name,
              price: Number(found.price) || 85,
              model: found.models?.[0]?.name || item.model || "iPhone 15 Pro Max",
            }
          : item
      )
    );
  };

  // Auto-Fill from WhatsApp Text
  const handleAutoFillFromWhatsApp = () => {
    if (!pastedWhatsAppText.trim()) {
      toast("Please paste the customer's WhatsApp message first", "error");
      return;
    }

    const text = pastedWhatsAppText;

    // 1. Extract Client Name
    const nameMatch = text.match(/(?:client|name|full name)[:\s•\-\*]+([^\n\r,•]+)/i);
    if (nameMatch && nameMatch[1]) {
      const parsedName = nameMatch[1].replace(/[\*\_]/g, "").trim();
      if (parsedName && parsedName.toLowerCase() !== "customer") {
        setCustomerName(parsedName);
      }
    }

    // 2. Extract Phone Number
    const phoneMatch =
      text.match(/(?:contact|phone|mobile|tel|wa)[:\s•\-\*]+([0-9\+\s\-]+)/i) ||
      text.match(/(\+?974\s?[0-9]{8}|[3567][0-9]{7})/);
    if (phoneMatch && phoneMatch[1]) {
      let cleanP = phoneMatch[1].replace(/[\*\_]/g, "").trim();
      if (!cleanP.startsWith("+974") && cleanP.length === 8) {
        cleanP = "+974 " + cleanP;
      }
      setCustomerPhone(cleanP);
    }

    // 3. Extract Delivery Address
    const addressMatch = text.match(
      /(?:delivery location|delivery address|location|area|address)[:\s•\-\*]+([^\n\r•]+)/i
    );
    if (addressMatch && addressMatch[1]) {
      const parsedAddr = addressMatch[1].replace(/[\*\_]/g, "").trim();
      if (!parsedAddr.includes("Please confirm area")) {
        setDeliveryAddress(parsedAddr);
      }
    }

    // 4. Extract Notes / Preferred Time
    const notesMatch = text.match(
      /(?:notes|note|time|preferred time|special|payment)[:\s•\-\*]+([^\n\r•]+)/i
    );
    if (notesMatch && notesMatch[1]) {
      setOrderNotes(notesMatch[1].replace(/[\*\_]/g, "").trim());
    }

    // 5. Parse Item Rows
    const parsedRows: { productId: string; name: string; model: string; qty: number; price: number }[] = [];
    const itemLines = text.split("\n").filter((l) => l.includes("•") && (l.includes("×") || l.includes("QR") || l.includes("[")));

    for (const line of itemLines) {
      let matchedProd = productsCatalog[0];
      for (const p of productsCatalog) {
        if (line.toLowerCase().includes(p.name.toLowerCase())) {
          matchedProd = p;
          break;
        }
      }

      let model = matchedProd?.models?.[0]?.name || "iPhone 15 Pro Max";
      const bracketMatch = line.match(/\[([^\]]+)\]/);
      if (bracketMatch && bracketMatch[1]) {
        const specParts = bracketMatch[1].split("•");
        if (specParts[0]) model = specParts[0].trim();
      }

      let qty = 1;
      const qtyMatch = line.match(/[×x]\s*(\d+)/i);
      if (qtyMatch && qtyMatch[1]) {
        qty = parseInt(qtyMatch[1], 10) || 1;
      }

      if (matchedProd) {
        parsedRows.push({
          productId: matchedProd.id,
          name: matchedProd.name,
          model,
          qty,
          price: Number(matchedProd.price) || 85,
        });
      }
    }

    if (parsedRows.length > 0) {
      setOrderItems(parsedRows);
    }

    // 6. Extract Delivery Speed
    if (/next\s*day|tomorrow/i.test(text)) {
      setDeliverySpeed("next_day");
    } else if (/express|urgent|2\s*hour/i.test(text)) {
      setDeliverySpeed("express");
    } else if (/standard/i.test(text)) {
      setDeliverySpeed("standard");
    } else if (/schedule|friday|saturday|sunday|monday|tuesday|wednesday|thursday/i.test(text)) {
      setDeliverySpeed("scheduled");
    }

    toast("Order fields auto-filled from WhatsApp message!", "success");
    setShowAutoFillBox(false);
  };

  const calculatedSubtotal = orderItems.reduce(
    (acc, it) => acc + Number(it.price) * (Number(it.qty) || 1),
    0
  );
  const calculatedTotal = Math.max(0, calculatedSubtotal - Number(orderDiscount || 0));

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      toast("Please provide client name and phone number", "error");
      return;
    }

    if (orderItems.some((it) => !it.productId || it.qty <= 0 || it.price < 0)) {
      toast("Please select valid products from catalog", "error");
      return;
    }

    try {
      setSubmittingOrder(true);
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          address: deliveryAddress.trim() || "Doha, Qatar",
          items: orderItems,
          subtotal: calculatedSubtotal,
          discount: Number(orderDiscount || 0),
          total: calculatedTotal,
          status: orderStatus,
          deliverySpeed,
          notes: orderNotes.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast("WhatsApp order successfully saved to database!", "success");
        setConfirmedOrder({
          id: data.order?.id || "NEW-ORDER",
          customer: customerName.trim(),
          phone: customerPhone.trim(),
          total: calculatedTotal,
          address: deliveryAddress.trim() || "Doha, Qatar",
        });
      } else {
        toast("Failed to save order", "error");
      }
    } catch {
      toast("Failed to save order", "error");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orders List</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Log WhatsApp Client Order
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
              Create a verified order in the PostgreSQL database from a customer WhatsApp booking
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAutoFillBox(!showAutoFillBox)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#C5A869]/40 bg-[#C5A869]/10 px-3.5 py-2 text-xs font-bold text-[#A88B4D] hover:bg-[#C5A869]/20 transition-colors shadow-2xs cursor-pointer w-fit"
          >
            <Wand2 className="h-4 w-4" />
            <span>{showAutoFillBox ? "Hide Auto-Fill Box" : "Auto-Fill from WhatsApp Message"}</span>
          </button>
        </div>
      </div>

      {/* Auto-Fill Tool Banner */}
      {showAutoFillBox && (
        <div className="rounded-2xl border border-[#C5A869]/40 bg-[#C5A869]/10 p-5 space-y-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-950">
              <Wand2 className="h-4 w-4 text-[#A88B4D]" />
              <span>Paste Customer WhatsApp Message to Auto-Fill</span>
            </div>
          </div>
          <textarea
            rows={4}
            placeholder="Paste the customer's 1st message or details here (Client name, phone, cases, address)..."
            value={pastedWhatsAppText}
            onChange={(e) => setPastedWhatsAppText(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 font-mono"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAutoFillFromWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Parse & Fill All Fields</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Order Creation Form */}
      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Client Info & Selected Cases */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Details Card */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider border-b border-neutral-100 pb-3">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Client Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rashid Al-Kuwari"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">WhatsApp Phone *</label>
                <input
                  type="text"
                  placeholder="+974 5512 3456"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Delivery Address in Qatar</label>
              <input
                type="text"
                placeholder="e.g. The Pearl - Porto Arabia, Tower 22, Apt 501, Doha"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Product Items Card */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                2. Selected Phone Cases ({orderItems.length})
              </h2>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#A88B4D] hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Case</span>
              </button>
            </div>

            <div className="space-y-3">
              {orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-3 items-center rounded-xl bg-neutral-50/70 border border-neutral-200/80 p-3.5"
                >
                  {/* Product Dropdown */}
                  <div className="col-span-12 sm:col-span-5">
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase">Product from Catalog</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductSelect(idx, e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 cursor-pointer"
                    >
                      {productsCatalog.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (QR {p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Model */}
                  <div className="col-span-6 sm:col-span-3">
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase">Phone Model</label>
                    <input
                      type="text"
                      value={item.model}
                      onChange={(e) =>
                        setOrderItems((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, model: e.target.value } : it))
                        )
                      }
                      placeholder="e.g. iPhone 15 Pro Max"
                      className="w-full h-9 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-950 focus:border-neutral-950"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3 sm:col-span-2">
                    <label className="text-[10px] text-neutral-400 font-semibold uppercase">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        setOrderItems((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, qty: Number(e.target.value) || 1 } : it))
                        )
                      }
                      className="w-full h-9 px-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-950 font-mono text-center"
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-between gap-1">
                    <div>
                      <label className="text-[10px] text-neutral-400 font-semibold uppercase">Price QR</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          setOrderItems((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, price: Number(e.target.value) || 0 } : it))
                          )
                        }
                        className="w-full h-9 px-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-950 font-mono text-center"
                      />
                    </div>
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1 mt-3.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Fulfillment, Delivery Speed & Total Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider border-b border-neutral-100 pb-3">
              3. Delivery & Status
            </h2>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Fulfillment Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs cursor-pointer"
                >
                  <option value="confirmed">CONFIRMED</option>
                  <option value="pending">PENDING</option>
                  <option value="dispatched">DISPATCHED</option>
                  <option value="delivered">DELIVERED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Delivery Speed</label>
                <select
                  value={deliverySpeed}
                  onChange={(e) => setDeliverySpeed(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs cursor-pointer"
                >
                  <option value="same_day">⚡ Same-Day Doha</option>
                  <option value="next_day">📦 Next-Day Qatar</option>
                  <option value="standard">🚚 Standard (1-2 Days)</option>
                  <option value="express">🚀 Express 2-Hour VIP</option>
                  <option value="scheduled">📅 Scheduled Date</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Discount (QR)</label>
                <input
                  type="number"
                  value={orderDiscount}
                  onChange={(e) => setOrderDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Special Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Cash on delivery, deliver after 5 PM..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="rounded-xl bg-neutral-950 text-white p-5 space-y-3">
              <div className="flex justify-between text-xs text-neutral-300">
                <span>Subtotal ({orderItems.length} items)</span>
                <span>QR {calculatedSubtotal}</span>
              </div>
              {Number(orderDiscount) > 0 && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Discount</span>
                  <span>- QR {orderDiscount}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-neutral-800 pt-3">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">Total Due</span>
                <span className="font-display text-2xl font-bold text-white tracking-tight">
                  QR {calculatedTotal}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingOrder}
              className="w-full rounded-xl bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-98 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {submittingOrder ? "Saving Order..." : "Save & Log WhatsApp Order"}
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Success Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-neutral-950">Order Logged Successfully!</h3>
              <p className="text-xs text-neutral-500 font-medium">
                Order <span className="font-mono font-bold text-neutral-950">#{confirmedOrder.id}</span> is recorded in PostgreSQL.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-3.5 text-left text-xs space-y-1 font-mono text-neutral-700">
              <p><strong>Client:</strong> {confirmedOrder.customer}</p>
              <p><strong>Phone:</strong> {confirmedOrder.phone}</p>
              <p><strong>Total:</strong> QR {confirmedOrder.total}</p>
              <p><strong>Delivery:</strong> {confirmedOrder.address}</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`https://wa.me/${confirmedOrder.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${confirmedOrder.customer}, your CASELÉ Atelier order #${confirmedOrder.id} has been confirmed!\n\nTotal: QR ${confirmedOrder.total}\nDelivery: ${confirmedOrder.address}\n\nTrack live delivery: https://casele.vercel.app/track?id=${confirmedOrder.id}\n\nThank you for choosing CASELÉ Luxury Protection Qatar.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send WhatsApp Receipt to Client</span>
              </a>

              <Link
                href="/admin/orders"
                className="rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-center"
              >
                Back to Orders List
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
