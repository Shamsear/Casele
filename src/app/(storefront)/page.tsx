import { getAllProducts, getFeaturedProducts, getAllModels, getAllCategories } from "@/lib/db/products";
import { HomePageClient } from "@/components/home/home-page-client";

export default async function HomePage() {
  const [allProducts, featured, models, categories] = await Promise.all([
    getAllProducts(),
    getFeaturedProducts(),
    getAllModels(),
    getAllCategories(),
  ]);

  return (
    <HomePageClient
      allProducts={allProducts}
      featuredProducts={featured}
      models={models}
      categories={categories}
    />
  );
}
