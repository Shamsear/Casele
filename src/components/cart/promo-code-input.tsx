"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast";

export function PromoCodeInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);
  const promoCode = useCartStore((s) => s.promoCode);
  const promoDiscount = useCartStore((s) => s.promoDiscount);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (data.valid) {
        applyPromo(code.trim(), data.discount);
        toast(`Promo code applied! You save ₹${data.discount}`);
        setCode("");
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Failed to validate code");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removePromo();
    toast("Promo code removed");
  };

  // If promo is already applied
  if (promoCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-gold/20 bg-gold/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span>
          <span className="text-sm font-medium text-gold">
            {promoCode}
          </span>
          <span className="text-xs text-warm-gray">
            (-₹{promoDiscount})
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-xs text-warm-gray hover:text-white transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-warm-gray hover:text-gold transition-colors"
        >
          + Have a promo code?
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              className="flex-1 uppercase"
            />
            <Button
              variant="secondary"
              onClick={handleApply}
              loading={loading}
              disabled={!code.trim()}
            >
              Apply
            </Button>
            <button
              onClick={() => {
                setIsOpen(false);
                setCode("");
                setError("");
              }}
              className="text-xs text-warm-gray hover:text-white"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}
