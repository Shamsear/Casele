import { db } from "@/lib/db";
import { flashSales } from "@/lib/db/schema";
import { and, eq, lte, gte } from "drizzle-orm";

interface FlashSaleResult {
  activeSale: {
    id: string;
    name: string;
    discountType: string;
    discountValue: number;
    endsAt: Date;
  } | null;
  discountAmount: number;
}

export async function calculateFlashDiscount(
  subtotal: number,
  productIds?: string[]
): Promise<FlashSaleResult> {
  const now = new Date();

  let sales;
  try {
    sales = await db
      .select()
      .from(flashSales)
      .where(
        and(
          eq(flashSales.isActive, true),
          lte(flashSales.startsAt, now),
          gte(flashSales.endsAt, now)
        )
      );
  } catch {
    return { activeSale: null, discountAmount: 0 };
  }

  if (!sales || sales.length === 0) {
    return { activeSale: null, discountAmount: 0 };
  }

  // Find the best (highest) flash sale
  let bestSale = sales[0];
  let bestDiscount = 0;

  for (const sale of sales) {
    let applies = false;

    if (sale.appliesTo === "all") {
      applies = true;
    } else if (sale.appliesTo === "products" && productIds && sale.appliesToIds) {
      applies = sale.appliesToIds.some((id) => productIds.includes(id));
    }
    // Category sales would need product category lookup — simplified here

    if (!applies) continue;

    let discount = 0;
    if (sale.discountType === "percentage") {
      discount = Math.round(
        (subtotal * parseFloat(sale.discountValue)) / 100
      );
    } else {
      discount = parseFloat(sale.discountValue);
    }

    if (discount > bestDiscount) {
      bestDiscount = discount;
      bestSale = sale;
    }
  }

  return {
    activeSale: bestDiscount > 0
      ? {
          id: bestSale.id,
          name: bestSale.name,
          discountType: bestSale.discountType,
          discountValue: parseFloat(bestSale.discountValue),
          endsAt: bestSale.endsAt,
        }
      : null,
    discountAmount: bestDiscount,
  };
}

export async function getActiveFlashSale() {
  const now = new Date();

  try {
    const sales = await db
      .select()
      .from(flashSales)
      .where(
        and(
          eq(flashSales.isActive, true),
          lte(flashSales.startsAt, now),
          gte(flashSales.endsAt, now)
        )
      )
      .limit(1);

    return sales[0] || null;
  } catch {
    return null;
  }
}
