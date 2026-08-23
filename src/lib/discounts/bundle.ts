import { db } from "@/lib/db";
import { productBundles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface BundleItem {
  productId: string;
  qty: number;
  price: number;
}

interface BundleResult {
  discount: number;
  label: string | null;
}

export async function calculateBundleDiscount(
  items: BundleItem[]
): Promise<BundleResult> {
  if (items.length < 2) return { discount: 0, label: null };

  try {
    // Get all bundle rules for products in cart
    const productIds = items.map((i) => i.productId);
    const bundles = await db
      .select()
      .from(productBundles);

    if (!bundles || bundles.length === 0) {
      return { discount: 0, label: null };
    }

    let totalBundleDiscount = 0;
    let bestBundleLabel = "";

    for (const bundle of bundles) {
      const hasProduct = items.some((i) => i.productId === bundle.productId);
      const hasBundled = items.some(
        (i) => i.productId === bundle.bundledProductId
      );

      if (hasProduct && hasBundled && bundle.bundleDiscount) {
        const bundleItem = items.find(
          (i) => i.productId === bundle.bundledProductId
        );
        if (bundleItem) {
          const itemDiscount = Math.round(
            (bundleItem.price *
              bundleItem.qty *
              bundle.bundleDiscount) /
              100
          );
          totalBundleDiscount += itemDiscount;
          bestBundleLabel = `Bundle discount: ${bundle.bundleDiscount}% off`;
        }
      }
    }

    // Also check quantity-based bundles (buy X get Y% off)
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    if (totalQty >= 3) {
      const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      );
      const qtyDiscount = Math.round(subtotal * 0.1); // 10% for 3+
      if (qtyDiscount > totalBundleDiscount) {
        totalBundleDiscount = qtyDiscount;
        bestBundleLabel = "Buy 3+ and save 10%";
      }
    } else if (totalQty >= 2) {
      const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      );
      const qtyDiscount = Math.round(subtotal * 0.05); // 5% for 2
      if (qtyDiscount > totalBundleDiscount) {
        totalBundleDiscount = qtyDiscount;
        bestBundleLabel = "Buy 2 and save 5%";
      }
    }

    return {
      discount: totalBundleDiscount,
      label: bestBundleLabel || null,
    };
  } catch {
    // Fallback: simple quantity-based bundles
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    if (totalQty >= 3) {
      const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      );
      return {
        discount: Math.round(subtotal * 0.1),
        label: "Buy 3+ and save 10%",
      };
    }
    if (totalQty >= 2) {
      const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      );
      return {
        discount: Math.round(subtotal * 0.05),
        label: "Buy 2 and save 5%",
      };
    }
    return { discount: 0, label: null };
  }
}

export async function getBundleRecommendations(
  productId: string
): Promise<
  {
    id: string;
    name: string;
    price: number;
    image: string;
    bundleDiscount: number;
  }[]
> {
  try {
    const bundles = await db
      .select()
      .from(productBundles)
      .where(eq(productBundles.productId, productId));

    // In production, join with products table to get details
    return bundles.map((b) => ({
      id: b.bundledProductId,
      name: "Recommended Case",
      price: 0,
      image: "/placeholder-case.jpg",
      bundleDiscount: b.bundleDiscount || 0,
    }));
  } catch {
    return [];
  }
}
