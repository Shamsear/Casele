import { getAllProducts, getAllModels } from "@/lib/db/products";
import { ShopPageClient } from "@/components/shop/shop-page-client";

export default async function ShopPage() {
  const [products, models] = await Promise.all([
    getAllProducts(),
    getAllModels(),
  ]);

  const brands = ["All", ...Array.from(new Set(models.map((m) => m.brand)))];

  return <ShopPageClient products={products} models={models} brands={brands} />;
}
