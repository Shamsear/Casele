import { db } from "@/lib/db";
import { tierDiscounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface TierResult {
  applicablePercent: number;
  discountAmount: number;
  tierLabel: string | null;
}

const DEFAULT_TIERS = [
  { min: 50, percent: 5 },
  { min: 100, percent: 10 },
  { min: 200, percent: 15 },
];

export async function calculateTierDiscount(
  subtotal: number
): Promise<TierResult> {
  let tiers;

  try {
    tiers = await db
      .select()
      .from(tierDiscounts)
      .where(eq(tierDiscounts.isActive, true))
      .orderBy(tierDiscounts.sortOrder);
  } catch {
    // Fallback to defaults if DB unavailable
    tiers = DEFAULT_TIERS.map((t, i) => ({
      id: "",
      minAmount: String(t.min),
      discountPercent: t.percent,
      isActive: true,
      sortOrder: i,
    }));
  }

  if (!tiers || tiers.length === 0) {
    // Use defaults
    let applicablePercent = 0;
    let tierMin = 0;
    for (const tier of DEFAULT_TIERS) {
      if (subtotal >= tier.min) {
        applicablePercent = tier.percent;
        tierMin = tier.min;
      }
    }
    const discountAmount = Math.round((subtotal * applicablePercent) / 100);
    return {
      applicablePercent,
      discountAmount,
      tierLabel: applicablePercent > 0
        ? `Spend QR ${tierMin}+ and save ${applicablePercent}%`
        : null,
    };
  }

  let applicablePercent = 0;
  let tierMin = 0;
  for (const tier of tiers) {
    const min = parseFloat(tier.minAmount);
    if (subtotal >= min && tier.discountPercent > applicablePercent) {
      applicablePercent = tier.discountPercent;
      tierMin = min;
    }
  }

  const discountAmount = Math.round((subtotal * applicablePercent) / 100);

  return {
    applicablePercent,
    discountAmount,
    tierLabel:
      applicablePercent > 0
        ? `Spend QR ${tierMin}+ and save ${applicablePercent}%`
        : null,
  };
}
