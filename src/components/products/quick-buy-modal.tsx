"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { X, MessageSquare, ShieldCheck, Truck } from "lucide-react";

interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    modelName: string;
    finish?: string;
    caseType?: string;
    image?: string;
    quantity: number;
  };
  whatsappNumber: string;
}

export function QuickBuyModal({
  isOpen,
  onClose,
  product,
  whatsappNumber,
}: QuickBuyModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Load saved contact info if returning shopper
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("casele_customer_name");
      const savedPhone = localStorage.getItem("casele_customer_phone");
      if (savedName) setCustomerName(savedName);
      if (savedPhone) setCustomerPhone(savedPhone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = product.price * product.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerPhone.length < 8) return;

    // Save to localStorage for instant repeat checkouts
    if (typeof window !== "undefined") {
      localStorage.setItem("casele_customer_name", customerName.trim());
      localStorage.setItem("casele_customer_phone", customerPhone.trim());
    }

    const message = buildWhatsAppMessage({
      customerName: customerName.trim(),
      customerPhone: `+974 ${customerPhone.trim()}`,
      items: [
        {
          name: product.name,
          model: product.modelName,
          finish: product.finish,
          caseType: product.caseType,
          qty: product.quantity,
          price: product.price,
        },
      ],
      subtotal: totalAmount,
      tierDiscount: 0,
      flashDiscount: 0,
      bundleDiscount: 0,
      promoDiscount: 0,
      total: totalAmount,
    });

    openWhatsApp(whatsappNumber, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-in text-neutral-950">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A88B4D] block">
            Express Order
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-neutral-950 mt-0.5">
            Instant WhatsApp Checkout
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Provide your details so our Qatar concierge can dispatch your case immediately.
          </p>
        </div>

        {/* Selected Product Summary Card */}
        <div className="flex items-center gap-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3.5">
          {product.image && (
            <div className="relative h-12 w-12 rounded-xl bg-white border border-neutral-200/60 overflow-hidden shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-neutral-950 truncate">{product.name}</p>
            <p className="text-[11px] text-neutral-500 truncate">
              {product.modelName} {product.finish ? `• ${product.finish}` : ""} × {product.quantity}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-neutral-950 font-mono">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Your Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Rashid Al-Kuwari"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              WhatsApp Contact Number (+974) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-bold font-mono">
                +974
              </span>
              <input
                type="tel"
                placeholder="5512 3456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                required
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-14 pr-3.5 text-xs font-mono font-bold text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none shadow-2xs"
                inputMode="numeric"
                maxLength={8}
              />
            </div>
            <p className="text-[10px] text-neutral-400">8-digit Qatar mobile number.</p>
          </div>

          {/* Delivery & Payment Note */}
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-[11px] text-neutral-600">
            <Truck className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            <span>Same-Day Doha Delivery • Cash on Delivery / Card</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!customerName.trim() || customerPhone.length < 8}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Continue to WhatsApp ({formatPrice(totalAmount)})</span>
          </button>
        </form>
      </div>
    </div>
  );
}
