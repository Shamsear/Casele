import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAllProducts } from "@/lib/db/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        productModels: {
          include: { model: true },
        },
      },
    });

    if (product) {
      const models = product.productModels.map((pm) => ({
        id: pm.model.id,
        name: pm.model.modelName,
        slug: pm.model.slug,
        brand: pm.model.brand,
        stock: pm.stock,
      }));
      const totalStock = models.reduce((acc, m) => acc + (m.stock || 0), 0);

      return NextResponse.json({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        images: product.images.length > 0 ? product.images : ["/images/products/midnight-black.svg"],
        badge: product.badge,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        categoryId: product.categoryId,
        categoryName: product.category?.name ?? "Collection",
        modelSlug: product.productModels[0]?.model.slug ?? "iphone-15-pro",
        modelName: product.productModels[0]?.model.modelName ?? "iPhone 15 Pro",
        stock: totalStock,
        inStock: totalStock > 0,
        models,
      });
    }
  } catch (err) {
    console.error("Error fetching product by ID from DB:", err);
  }

  // Fallback
  const allFallback = await getAllProducts();
  const fallbackMatch = allFallback.find((p) => p.id === id || p.slug === id);
  if (fallbackMatch) {
    return NextResponse.json({
      ...fallbackMatch,
      price: Number(fallbackMatch.price),
      comparePrice: fallbackMatch.comparePrice ? Number(fallbackMatch.comparePrice) : null,
    });
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price !== undefined ? body.price : undefined,
        comparePrice: body.comparePrice !== undefined ? body.comparePrice : null,
        images: body.images || [],
        badge: body.badge || null,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : undefined,
        categoryId: body.category && body.category.length > 10 ? body.category : undefined,
      },
    });

    // If stock quantity per model or total stock was passed:
    if (body.stock !== undefined) {
      const productModels = await prisma.productModel.findMany({
        where: { productId: id },
      });
      if (productModels.length > 0) {
        const perModelStock = Math.floor(Number(body.stock) / productModels.length);
        for (const pm of productModels) {
          await prisma.productModel.update({
            where: {
              productId_modelId: {
                productId: id,
                modelId: pm.modelId,
              },
            },
            data: { stock: perModelStock },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
