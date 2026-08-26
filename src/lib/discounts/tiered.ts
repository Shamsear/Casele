import { prisma } from "@/lib/db/prisma";

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
  try {
    // Check if tier discounts are enabled in settings
    const tierSetting = await prisma.setting.findUnique({
      where: { key: "tier_discounts_enabled" },
    });
    if (tierSetting && tierSetting.value === "false") {
      return { applicablePercent: 0, discountAmount: 0, tierLabel: null };
    }

    const tiers = await prisma.tierDiscount.findMany({
      where: { isActive: true },
      orderBy: { minAmount: "asc" },
    });

    if (tiers && tiers.length > 0) {
      let applicablePercent = 0;
      let tierMin = 0;
      for (const tier of tiers) {
        const min = Number(tier.minAmount);
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
  } catch (error) {
    console.warn("DB tier discount calculation failed, using fallback:", error);
  }

  // Fallback default tiers
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
    tierLabel:
      applicablePercent > 0
        ? `Spend QR ${tierMin}+ and save ${applicablePercent}%`
        : null,
  };
}
