"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import {
  Search,
  ShoppingBag,
  MessageSquare,
  ExternalLink,
  Filter,
  Inbox,
  Plus,
  Trash2,
  X,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Info,
  Copy,
  ClipboardCheck,
  Wand2
} from "lucide-react";

interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  items: number;
  total: number;
  status: string;
  time: string;
  address: string;
  createdAt: string;
  itemsDetail?: { productId?: string; name: string; model: string; qty: number; price: number }[];
  deliverySpeed?: string;
  notes?: string;
}

interface ProductOption {
  id: string;
  name: string;
  price: string | number;
  models?: { name: string; slug: string }[];
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  dispatched: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual Order Creation Modal State
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [productsCatalog, setProductsCatalog] = useState<ProductOption[]>([]);
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

  // Confirmation Success Modal
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    customer: string;
    phone: string;
    total: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchCatalog();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProductsCatalog(data);
          if (data.length > 0) {
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
      }
    } catch (err) {
      console.error("Failed to load catalog for order creation:", err);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        toast(`Order status updated to ${newStatus}`, "success");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast("Failed to update order status", "error");
      }
    } catch {
      toast("Failed to update order status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── 1-Click Copy Delivery Address Request Template ──────────
  const handleCopyTemplate = () => {
    const template = `*CASELÉ ATELIER QATAR — DELIVERY DETAILS*\nThank you for choosing CASELÉ! Please share your delivery location to dispatch your order:\n\n• Area / District (e.g. The Pearl, Lusail, West Bay):\n• Street & Building / Villa #:\n• Preferred Delivery Time (e.g. After 4 PM):\n• Payment: Cash on Delivery / Card`;
    navigator.clipboard.writeText(template);
    toast("Delivery Request copied to clipboard! Paste it to your client.", "success");
  };

  // ─── Parse & Auto-Fill from Pasted WhatsApp Text ──────────────
  const handleAutoFillFromWhatsApp = () => {
    if (!pastedWhatsAppText.trim()) {
      toast("Please paste the customer's WhatsApp message first", "error");
      return;
    }

    const text = pastedWhatsAppText;

    // 1. Extract Client Name (from website cart message or custom chat)
    const nameMatch =
      text.match(/(?:client|name|full name)[:\s•\-\*]+([^\n\r,•]+)/i);
    if (nameMatch && nameMatch[1]) {
      setCustomerName(nameMatch[1].replace(/[\*\_]/g, "").trim());
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

    // 5. Parse Item Rows from WhatsApp Message
    const parsedRows: { productId: string; name: string; model: string; qty: number; price: number }[] = [];
    const itemLines = text.split("\n").filter((l) => l.includes("•") && (l.includes("×") || l.includes("QR") || l.includes("[")));

    for (const line of itemLines) {
      // e.g. • *Titanium Edge Case* [iPhone 15 Pro Max • Black] × 2 — QR 170
      let matchedProd = productsCatalog[0];
      for (const p of productsCatalog) {
        if (line.toLowerCase().includes(p.name.toLowerCase())) {
          matchedProd = p;
          break;
        }
      }

      // Extract model inside brackets [iPhone 15 Pro Max ...]
      let model = matchedProd?.models?.[0]?.name || "iPhone 15 Pro Max";
      const bracketMatch = line.match(/\[([^\]]+)\]/);
      if (bracketMatch && bracketMatch[1]) {
        const specParts = bracketMatch[1].split("•");
        if (specParts[0]) model = specParts[0].trim();
      }

      // Extract quantity
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
    } else {
      // Fallback single product matching
      let matchedProduct = productsCatalog[0];
      for (const p of productsCatalog) {
        if (text.toLowerCase().includes(p.name.toLowerCase())) {
          matchedProduct = p;
          break;
        }
      }
      if (matchedProduct) {
        setOrderItems([
          {
            productId: matchedProduct.id,
            name: matchedProduct.name,
            model: "iPhone 15 Pro Max",
            qty: 1,
            price: Number(matchedProduct.price) || 85,
          },
        ]);
      }
    }

    // 6. Extract Delivery Speed if mentioned
    if (/next\s*day|tomorrow/i.test(text)) {
      setDeliverySpeed("next_day");
    } else if (/express|urgent|2\s*hour/i.test(text)) {
      setDeliverySpeed("express");
    } else if (/standard/i.test(text)) {
      setDeliverySpeed("standard");
    } else if (/schedule|friday|saturday|sunday|monday|tuesday|wednesday|thursday/i.test(text)) {
      setDeliverySpeed("scheduled");
    } else {
      setDeliverySpeed("same_day");
    }

    toast("Order auto-filled from WhatsApp message!", "success");
    setShowAutoFillBox(false);
  };

  // ─── Manual Order Creation Handlers ───────────────────────────
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

  const calculatedSubtotal = orderItems.reduce(
    (acc, it) => acc + Number(it.price) * (Number(it.qty) || 1),
    0
  );
  const calculatedTotal = Math.max(0, calculatedSubtotal - Number(orderDiscount || 0));

  const handleCreateManualOrder = async () => {
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
        toast("WhatsApp order successfully logged in database!", "success");
        setIsCreatingOrder(false);
        setConfirmedOrder({
          id: data.order?.id || "NEW-ORDER",
          customer: customerName.trim(),
          phone: customerPhone.trim(),
          total: calculatedTotal,
          address: deliveryAddress.trim() || "Doha, Qatar",
        });
        // Reset form
        setCustomerName("");
        setCustomerPhone("+974 ");
        setDeliveryAddress("");
        setDeliverySpeed("same_day");
        setOrderNotes("");
        setOrderDiscount("0");
        setPastedWhatsAppText("");
        fetchOrders();
      } else {
        toast("Failed to log order", "error");
      }
    } catch {
      toast("Failed to log order", "error");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === "all" || o.status === activeTab;
    const matchesSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.address.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Client Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Live database order queue received via WhatsApp bookings and online checkouts
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1-Click Copy WhatsApp Template */}
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
            title="Copy WhatsApp order form template to send to customer"
          >
            <Copy className="h-3.5 w-3.5 text-[#A88B4D]" />
            <span>Copy Address Request</span>
          </button>

          {/* Primary Action: Log Manual WhatsApp Order */}
          <button
            type="button"
            onClick={() => setIsCreatingOrder(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Log WhatsApp Order</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Orders", count: counts.all },
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed },
            { id: "dispatched", label: "Dispatched", count: counts.dispatched },
            { id: "delivered", label: "Delivered", count: counts.delivered },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeTab === tab.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by client name, ID, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Orders Table or Shimmer Skeleton */}
      {loading ? (
        <AdminTableSkeleton rows={6} cols={6} />
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-4 py-3.5">Client</th>
                  <th className="px-4 py-3.5">Delivery Destination</th>
                  <th className="px-4 py-3.5">Items</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Fulfillment Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="space-y-3">
                        <Inbox className="h-8 w-8 text-neutral-300 mx-auto" />
                        <p className="text-xs text-neutral-500 font-medium">No orders recorded in database yet.</p>
                        <button
                          onClick={() => setIsCreatingOrder(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Log First WhatsApp Order</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const badge = STATUS_CONFIG[order.status] || {
                      bg: "bg-neutral-100",
                      text: "text-neutral-700",
                      border: "border-neutral-200",
                    };
                    return (
                      <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono font-bold text-neutral-950">{order.id}</span>
                          <p className="text-[10px] text-neutral-400 font-mono">{order.time}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-neutral-950">{order.customer}</span>
                          <p className="text-[11px] text-neutral-500 font-mono">{order.phone}</p>
                        </td>
                        <td className="px-4 py-3.5 text-neutral-700 font-medium">
                          <div>{order.address}</div>
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 font-mono">
                              {order.deliverySpeed === "next_day"
                                ? "📦 Next-Day"
                                : order.deliverySpeed === "standard"
                                ? "🚚 Standard (1-2d)"
                                : order.deliverySpeed === "express"
                                ? "🚀 Express 2hr"
                                : order.deliverySpeed === "scheduled"
                                ? "📅 Scheduled"
                                : "⚡ Same-Day"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-neutral-500 font-medium">
                          {order.items} cases
                        </td>
                        <td className="px-4 py-3.5 font-bold text-neutral-950">
                          QR {order.total}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="dispatched">DISPATCHED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${order.customer}, your CASELÉ delivery status is now [${order.status.toUpperCase()}]. Track live delivery here: https://casele.vercel.app/track?id=${order.id}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] font-bold uppercase tracking-wider text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                              title="Send live tracking link to client on WhatsApp"
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </a>
                            <Link
                              href={`/track?id=${order.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 hover:border-neutral-300 transition-colors shadow-2xs"
                              title="View Public Tracking Page"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
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

      {/* ═══ MODAL 1: CREATE WHATSAPP ORDER WITH AUTO-FILL ═══ */}
      {isCreatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-950">
                  Log WhatsApp Client Order
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Select cases from your website catalog or paste the customer's WhatsApp message to auto-fill
                </p>
              </div>
              <button
                onClick={() => setIsCreatingOrder(false)}
                className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-950 transition-colors shadow-2xs cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Auto-Fill Tool Banner */}
            <div className="rounded-xl border border-[#C5A869]/40 bg-[#C5A869]/10 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <Wand2 className="h-4 w-4 text-[#A88B4D]" />
                  <span>Fast WhatsApp Message Auto-Fill</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAutoFillBox(!showAutoFillBox)}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#A88B4D] hover:underline cursor-pointer"
                >
                  {showAutoFillBox ? "Hide Paste Box" : "+ Paste Message to Auto-Fill"}
                </button>
              </div>

              {showAutoFillBox && (
                <div className="space-y-2 pt-1 animate-scale-in">
                  <textarea
                    rows={3}
                    placeholder="Paste customer's WhatsApp response here (Name, Phone, Case, Address)..."
                    value={pastedWhatsAppText}
                    onChange={(e) => setPastedWhatsAppText(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAutoFillFromWhatsApp}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>Parse & Auto-Fill Fields</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Client Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rashid Al-Kuwari"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Delivery Address in Qatar */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Delivery Address in Qatar</label>
                <input
                  type="text"
                  placeholder="e.g. The Pearl - Porto Arabia, Tower 22, Apt 501, Doha"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>

              {/* Website Catalog Product Selection */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                    Website Cases Selected ({orderItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#A88B4D] hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Another Case</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center rounded-xl bg-neutral-50/70 border border-neutral-200/70 p-3"
                    >
                      {/* Product Selector (Strictly from Website Catalog) */}
                      <div className="col-span-5">
                        <label className="text-[10px] text-neutral-400 font-semibold uppercase">Product from Catalog</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full h-8 px-2 rounded-lg border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950"
                        >
                          {productsCatalog.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (QR {p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Phone Model */}
                      <div className="col-span-3">
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
                          className="w-full h-8 px-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-950 focus:border-neutral-950"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
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
                          className="w-full h-8 px-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-950 font-mono text-center"
                        />
                      </div>

                      {/* Price QR */}
                      <div className="col-span-2 flex items-center justify-between gap-1">
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
                            className="w-full h-8 px-2 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-950 font-mono text-center"
                          />
                        </div>
                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1 mt-3 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status, Delivery Speed & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Order Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
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
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 text-xs font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
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
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Special Instructions / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Cash on delivery, deliver after 5 PM..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="rounded-xl bg-neutral-950 text-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Order Amount</span>
                  <p className="text-xs text-neutral-300">
                    Subtotal QR {calculatedSubtotal} {Number(orderDiscount) > 0 ? `- QR ${orderDiscount} Discount` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-white tracking-tight">
                    QR {calculatedTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingOrder(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateManualOrder}
                disabled={submittingOrder}
                className="rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {submittingOrder ? "Saving Order..." : "Save & Log WhatsApp Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL 2: CONFIRMATION SUCCESS & WHATSAPP CONFIRMATION SENDER ═══ */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-neutral-950">Order Logged Successfully!</h3>
              <p className="text-xs text-neutral-500 font-medium">
                Order <span className="font-mono font-bold text-neutral-950">#{confirmedOrder.id}</span> is saved in the database.
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

              <button
                type="button"
                onClick={() => setConfirmedOrder(null)}
                className="rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
