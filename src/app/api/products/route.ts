import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db/products";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get("model");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const query = searchParams.get("q");
    const sort = searchParams.get("sort") || "newest";

    let products = await getAllProducts();

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.modelName.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Filter by model
    if (model) {
      products = products.filter(
        (p) => p.modelSlug === model || p.models?.some((m) => m.slug === model)
      );
    }

    // Filter by category
    if (category) {
      products = products.filter(
        (p) => p.categoryName.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter featured
    if (featured === "true") {
      products = products.filter((p) => p.isFeatured);
    }

    // Sort
    switch (sort) {
      case "price-low":
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "popular":
        products.sort((a, b) => b.orderCount - a.orderCount);
        break;
      default:
        // newest — keep default order
        break;
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = (body.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: slug || `case-${Date.now()}`,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice || null,
        images: body.images || [],
        badge: body.badge || null,
        isFeatured: Boolean(body.isFeatured),
        categoryId: body.category && body.category.length > 10 ? body.category : null,
      },
    });

    // Automatically link to top Qatar phone models with initial stock
    const models = await prisma.phoneModel.findMany({ take: 3 });
    const stockQty = Number(body.stock || 20);
    const perModel = Math.max(1, Math.floor(stockQty / Math.max(1, models.length)));

    for (const m of models) {
      await prisma.productModel.create({
        data: {
          productId: product.id,
          modelId: m.id,
          stock: perModel,
        },
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
