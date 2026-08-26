import { prisma } from "@/lib/db/prisma";

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

  let buy2Percent = 5;
  let buy3Percent = 10;
  let bundleEnabled = true;

  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            "bundle_buy_2_discount",
            "bundle_buy_3_discount",
            "bundle_discounts_enabled",
          ],
        },
      },
    });

    settings.forEach((s) => {
      if (s.key === "bundle_buy_2_discount") buy2Percent = Number(s.value) || 5;
      if (s.key === "bundle_buy_3_discount") buy3Percent = Number(s.value) || 10;
      if (s.key === "bundle_discounts_enabled") bundleEnabled = s.value === "true";
    });

    if (!bundleEnabled) {
      return { discount: 0, label: null };
    }

    // Get all product pairing bundle rules from DB
    const bundles = await prisma.productBundle.findMany();

    let totalBundleDiscount = 0;
    let bestBundleLabel = "";

    if (bundles && bundles.length > 0) {
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
    }

    // Also calculate quantity-based bundle savings (buy X get Y% off)
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    if (totalQty >= 3 && buy3Percent > 0) {
      const qtyDiscount = Math.round((subtotal * buy3Percent) / 100);
      if (qtyDiscount > totalBundleDiscount) {
        totalBundleDiscount = qtyDiscount;
        bestBundleLabel = `Buy 3+ cases and save ${buy3Percent}%`;
      }
    } else if (totalQty >= 2 && buy2Percent > 0) {
      const qtyDiscount = Math.round((subtotal * buy2Percent) / 100);
      if (qtyDiscount > totalBundleDiscount) {
        totalBundleDiscount = qtyDiscount;
        bestBundleLabel = `Buy 2 cases and save ${buy2Percent}%`;
      }
    }

    return {
      discount: totalBundleDiscount,
      label: bestBundleLabel || null,
    };
  } catch (error) {
    console.warn("Bundle calculation DB error, using default fallback:", error);
    // Fallback: simple quantity-based bundles
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    if (totalQty >= 3) {
      return {
        discount: Math.round(subtotal * 0.1),
        label: "Buy 3+ and save 10%",
      };
    }
    if (totalQty >= 2) {
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
    const bundles = await prisma.productBundle.findMany({
      where: { productId },
      include: {
        bundledProduct: true,
      },
    });

    return bundles.map((b) => ({
      id: b.bundledProductId,
      name: b.bundledProduct?.name || "Recommended Case",
      price: Number(b.bundledProduct?.price) || 0,
      image: b.bundledProduct?.images?.[0] || "/placeholder-case.jpg",
      bundleDiscount: b.bundleDiscount || 0,
    }));
  } catch {
    return [];
  }
}
