import { getFeaturedProducts, getAllModels, getAllCategories } from "@/lib/db/products";
import { HomePageClient } from "@/components/home/home-page-client";

export default async function HomePage() {
  const [featured, models, categories] = await Promise.all([
    getFeaturedProducts(),
    getAllModels(),
    getAllCategories(),
  ]);

  return (
    <HomePageClient
      featured={featured}
      models={models}
      categories={categories}
    />
  );
}
