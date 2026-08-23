import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface CategoryDiscount {
  categoryId: string;
  categoryName: string;
  salePercent: number;
}

export async function getCategoryDiscount(
  categoryId: string
): Promise<CategoryDiscount | null> {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    const cat = result[0];
    if (!cat || !cat.salePercent) return null;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      salePercent: cat.salePercent,
    };
  } catch {
    return null;
  }
}

export function calculateCategoryDiscount(
  price: number,
  salePercent: number
): number {
  return Math.round((price * salePercent) / 100);
}
