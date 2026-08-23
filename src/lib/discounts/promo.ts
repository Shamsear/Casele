import { db } from "@/lib/db";
import { promoCodes, promoCodeUses } from "@/lib/db/schema";
import { eq, and, lte, gte, count } from "drizzle-orm";

interface PromoResult {
  valid: boolean;
  error?: string;
  discount: number;
  discountType?: string;
  discountValue?: number;
  code?: string;
  promoCodeId?: string;
}

export async function validatePromoCode(
  code: string,
  subtotal: number,
  customerPhone?: string
): Promise<PromoResult> {
  const normalizedCode = code.trim().toUpperCase();

  // Find the promo code
  let promo;
  try {
    const results = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, normalizedCode))
      .limit(1);

    promo = results[0];
  } catch {
    return { valid: false, error: "Invalid promo code", discount: 0 };
  }

  if (!promo) {
    return { valid: false, error: "Invalid promo code", discount: 0 };
  }

  // Check if active
  if (!promo.isActive) {
    return { valid: false, error: "This code is no longer active", discount: 0 };
  }

  // Check validity dates
  const now = new Date();
  if (promo.validFrom && promo.validFrom > now) {
    return { valid: false, error: "This code is not yet valid", discount: 0 };
  }
  if (promo.validUntil && promo.validUntil < now) {
    return { valid: false, error: "This code has expired", discount: 0 };
  }

  // Check min order
  const minOrder = parseFloat(promo.minOrder ?? "0");
  if (subtotal < minOrder) {
    return {
      valid: false,
      error: `Minimum order of QR ${minOrder} required`,
      discount: 0,
    };
  }

  // Check max uses
  if (promo.maxUses !== null && promo.maxUses > 0 && (promo.usedCount ?? 0) >= promo.maxUses) {
    return {
      valid: false,
      error: "This code has been used maximum times",
      discount: 0,
    };
  }

  // Check per-user limit
  if (customerPhone && promo.perUserLimit) {
    try {
      const usageCount = await db
        .select({ count: count() })
        .from(promoCodeUses)
        .where(
          and(
            eq(promoCodeUses.promoCodeId, promo.id),
            eq(promoCodeUses.customerPhone, customerPhone)
          )
        );

      if (promo.perUserLimit && usageCount[0].count >= promo.perUserLimit) {
        return {
          valid: false,
          error: "You have already used this code",
          discount: 0,
        };
      }
    } catch {
      // If DB unavailable, skip per-user check
    }
  }

  // Calculate discount
  let discount = 0;
  if (promo.discountType === "percentage") {
    discount = Math.round(
      (subtotal * parseFloat(promo.discountValue)) / 100
    );
  } else {
    discount = Math.min(
      parseFloat(promo.discountValue),
      subtotal
    );
  }

  return {
    valid: true,
    discount,
    discountType: promo.discountType,
    discountValue: parseFloat(promo.discountValue),
    code: normalizedCode,
    promoCodeId: promo.id,
  };
}
