import { calculateTierDiscount } from "./tiered";
import { calculateFlashDiscount } from "./flash";
import { calculateBundleDiscount } from "./bundle";
import { validatePromoCode } from "./promo";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface DiscountBreakdown {
  subtotal: number;
  tierDiscount: number;
  tierLabel: string | null;
  flashDiscount: number;
  flashLabel: string | null;
  promoDiscount: number;
  promoLabel: string | null;
  promoCode: string | null;
  bundleDiscount: number;
  bundleLabel: string | null;
  totalDiscount: number;
  total: number;
  savings: number;
}

export async function calculateAllDiscounts(
  items: CartItem[],
  promoCode?: string,
  customerPhone?: string
): Promise<DiscountBreakdown> {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Calculate each discount type in parallel
  const [tierResult, flashResult, bundleResult] = await Promise.all([
    calculateTierDiscount(subtotal),
    calculateFlashDiscount(
      subtotal,
      items.map((i) => i.productId)
    ),
    calculateBundleDiscount(items),
  ]);

  // Promo code validation
  let promoResult = { valid: false, discount: 0, discountType: "", code: "" };
  if (promoCode) {
    const result = await validatePromoCode(
      promoCode,
      subtotal - tierResult.discountAmount - flashResult.discountAmount - bundleResult.discount,
      customerPhone
    );
    if (result.valid) {
      promoResult = {
        valid: true,
        discount: result.discount,
        discountType: result.discountType || "",
        code: result.code || "",
      };
    }
  }

  const totalDiscount =
    tierResult.discountAmount +
    flashResult.discountAmount +
    promoResult.discount +
    bundleResult.discount;

  const total = Math.max(0, subtotal - totalDiscount);

  return {
    subtotal,
    tierDiscount: tierResult.discountAmount,
    tierLabel: tierResult.tierLabel,
    flashDiscount: flashResult.discountAmount,
    flashLabel: flashResult.activeSale
      ? `${flashResult.activeSale.name}: ${flashResult.activeSale.discountType === "percentage" ? flashResult.activeSale.discountValue + "%" : "QR " + flashResult.activeSale.discountValue} off`
      : null,
    promoDiscount: promoResult.discount,
    promoLabel: promoResult.valid
      ? `Promo code: ${promoResult.code}`
      : null,
    promoCode: promoResult.valid ? promoResult.code : null,
    bundleDiscount: bundleResult.discount,
    bundleLabel: bundleResult.label,
    totalDiscount,
    total,
    savings: totalDiscount,
  };
}
