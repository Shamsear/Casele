import { prisma } from "@/lib/db/prisma";

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

  try {
    const promo = await prisma.promoCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!promo) {
      return { valid: false, error: "Invalid promo code", discount: 0 };
    }

    // Check if active in database
    if (!promo.isActive) {
      return { valid: false, error: "This promo code is currently disabled", discount: 0 };
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
    const minOrder = Number(promo.minOrder);
    if (subtotal < minOrder) {
      return {
        valid: false,
        error: `Minimum order of QR ${minOrder} required`,
        discount: 0,
      };
    }

    // Check max uses
    if (promo.maxUses !== null && promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
      return {
        valid: false,
        error: "This code has reached its maximum usage limit",
        discount: 0,
      };
    }

    // Check per-user limit
    if (customerPhone && promo.perUserLimit) {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
      const usageCount = await prisma.promoCodeUse.count({
        where: {
          promoCodeId: promo.id,
          customerPhone: { contains: cleanPhone },
        },
      });

      if (usageCount >= promo.perUserLimit) {
        return {
          valid: false,
          error: "You have already used this promo code",
          discount: 0,
        };
      }
    }

    // Calculate discount
    const discountVal = Number(promo.discountValue);
    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = Math.round((subtotal * discountVal) / 100);
    } else {
      discount = Math.min(discountVal, subtotal);
    }

    return {
      valid: true,
      discount,
      discountType: promo.discountType,
      discountValue: discountVal,
      code: normalizedCode,
      promoCodeId: promo.id,
    };
  } catch (error) {
    console.error("validatePromoCode error:", error);
    return { valid: false, error: "Failed to validate promo code", discount: 0 };
  }
}
