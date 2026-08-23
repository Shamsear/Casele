import { getProductsByCategorySlug, getCategoryBySlug } from "@/lib/db/products";
import { CategoryPageClient } from "@/components/shop/category-page-client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, category] = await Promise.all([
    getProductsByCategorySlug(slug),
    getCategoryBySlug(slug),
  ]);

  const displayName =
    category?.name ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <CategoryPageClient
      products={products}
      displayName={displayName}
      description={category?.description}
    />
  );
}
