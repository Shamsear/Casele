import { getProductsByModel, getModelBySlug } from "@/lib/db/products";
import { ModelPageClient } from "@/components/shop/model-page-client";

export default async function ModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model: modelSlug } = await params;
  const [products, model] = await Promise.all([
    getProductsByModel(modelSlug),
    getModelBySlug(modelSlug),
  ]);

  const displayName =
    model?.name ||
    modelSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <ModelPageClient
      products={products}
      displayName={displayName}
      modelSlug={modelSlug}
    />
  );
}
