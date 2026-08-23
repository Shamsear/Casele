import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/products/product-detail-client";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ model: string; product: string }>;
}) {
  const { model: modelSlug, product: productSlug } = await params;

  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, modelSlug, 4);

  return (
    <ProductDetailClient
      product={product}
      modelSlug={modelSlug}
      productSlug={productSlug}
      relatedProducts={relatedProducts}
    />
  );
}
