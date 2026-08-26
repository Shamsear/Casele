import { prisma } from "@/lib/db/prisma";

interface TierResult {
  applicablePercent: number;
  discountAmount: number;
  tierLabel: string | null;
}

export async function calculateTierDiscount(
  subtotal: number
): Promise<TierResult> {
  try {
    // 1. Check if tier discounts are enabled globally in settings
    const tierSetting = await prisma.setting.findUnique({
      where: { key: "tier_discounts_enabled" },
    });
    if (tierSetting && tierSetting.value === "false") {
      return { applicablePercent: 0, discountAmount: 0, tierLabel: null };
    }

    // 2. Fetch active tiers from PostgreSQL
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

    // If database returned tiers array and none are active / configured, return 0
    return { applicablePercent: 0, discountAmount: 0, tierLabel: null };
  } catch (error) {
    console.warn("DB tier discount calculation failed:", error);
    return { applicablePercent: 0, discountAmount: 0, tierLabel: null };
  }
}
